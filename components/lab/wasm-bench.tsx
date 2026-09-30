"use client"

import * as React from "react"
import { Loader2, TriangleAlert } from "lucide-react"
import { LabPanel } from "@/components/lab/lab-panel"
import { Button } from "@/components/ui/button"
import { loadMonthlyReturns } from "@/lib/lab/dataset"
import { solveFrontierJs } from "@/lib/lab/frontier-js"

const TARGET_BATCH_MS = 8
const TRIALS = 15
const MAX_BATCH = 20000
const BENCH_POINTS = 100

type BenchResult = {
  label: string
  medianMs: number
  p10Ms: number
  p90Ms: number
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

function percentile(values: number[], p: number): number {
  const sorted = [...values].sort((a, b) => a - b)
  const idx = Math.min(sorted.length - 1, Math.floor(p * sorted.length))
  return sorted[idx]
}

function yieldToPaint(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

// A single frontier_solve over 12 assets / 100 points typically finishes
// in well under a millisecond — faster than performance.now()'s clamped
// resolution in most browsers can distinguish. Timing one call at a time
// would just measure that clamp, not the algorithm, so instead: double the
// batch size until one batch takes >= TARGET_BATCH_MS, then time several
// whole batches and divide — the per-call cost is the batch time over the
// batch size, which is stable even though no single call's time is directly
// observable.
async function calibrateBatchSize(fn: () => unknown): Promise<number> {
  let batch = 1
  while (batch < MAX_BATCH) {
    const t0 = performance.now()
    for (let i = 0; i < batch; i += 1) await fn()
    if (performance.now() - t0 >= TARGET_BATCH_MS) return batch
    batch *= 2
  }
  return batch
}

async function timeBatched(fn: () => unknown, batchSize: number, trials: number): Promise<number[]> {
  const perCallMs: number[] = []
  for (let t = 0; t < trials; t += 1) {
    const t0 = performance.now()
    for (let i = 0; i < batchSize; i += 1) await fn()
    perCallMs.push((performance.now() - t0) / batchSize)
  }
  return perCallMs
}

export function WasmBench() {
  const [status, setStatus] = React.useState<"idle" | "running" | "error">("idle")
  const [wasmAvailable, setWasmAvailable] = React.useState<boolean | null>(null)
  const [results, setResults] = React.useState<BenchResult[] | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const wasm = await import("@/lib/wasm")
        await wasm.loadNumerics()
        if (alive) setWasmAvailable(true)
      } catch {
        if (alive) setWasmAvailable(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const run = async () => {
    setStatus("running")
    setError(null)
    try {
      const { moments } = await loadMonthlyReturns()
      const params = {
        covariance: moments.covariance,
        expectedReturns: moments.expectedReturns,
        assetCount: moments.assetCount,
        points: BENCH_POINTS,
        longOnly: false,
      }

      const wasm = wasmAvailable ? await import("@/lib/wasm") : null

      const bench = async (fn: () => unknown): Promise<number[]> => {
        const batchSize = await calibrateBatchSize(fn)
        await yieldToPaint()
        return timeBatched(fn, batchSize, TRIALS)
      }

      const jsSamples = await bench(() => solveFrontierJs(params))
      const out: BenchResult[] = [
        {
          label: "js (reference)",
          medianMs: median(jsSamples),
          p10Ms: percentile(jsSamples, 0.1),
          p90Ms: percentile(jsSamples, 0.9),
        },
      ]

      if (wasm) {
        await yieldToPaint()
        const wasmSamples = await bench(() => wasm.solveFrontier(params))
        out.unshift({
          label: "c++ / wasm",
          medianMs: median(wasmSamples),
          p10Ms: percentile(wasmSamples, 0.1),
          p90Ms: percentile(wasmSamples, 0.9),
        })
      }

      setResults(out)
      setStatus("idle")
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setStatus("error")
    }
  }

  const maxMs = results ? Math.max(...results.map((r) => r.medianMs)) : 1
  const barWidth = (ms: number) => Math.max(2, Math.round((ms / maxMs) * 32))

  return (
    <LabPanel
      title="WASM vs JS benchmark"
      footer={
        <>
          Both sides run the identical algorithm on identical inputs — the same efficient-frontier solve
          ({BENCH_POINTS} points). A single solve is faster than most browsers&apos; clock resolution can measure, so each
          number is a batch of calls timed together and divided back down ({TRIALS} such batches, median shown). This
          workload is branchy and cache-resident rather than memory-bandwidth-bound, which is where WASM tends to pull
          ahead of JIT&apos;d JS — a plain dot product, by contrast, usually lands close to parity.
        </>
      }
    >
      <div className="flex items-center gap-3 mb-4">
        <Button
          size="sm"
          variant="outline"
          className="border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black bg-transparent"
          onClick={run}
          disabled={status === "running"}
        >
          {status === "running" ? <Loader2 className="size-3.5 animate-spin" /> : null}
          {status === "running" ? "running…" : "Run benchmark"}
        </Button>
        {wasmAvailable === false ? (
          <span className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-500">
            <TriangleAlert className="size-3.5" /> wasm unavailable — js only
          </span>
        ) : null}
      </div>

      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

      {results ? (
        <table className="w-full text-xs font-mono border-collapse">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="pb-1 pr-3">backend</th>
              <th className="pb-1 pr-3">median</th>
              <th className="pb-1 pr-3">p10–p90</th>
              <th className="pb-1">relative</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.label} className="border-t border-gray-200 dark:border-gray-800">
                <td className="py-1.5 pr-3 whitespace-nowrap">{r.label}</td>
                <td className="py-1.5 pr-3 tabular-nums whitespace-nowrap">{r.medianMs.toFixed(3)}ms</td>
                <td className="py-1.5 pr-3 tabular-nums whitespace-nowrap text-gray-500">
                  {r.p10Ms.toFixed(3)}–{r.p90Ms.toFixed(3)}ms
                </td>
                <td className="py-1.5">
                  <span aria-hidden>{"█".repeat(barWidth(r.medianMs))}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-xs text-gray-500">Run it to see real numbers from this machine, this browser, right now.</p>
      )}
    </LabPanel>
  )
}
