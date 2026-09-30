"use client"

import * as React from "react"
import { telemetryReadouts } from "@/lib/astro"

const PERIOD_MS = 9000

// Cycles StatusBar's right-hand text through `fallback` (the page's own
// rightText — always frame 0, so e.g. "/blog" still shows its post count a
// third of the time) and a few live, zero-network ephemeris readouts.
//
// The whole hydration-safety trick: server and the FIRST client render both
// produce `fallback` — the effect only starts rotating after mount, so
// there is no server-vs-client mismatch to suppress and nothing to guess at
// server render time. Paused while the tab is hidden; static and on frame 0
// under prefers-reduced-motion.
export function useCyclingTelemetry(fallback: string): string {
  const [frame, setFrame] = React.useState<string | null>(null)

  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const lines = () => [fallback, ...telemetryReadouts(new Date())]

    if (reduced) {
      setFrame(fallback)
      return
    }

    let index = 0
    const id = window.setInterval(() => {
      if (document.hidden) return
      index += 1
      const l = lines()
      setFrame(l[index % l.length])
    }, PERIOD_MS)

    return () => window.clearInterval(id)
  }, [fallback])

  return frame ?? fallback
}
