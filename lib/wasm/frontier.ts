// Marshalling layer for the efficient-frontier solver. Mirrors
// cpp/include/limits.h — keep MAX_ASSETS / MAX_FRONTIER_POINTS in sync with
// numerics::kMaxAssets / kMaxFrontierPoints.
import { loadNumerics } from "@/lib/wasm/numerics-module"

export const MAX_ASSETS = 32
export const MAX_FRONTIER_POINTS = 128

export type FrontierInput = {
  /** Row-major n x n covariance. */
  covariance: Float64Array<ArrayBuffer>
  /** Length-n expected returns. */
  expectedReturns: Float64Array<ArrayBuffer>
  assetCount: number
  points?: number
  lambdaMin?: number
  lambdaMax?: number
  longOnly?: boolean
  /** Diagonal loading, as a fraction of mean(diag(cov)). Guards a singular cov. */
  ridge?: number
}

export type FrontierPoint = {
  risk: number
  expectedReturn: number
  riskAversion: number
  /** Owned copy, length assetCount. Safe to retain. */
  weights: Float64Array<ArrayBuffer>
}

const FRONTIER_ERRORS: Record<number, string> = {
  [-1]: "asset count out of range",
  [-2]: "requested point count or risk-aversion range out of range",
  [-3]: "covariance matrix is not positive definite (try a larger ridge)",
}

export async function solveFrontier(input: FrontierInput): Promise<FrontierPoint[]> {
  const n = input.assetCount
  const points = input.points ?? 100

  if (n < 2 || n > MAX_ASSETS) throw new RangeError(`assetCount must be in [2, ${MAX_ASSETS}]`)
  if (points < 2 || points > MAX_FRONTIER_POINTS) {
    throw new RangeError(`points must be in [2, ${MAX_FRONTIER_POINTS}]`)
  }
  if (input.covariance.length < n * n) throw new RangeError("covariance is too small for assetCount")
  if (input.expectedReturns.length < n) throw new RangeError("expectedReturns is too small for assetCount")

  const { exports, offsets, f64 } = await loadNumerics()

  // Pointers are byte offsets; >>> 3 converts to a Float64 index. Valid
  // because every arena in frontier.cpp is declared alignas(8).
  {
    const heap = f64()
    heap.set(input.covariance.subarray(0, n * n), offsets.cov >>> 3)
    heap.set(input.expectedReturns.subarray(0, n), offsets.mu >>> 3)
  }

  const written = exports.frontier_solve(
    n,
    points,
    input.lambdaMin ?? 0.5,
    input.lambdaMax ?? 200,
    input.longOnly === true ? 1 : 0,
    input.ridge ?? 1e-8,
  )

  if (written < 0) {
    throw new Error(`frontier_solve failed: ${FRONTIER_ERRORS[written] ?? `code ${written}`}`)
  }

  // Re-acquire the heap view after the call. A no-op today under
  // ALLOW_MEMORY_GROWTH=0, but it's what makes that guarantee load-bearing
  // rather than assumed.
  const heap = f64()
  const sigmaBase = offsets.frontierSigma >>> 3
  const muBase = offsets.frontierMu >>> 3
  const lambdaBase = offsets.frontierLambda >>> 3
  const wBase = offsets.frontierW >>> 3

  const result: FrontierPoint[] = new Array(written)
  for (let i = 0; i < written; i += 1) {
    result[i] = {
      risk: heap[sigmaBase + i],
      expectedReturn: heap[muBase + i],
      riskAversion: heap[lambdaBase + i],
      // .slice() copies out of linear memory. Never hand out a .subarray()
      // here: it would alias WASM memory and the next solve would clobber it.
      weights: heap.slice(wBase + i * n, wBase + i * n + n),
    }
  }
  return result
}
