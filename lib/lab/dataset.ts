import type { Dataset } from "@/lib/lab/types"

export type MomentEstimate = {
  tickers: string[]
  names: string[]
  assetCount: number
  /** Annualized. Row-major n x n. */
  covariance: Float64Array<ArrayBuffer>
  /** Annualized. */
  expectedReturns: Float64Array<ArrayBuffer>
  periodsPerYear: number
  sampleSize: number
}

let cached: Promise<{ dataset: Dataset; moments: MomentEstimate }> | null = null

export function loadMonthlyReturns() {
  if (cached === null) {
    cached = fetchAndEstimate()
  }
  return cached
}

async function fetchAndEstimate() {
  const response = await fetch("/data/monthly-returns.json")
  if (!response.ok) throw new Error(`failed to fetch dataset: ${response.status}`)
  const dataset = (await response.json()) as Dataset

  const moments = estimateMoments(dataset)
  return { dataset, moments }
}

// Sample mean + covariance of the return matrix, annualized. This is
// ordinary statistics (not the WASM solver's job) — the solver only ever
// sees the numbers this produces.
function estimateMoments(dataset: Dataset): MomentEstimate {
  const n = dataset.tickers.length
  const T = dataset.returns.length
  const periodsPerYear = dataset.periodsPerYear

  const mean = new Float64Array(n)
  for (const row of dataset.returns) {
    for (let i = 0; i < n; i += 1) mean[i] += row[i]
  }
  for (let i = 0; i < n; i += 1) mean[i] /= T

  const covariance = new Float64Array(n * n)
  for (const row of dataset.returns) {
    for (let i = 0; i < n; i += 1) {
      const di = row[i] - mean[i]
      for (let j = 0; j < n; j += 1) {
        covariance[i * n + j] += di * (row[j] - mean[j])
      }
    }
  }
  // Sample covariance (Bessel-corrected), then annualize: mean * periods,
  // covariance * periods (returns are ~independent across months here).
  const denom = T - 1
  for (let k = 0; k < covariance.length; k += 1) covariance[k] = (covariance[k] / denom) * periodsPerYear

  const expectedReturns = new Float64Array(n)
  for (let i = 0; i < n; i += 1) expectedReturns[i] = mean[i] * periodsPerYear

  return {
    tickers: dataset.tickers,
    names: dataset.names,
    assetCount: n,
    covariance,
    expectedReturns,
    periodsPerYear,
    sampleSize: T,
  }
}
