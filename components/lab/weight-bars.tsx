type WeightBarsProps = {
  tickers: string[]
  weights: Float64Array<ArrayBuffer> | number[]
}

const BAR_WIDTH = 16

// Renders a portfolio's weight vector as ASCII bars, e.g.
// "US-EQ   ████████░░░░░░░░  31.2%" — matches the site's monospace,
// no-chart-library aesthetic instead of drawing a second, redundant chart.
export function WeightBars({ tickers, weights }: WeightBarsProps) {
  const maxTickerLen = Math.max(...tickers.map((t) => t.length))

  return (
    <div className="font-mono text-xs leading-relaxed">
      {tickers.map((ticker, i) => {
        const w = Math.max(0, weights[i] ?? 0)
        const filled = Math.round(w * BAR_WIDTH)
        const bar = "█".repeat(filled) + "░".repeat(Math.max(0, BAR_WIDTH - filled))
        const pct = (w * 100).toFixed(1)
        return (
          <div key={ticker} className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-500">{ticker.padEnd(maxTickerLen)}</span>
            <span aria-hidden className={w < 0.001 ? "text-gray-300 dark:text-gray-700" : ""}>
              {bar}
            </span>
            <span className="tabular-nums w-14 text-right">{pct}%</span>
          </div>
        )
      })}
    </div>
  )
}
