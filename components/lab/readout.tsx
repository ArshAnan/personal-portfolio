import type * as React from "react"

type ReadoutProps = {
  label: string
  value: React.ReactNode
}

// A single label/value monospace row, e.g. "steps  4,201". Used for the
// small instrumentation strips under each demo (energy drift, solve time).
export function Readout({ label, value }: ReadoutProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-xs">
      <span className="text-gray-500 dark:text-gray-500">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}
