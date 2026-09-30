"use client"

import * as React from "react"
import { Loader2, TriangleAlert } from "lucide-react"
import { LabPanel } from "@/components/lab/lab-panel"
import { WeightBars } from "@/components/lab/weight-bars"
import { loadMonthlyReturns, type MomentEstimate } from "@/lib/lab/dataset"
import { solveFrontierJs } from "@/lib/lab/frontier-js"
import type { FrontierPoint } from "@/lib/lab/types"

const SVG_WIDTH = 640
const SVG_HEIGHT = 360
const MARGIN = { left: 56, right: 16, top: 16, bottom: 36 }
const POINTS = 90

type SolveFn = (params: {
  covariance: Float64Array<ArrayBuffer>
  expectedReturns: Float64Array<ArrayBuffer>
  assetCount: number
  points?: number
  longOnly?: boolean
}) => Promise<FrontierPoint[]>

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; solve: SolveFn; backend: "wasm" | "js"; initMs: number; reason?: string }
  | { kind: "error"; message: string }

export function EfficientFrontier() {
  const [load, setLoad] = React.useState<LoadState>({ kind: "loading" })
  const [moments, setMoments] = React.useState<MomentEstimate | null>(null)
  const [datasetError, setDatasetError] = React.useState<string | null>(null)
  const [longOnly, setLongOnly] = React.useState(false)
  const [points, setPoints] = React.useState<FrontierPoint[] | null>(null)
  const [solveMs, setSolveMs] = React.useState<number | null>(null)
  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null)
  const [riskFreeRate, setRiskFreeRate] = React.useState(0.02)

  // Load the WASM solver (dynamic import: keeps it out of /lab's initial JS,
  // and its module scope must stay inert during SSR anyway) with a pure-TS
  // fallback if it fails for any reason — a fetch hiccup, a browser without
  // WASM, a stale-cache ABI mismatch.
  React.useEffect(() => {
    let alive = true
    ;(async () => {
      const t0 = performance.now()
      try {
        const wasm = await import("@/lib/wasm")
        await wasm.loadNumerics()
        if (!alive) return
        setLoad({ kind: "ready", solve: wasm.solveFrontier, backend: "wasm", initMs: performance.now() - t0 })
      } catch (err) {
        if (!alive) return
        setLoad({
          kind: "ready",
          solve: (p) => Promise.resolve(solveFrontierJs(p)),
          backend: "js",
          initMs: performance.now() - t0,
          reason: err instanceof Error ? err.message : String(err),
        })
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  React.useEffect(() => {
    let alive = true
    loadMonthlyReturns()
      .then(({ moments }) => {
        if (alive) setMoments(moments)
      })
      .catch((err: unknown) => {
        if (alive) setDatasetError(err instanceof Error ? err.message : String(err))
      })
    return () => {
      alive = false
    }
  }, [])

  React.useEffect(() => {
    if (load.kind !== "ready" || moments === null) return
    let alive = true
    ;(async () => {
      const t0 = performance.now()
      try {
        const result = await load.solve({
          covariance: moments.covariance,
          expectedReturns: moments.expectedReturns,
          assetCount: moments.assetCount,
          points: POINTS,
          longOnly,
        })
        if (!alive) return
        setPoints(result)
        setSolveMs(performance.now() - t0)
        setHoverIdx(null)
      } catch (err) {
        if (!alive) return
        setDatasetError(err instanceof Error ? err.message : String(err))
      }
    })()
    return () => {
      alive = false
    }
  }, [load, moments, longOnly])

  const meta =
    load.kind === "ready" ? (
      <span>
        {load.backend === "wasm" ? "c++ / wasm" : "js fallback"} · init {load.initMs.toFixed(1)}ms
        {solveMs !== null ? ` · solve ${solveMs.toFixed(2)}ms` : ""}
      </span>
    ) : null

  return (
    <LabPanel
      title="Efficient frontier"
      meta={meta}
      footer={
        <>
          Sample mean/covariance from a modeled 10-year monthly return series for {moments?.assetCount ?? 12} asset
          classes (not live market data — see the note in the dataset). Solved as a sweep over risk-aversion λ:
          minimize (λ/2)wᵀΣw − μᵀw subject to 1ᵀw = 1.
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-4 text-xs">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={longOnly}
            onChange={(e) => setLongOnly(e.target.checked)}
            className="size-3.5 accent-black dark:accent-white"
          />
          long-only (no short selling)
        </label>
        <label className="flex items-center gap-2">
          risk-free rate
          <input
            type="range"
            min={0}
            max={0.08}
            step={0.005}
            value={riskFreeRate}
            onChange={(e) => setRiskFreeRate(Number(e.target.value))}
            className="w-28 accent-black dark:accent-white"
          />
          <span className="tabular-nums w-10">{(riskFreeRate * 100).toFixed(1)}%</span>
        </label>
      </div>

      {datasetError ? (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 py-8">
          <TriangleAlert className="size-4" /> {datasetError}
        </div>
      ) : points === null || moments === null ? (
        <div className="flex items-center justify-center gap-2 h-[360px] text-sm text-gray-500">
          <Loader2 className="size-4 animate-spin" /> solving…
        </div>
      ) : (
        <FrontierChart points={points} riskFreeRate={riskFreeRate} hoverIdx={hoverIdx} onHover={setHoverIdx} />
      )}

      <div className="mt-4 h-32 border border-gray-300 dark:border-gray-700 p-3 overflow-auto" aria-live="polite">
        {points !== null && moments !== null && hoverIdx !== null ? (
          <div>
            <div className="text-xs text-gray-500 mb-2">
              σ {(points[hoverIdx].risk * 100).toFixed(2)}% · μ {(points[hoverIdx].expectedReturn * 100).toFixed(2)}%
              · λ {points[hoverIdx].riskAversion.toFixed(1)}
            </div>
            <WeightBars tickers={moments.tickers} weights={points[hoverIdx].weights} />
          </div>
        ) : (
          <p className="text-xs text-gray-500">Hover or focus a point on the curve to see its weights.</p>
        )}
      </div>

      {points !== null && moments !== null ? (
        <details className="mt-4 text-xs">
          <summary className="cursor-pointer text-gray-500">Table of sampled portfolios (accessible view)</summary>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pr-3 py-1">σ</th>
                  <th className="pr-3 py-1">μ</th>
                  {moments.tickers.map((t) => (
                    <th key={t} className="pr-3 py-1">
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleEvenly(points, 10).map((p, idx) => (
                  <tr key={idx} className="border-t border-gray-200 dark:border-gray-800">
                    <td className="pr-3 py-1 tabular-nums">{(p.risk * 100).toFixed(1)}%</td>
                    <td className="pr-3 py-1 tabular-nums">{(p.expectedReturn * 100).toFixed(1)}%</td>
                    {Array.from(p.weights).map((w, i) => (
                      <td key={i} className="pr-3 py-1 tabular-nums">
                        {(w * 100).toFixed(0)}%
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ) : null}
    </LabPanel>
  )
}

function sampleEvenly<T>(arr: T[], count: number): T[] {
  if (arr.length <= count) return arr
  const out: T[] = []
  for (let i = 0; i < count; i += 1) out.push(arr[Math.round((i * (arr.length - 1)) / (count - 1))])
  return out
}

function FrontierChart({
  points,
  riskFreeRate,
  hoverIdx,
  onHover,
}: {
  points: FrontierPoint[]
  riskFreeRate: number
  hoverIdx: number | null
  onHover: (i: number | null) => void
}) {
  const sigmaMax = Math.max(...points.map((p) => p.risk)) * 1.08
  const muValues = points.map((p) => p.expectedReturn)
  const muMin = Math.min(0, ...muValues) * 1.1
  const muMax = Math.max(...muValues) * 1.15

  const plotW = SVG_WIDTH - MARGIN.left - MARGIN.right
  const plotH = SVG_HEIGHT - MARGIN.top - MARGIN.bottom

  const xScale = (sigma: number) => MARGIN.left + (sigma / sigmaMax) * plotW
  const yScale = (mu: number) => SVG_HEIGHT - MARGIN.bottom - ((mu - muMin) / (muMax - muMin)) * plotH

  // Tangency portfolio: the point maximizing the Sharpe ratio (mu - rf) / sigma.
  let tangencyIdx = -1
  let bestSharpe = -Infinity
  points.forEach((p, i) => {
    if (p.risk <= 1e-9) return
    const sharpe = (p.expectedReturn - riskFreeRate) / p.risk
    if (sharpe > bestSharpe) {
      bestSharpe = sharpe
      tangencyIdx = i
    }
  })
  const tangency = tangencyIdx >= 0 ? points[tangencyIdx] : null

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.risk).toFixed(2)} ${yScale(p.expectedReturn).toFixed(2)}`)
    .join(" ")

  return (
    <svg
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      className="w-full h-auto text-black dark:text-white"
      role="img"
      aria-label={`Efficient frontier scatter plot, risk on the x axis from 0 to ${(sigmaMax * 100).toFixed(0)} percent, expected return on the y axis. ${points.length} portfolios plotted; a table view is available below.`}
    >
      {/* axes */}
      <line x1={MARGIN.left} y1={SVG_HEIGHT - MARGIN.bottom} x2={SVG_WIDTH - MARGIN.right} y2={SVG_HEIGHT - MARGIN.bottom} stroke="currentColor" strokeOpacity={0.3} />
      <line x1={MARGIN.left} y1={MARGIN.top} x2={MARGIN.left} y2={SVG_HEIGHT - MARGIN.bottom} stroke="currentColor" strokeOpacity={0.3} />

      <text x={MARGIN.left} y={SVG_HEIGHT - 8} fontSize={10} fill="currentColor" opacity={0.6}>
        risk (σ, annualized) →
      </text>
      <text x={8} y={MARGIN.top + 4} fontSize={10} fill="currentColor" opacity={0.6} transform={`rotate(-90 8 ${MARGIN.top + 4})`}>
        expected return (μ) →
      </text>
      <text x={MARGIN.left} y={SVG_HEIGHT - MARGIN.bottom + 14} fontSize={9} fill="currentColor" opacity={0.5}>
        0%
      </text>
      <text x={SVG_WIDTH - MARGIN.right} y={SVG_HEIGHT - MARGIN.bottom + 14} fontSize={9} fill="currentColor" opacity={0.5} textAnchor="end">
        {(sigmaMax * 100).toFixed(0)}%
      </text>

      {/* capital market line, through (0, rf) and the tangency portfolio */}
      {tangency ? (
        <line
          x1={xScale(0)}
          y1={yScale(riskFreeRate)}
          x2={xScale(sigmaMax)}
          y2={yScale(riskFreeRate + (bestSharpe * sigmaMax))}
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeDasharray="4 3"
        />
      ) : null}

      {/* frontier curve */}
      <path d={pathD} fill="none" stroke="currentColor" strokeWidth={1.5} opacity={0.8} />

      {points.map((p, i) => {
        const cx = xScale(p.risk)
        const cy = yScale(p.expectedReturn)
        const isHover = hoverIdx === i
        const isTangency = tangencyIdx === i
        return (
          <g key={i}>
            <circle
              cx={cx}
              cy={cy}
              r={isHover || isTangency ? 4 : 2.5}
              fill={isHover || isTangency ? "var(--lab-accent)" : "currentColor"}
            />
            <circle
              cx={cx}
              cy={cy}
              r={9}
              fill="transparent"
              tabIndex={0}
              role="button"
              aria-label={`Portfolio: risk ${(p.risk * 100).toFixed(1)} percent, return ${(p.expectedReturn * 100).toFixed(1)} percent`}
              className="cursor-pointer outline-none"
              onMouseEnter={() => onHover(i)}
              onFocus={() => onHover(i)}
              onClick={() => onHover(i)}
            />
          </g>
        )
      })}
      {tangency ? (
        <text x={xScale(tangency.risk) + 8} y={yScale(tangency.expectedReturn) - 8} fontSize={9} fill="currentColor" opacity={0.7}>
          tangency
        </text>
      ) : null}
    </svg>
  )
}
