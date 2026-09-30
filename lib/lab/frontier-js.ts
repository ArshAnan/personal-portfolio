// Pure-TypeScript reference implementation of the efficient-frontier solver.
// Deliberately mirrors cpp/src/frontier.cpp step for step — same closed-form
// two-fund separation for the unconstrained case, same warm-started FISTA
// projected gradient for long-only — so the WASM/JS benchmark panel is
// comparing the same algorithm, not two different ones, and so this can
// serve as the graceful-degradation path if WASM fails to load.
import type { FrontierParams, FrontierPoint } from "@/lib/lab/types"

function choleskyFactor(a: Float64Array<ArrayBuffer>, n: number, ridge: number): Float64Array<ArrayBuffer> | null {
  let meanDiag = 0
  for (let i = 0; i < n; i += 1) meanDiag += a[i * n + i]
  meanDiag /= n
  const loading = ridge * meanDiag

  const l = new Float64Array(n * n)
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j <= i; j += 1) {
      let sum = a[i * n + j]
      for (let k = 0; k < j; k += 1) sum -= l[i * n + k] * l[j * n + k]
      if (i === j) {
        const diag = sum + loading
        if (diag <= 0) return null
        l[i * n + i] = Math.sqrt(diag)
      } else {
        l[i * n + j] = sum / l[j * n + j]
      }
    }
  }
  return l
}

function choleskySolve(l: Float64Array<ArrayBuffer>, n: number, b: Float64Array<ArrayBuffer>): Float64Array<ArrayBuffer> {
  const x = new Float64Array(n)
  for (let i = 0; i < n; i += 1) {
    let sum = b[i]
    for (let k = 0; k < i; k += 1) sum -= l[i * n + k] * x[k]
    x[i] = sum / l[i * n + i]
  }
  for (let i = n - 1; i >= 0; i -= 1) {
    let sum = x[i]
    for (let k = i + 1; k < n; k += 1) sum -= l[k * n + i] * x[k]
    x[i] = sum / l[i * n + i]
  }
  return x
}

function matvec(a: Float64Array<ArrayBuffer>, n: number, x: Float64Array<ArrayBuffer>): Float64Array<ArrayBuffer> {
  const out = new Float64Array(n)
  for (let i = 0; i < n; i += 1) {
    let sum = 0
    for (let j = 0; j < n; j += 1) sum += a[i * n + j] * x[j]
    out[i] = sum
  }
  return out
}

// Euclidean projection onto the probability simplex (Duchi et al.).
function projectSimplex(w: Float64Array<ArrayBuffer>, n: number): Float64Array<ArrayBuffer> {
  const sorted = Array.from(w.subarray(0, n)).sort((a, b) => b - a)
  let cumsum = 0
  let theta = 0
  for (let j = 0; j < n; j += 1) {
    cumsum += sorted[j]
    const candidate = (cumsum - 1) / (j + 1)
    if (sorted[j] - candidate > 0) theta = candidate
  }
  const out = new Float64Array(n)
  for (let i = 0; i < n; i += 1) out[i] = Math.max(w[i] - theta, 0)
  return out
}

function solveLongOnly(lambda: number, n: number, cov: Float64Array<ArrayBuffer>, mu: Float64Array<ArrayBuffer>, lBound: number, warmStart: Float64Array<ArrayBuffer>): Float64Array<ArrayBuffer> {
  const step = 1 / (lambda * lBound)
  const kMaxIters = 300
  const kTol = 1e-10

  let w = warmStart
  let y = Float64Array.from(warmStart)
  let t = 1

  for (let iter = 0; iter < kMaxIters; iter += 1) {
    const grad = matvec(cov, n, y)
    for (let i = 0; i < n; i += 1) grad[i] = lambda * grad[i] - mu[i]

    const stepPoint = new Float64Array(n)
    for (let i = 0; i < n; i += 1) stepPoint[i] = y[i] - step * grad[i]

    const wNext = projectSimplex(stepPoint, n)
    const tNext = (1 + Math.sqrt(1 + 4 * t * t)) / 2
    const momentum = (t - 1) / tNext

    let diff2 = 0
    const yNext = new Float64Array(n)
    for (let i = 0; i < n; i += 1) {
      const d = wNext[i] - w[i]
      diff2 += d * d
      yNext[i] = wNext[i] + momentum * d
    }

    w = wNext
    y = yNext
    t = tNext
    if (diff2 < kTol * kTol) break
  }

  return w
}

export function solveFrontierJs(params: FrontierParams): FrontierPoint[] {
  const n = params.assetCount
  const points = params.points ?? 100
  const lambdaMin = params.lambdaMin ?? 0.5
  const lambdaMax = params.lambdaMax ?? 200
  const longOnly = params.longOnly ?? false
  const ridge = params.ridge ?? 1e-8
  const cov = params.covariance
  const mu = params.expectedReturns

  if (n < 2) throw new RangeError("assetCount must be >= 2")
  if (points < 2) throw new RangeError("points must be >= 2")
  if (lambdaMin <= 0 || lambdaMax <= lambdaMin) throw new RangeError("invalid lambda range")

  const chol = choleskyFactor(cov, n, ridge)
  if (chol === null) throw new Error("covariance matrix is not positive definite (try a larger ridge)")

  const u = choleskySolve(chol, n, mu)
  const ones = new Float64Array(n).fill(1)
  const v = choleskySolve(chol, n, ones)

  let sumU = 0
  let sumV = 0
  for (let i = 0; i < n; i += 1) {
    sumU += u[i]
    sumV += v[i]
  }

  let gershgorin = 0
  let w = new Float64Array(n).fill(1 / n)
  if (longOnly) {
    for (let i = 0; i < n; i += 1) {
      let rowSum = 0
      for (let j = 0; j < n; j += 1) rowSum += Math.abs(cov[i * n + j])
      if (rowSum > gershgorin) gershgorin = rowSum
    }
    if (gershgorin <= 0) gershgorin = 1
  }

  const logMin = Math.log(lambdaMin)
  const logMax = Math.log(lambdaMax)
  const result: FrontierPoint[] = new Array(points)

  for (let k = 0; k < points; k += 1) {
    const frac = points === 1 ? 0 : k / (points - 1)
    const lambda = Math.exp(logMin + frac * (logMax - logMin))

    let weights: Float64Array<ArrayBuffer>
    if (!longOnly) {
      const nu = (lambda - sumU) / sumV
      weights = new Float64Array(n)
      for (let i = 0; i < n; i += 1) weights[i] = (u[i] + nu * v[i]) / lambda
    } else {
      w = solveLongOnly(lambda, n, cov, mu, gershgorin, w)
      weights = w.slice()
    }

    let sigma2 = 0
    let muP = 0
    for (let i = 0; i < n; i += 1) {
      muP += weights[i] * mu[i]
      let row = 0
      for (let j = 0; j < n; j += 1) row += cov[i * n + j] * weights[j]
      sigma2 += weights[i] * row
    }

    result[k] = {
      risk: sigma2 > 0 ? Math.sqrt(sigma2) : 0,
      expectedReturn: muP,
      riskAversion: lambda,
      weights,
    }
  }

  return result
}
