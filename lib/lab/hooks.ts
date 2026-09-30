"use client"

import * as React from "react"

const PALETTE_TOKENS = ["--lab-ink", "--lab-paper", "--lab-grid", "--lab-muted", "--lab-accent"] as const

export type LabPalette = Record<(typeof PALETTE_TOKENS)[number], string>

// Reads the --lab-* custom properties (see app/globals.css) off `ref`,
// re-reading whenever <html>'s class list changes or the OS color-scheme
// flips. Deliberately does NOT call useTheme(): the theme provider can
// resolve to the literal "system" and never listens for an OS-level theme
// change at runtime, so a canvas that branched on that hook's value would
// render stale colors for "system" users after a live OS theme flip. The
// class attribute on <html> is the actual single source of truth for the
// resolved theme, in every case.
//
// Returns null until after mount, which is exactly the "don't draw yet"
// signal a canvas effect wants — there's no server-rendered value to get
// wrong, so this creates no hydration mismatch.
export function useLabPalette(ref: React.RefObject<HTMLElement | null>): LabPalette | null {
  const [palette, setPalette] = React.useState<LabPalette | null>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const read = () => {
      const cs = getComputedStyle(el)
      const next = {} as LabPalette
      for (const token of PALETTE_TOKENS) next[token] = cs.getPropertyValue(token).trim()
      setPalette((prev) => (prev && PALETTE_TOKENS.every((t) => prev[t] === next[t]) ? prev : next))
    }

    read()

    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    media.addEventListener("change", read)

    return () => {
      observer.disconnect()
      media.removeEventListener("change", read)
    }
  }, [ref])

  return palette
}

// Sizes `canvasRef`'s backing store to match `wrapperRef`'s CSS size times
// devicePixelRatio (capped at 2), so canvas drawing stays crisp on HiDPI
// screens without paying 9x fill rate on a 3x phone. Observes the wrapper,
// not the canvas itself — observing an element you resize inside the same
// callback is a classic ResizeObserver-loop footgun.
export function useHiDpiCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  wrapperRef: React.RefObject<HTMLElement | null>,
  onResize: (width: number, height: number) => void,
) {
  const onResizeRef = React.useRef(onResize)
  onResizeRef.current = onResize

  React.useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

    const apply = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = wrapper.getBoundingClientRect()
      const width = Math.max(1, Math.round(rect.width))
      const height = Math.max(1, Math.round(rect.height))

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      // Setting .width/.height resets the 2D context's transform AND clears
      // the buffer, so this must run after those assignments, not before.
      canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0)
      onResizeRef.current(width, height)
    }

    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [canvasRef, wrapperRef])
}

// True once the user's OS/browser has "reduce motion" set. Read once at
// mount (an accessibility preference changing mid-session without a reload
// is rare enough not to warrant a live listener here, unlike the palette).
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])
  return reduced
}
