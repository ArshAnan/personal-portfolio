// One-off generator for public/data/monthly-returns.json, consumed by the
// /lab efficient-frontier demo. This is NOT live or historical market data —
// it's a seeded, reproducible factor-model simulation calibrated to
// roughly realistic asset-class means/vols/correlations, which keeps the
// demo fully self-contained (no market-data API, no key, nothing that can
// rot). /lab says so explicitly; see components/lab/efficient-frontier.tsx.
//
// Re-run only if you want to regenerate the dataset (it won't change unless
// this file or its constants change — the PRNG is seeded).
import { writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const outPath = path.join(root, "public/data/monthly-returns.json")

const MONTHS = 120 // 10 years

// Each asset: annualized mean/vol, and how its variance splits across three
// common factors (market, rates, commodity) plus idiosyncratic noise. Loadings
// must sum to 1 per row — that's what makes Var(return_i) come out at sigma_i^2.
const ASSETS = [
  { ticker: "US-EQ", name: "US Equity", meanAnnual: 0.10, volAnnual: 0.16, load: [0.85, 0.02, 0.03] },
  { ticker: "US-TECH", name: "US Tech", meanAnnual: 0.13, volAnnual: 0.22, load: [0.80, 0.00, 0.02] },
  { ticker: "INTL-DEV", name: "Intl Developed Equity", meanAnnual: 0.07, volAnnual: 0.18, load: [0.75, 0.03, 0.05] },
  { ticker: "EM", name: "Emerging Markets", meanAnnual: 0.08, volAnnual: 0.24, load: [0.65, 0.02, 0.10] },
  { ticker: "UST-LONG", name: "US Treasuries (Long)", meanAnnual: 0.04, volAnnual: 0.14, load: [0.00, 0.85, 0.00] },
  { ticker: "UST-INT", name: "US Treasuries (Intermediate)", meanAnnual: 0.03, volAnnual: 0.06, load: [0.00, 0.80, 0.00] },
  { ticker: "CORP-BOND", name: "Corporate Bonds", meanAnnual: 0.045, volAnnual: 0.08, load: [0.15, 0.55, 0.00] },
  { ticker: "GOLD", name: "Gold", meanAnnual: 0.06, volAnnual: 0.15, load: [0.02, 0.10, 0.35] },
  { ticker: "REIT", name: "REITs", meanAnnual: 0.08, volAnnual: 0.20, load: [0.60, 0.15, 0.02] },
  { ticker: "ENERGY", name: "Energy Sector", meanAnnual: 0.07, volAnnual: 0.28, load: [0.55, 0.00, 0.35] },
  { ticker: "FINANCIALS", name: "Financials Sector", meanAnnual: 0.09, volAnnual: 0.24, load: [0.75, 0.10, 0.02] },
  { ticker: "COMMOD", name: "Broad Commodities", meanAnnual: 0.03, volAnnual: 0.18, load: [0.10, 0.00, 0.70] },
]

// mulberry32: tiny seeded PRNG, deterministic across platforms/Node versions.
function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeGaussian(rng) {
  // Box-Muller, caching the second value of each pair.
  let spare = null
  return function () {
    if (spare !== null) {
      const v = spare
      spare = null
      return v
    }
    let u = 0
    let v = 0
    while (u === 0) u = rng()
    while (v === 0) v = rng()
    const mag = Math.sqrt(-2.0 * Math.log(u))
    spare = mag * Math.sin(2.0 * Math.PI * v)
    return mag * Math.cos(2.0 * Math.PI * v)
  }
}

const rng = mulberry32(0xa5f00d)
const gaussian = makeGaussian(rng)

const marketFactor = Array.from({ length: MONTHS }, () => gaussian())
const ratesFactor = Array.from({ length: MONTHS }, () => gaussian())
const commodFactor = Array.from({ length: MONTHS }, () => gaussian())

const returns = []
for (let t = 0; t < MONTHS; t += 1) {
  const row = ASSETS.map((asset) => {
    const meanMonthly = asset.meanAnnual / 12
    const volMonthly = asset.volAnnual / Math.sqrt(12)
    const [mktLoad, ratesLoad, commodLoad] = asset.load
    const idioLoad = 1 - mktLoad - ratesLoad - commodLoad
    const idio = gaussian()

    const z =
      Math.sqrt(mktLoad) * marketFactor[t] +
      Math.sqrt(ratesLoad) * ratesFactor[t] +
      Math.sqrt(commodLoad) * commodFactor[t] +
      Math.sqrt(Math.max(idioLoad, 0)) * idio

    return Number((meanMonthly + volMonthly * z).toFixed(6))
  })
  returns.push(row)
}

const dataset = {
  note:
    "Modeled data: a seeded 3-factor simulation calibrated to roughly realistic asset-class " +
    "means/vols/correlations, not live or historical market data. See scripts/gen-dataset.mjs.",
  tickers: ASSETS.map((a) => a.ticker),
  names: ASSETS.map((a) => a.name),
  periodsPerYear: 12,
  returns,
}

await writeFile(outPath, JSON.stringify(dataset))
console.log(`wrote ${path.relative(root, outPath)}: ${ASSETS.length} assets x ${MONTHS} months`)
