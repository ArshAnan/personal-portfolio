"use client"

import * as React from "react"
import { Pause, Play, RotateCcw, SkipForward, TriangleAlert } from "lucide-react"
import { LabPanel } from "@/components/lab/lab-panel"
import { Readout } from "@/components/lab/readout"
import { Button } from "@/components/ui/button"
import { useHiDpiCanvas, useLabPalette, usePrefersReducedMotion } from "@/lib/lab/hooks"
import {
  createNBodyStateJs,
  energyDriftJs,
  stepEulerJs,
  stepLeapfrogJs,
  type NBodyStateJs,
} from "@/lib/lab/nbody-js"
import type { createNBodySimulation, NBodySimulation } from "@/lib/wasm"

type BodyDef = {
  label: string
  color: string
  mass: number
  position: [number, number, number]
  velocity: [number, number, number]
  radiusPx: number
}

const G = 1
const SOFTENING = 0.5
// World half-extent the view fits, in sim units — covers the outermost orbit
// (radius 110) with room to spare.
const REACH = 145

// A central mass with three planets, none of them test particles — all four
// bodies pull on each other, so the "eccentric" planet visibly perturbs the
// others' orbits over time rather than tracing a fixed ellipse forever.
const INITIAL_BODIES: BodyDef[] = [
  { label: "sun", color: "#eab308", mass: 400, position: [0, 0, 0], velocity: [0, 0, 0], radiusPx: 7 },
  { label: "planet 1", color: "#3b82f6", mass: 1, position: [40, 0, 0], velocity: [0, Math.sqrt(400 / 40), 0], radiusPx: 3 },
  { label: "planet 2", color: "#22c55e", mass: 2, position: [70, 0, 0], velocity: [0, Math.sqrt(400 / 70), 0], radiusPx: 4 },
  {
    label: "planet 3 (eccentric)",
    color: "#ec4899",
    mass: 1.5,
    position: [110, 0, 0],
    velocity: [0, Math.sqrt(400 / 110) * 0.82, 0],
    radiusPx: 3.5,
  },
]

type Integrator = "leapfrog" | "euler"
type Backend = "wasm" | "js"

// Both the WASM simulation and the two pure-JS step functions get wrapped
// to this one shape, so the render loop and controls don't need to know
// which backend or integrator is actually running.
type SimAdapter = {
  positions: () => Float64Array
  step: (dt: number) => void
  energyDrift: () => number
  t: () => number
}

function wrapWasmSim(sim: NBodySimulation): SimAdapter {
  let t = 0
  return {
    positions: () => sim.positions,
    step: (dt) => {
      sim.step(dt)
      t += dt
    },
    energyDrift: () => sim.energyDrift(),
    t: () => t,
  }
}

function wrapJsSim(state: NBodyStateJs, stepFn: typeof stepLeapfrogJs): SimAdapter {
  return {
    positions: () => state.pos,
    step: (dt) => stepFn(state, dt),
    energyDrift: () => energyDriftJs(state),
    t: () => state.t,
  }
}

function hexToRgba(hex: string, alpha: number): string {
  // getComputedStyle normalizes "#ffffff" down to the shorthand "#fff" —
  // expand that back to 6 digits first, or slice(2,4)/slice(4,6) silently
  // read past the end of a 3-char string and produce a wrong color (this
  // is exactly how the trail fade briefly ended up solid red in light mode).
  let clean = hex.replace("#", "").trim()
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("")
  }
  const r = parseInt(clean.slice(0, 2), 16) || 0
  const g = parseInt(clean.slice(2, 4), 16) || 0
  const b = parseInt(clean.slice(4, 6), 16) || 0
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

type WasmState =
  | { status: "loading" }
  | { status: "ready"; createSim: typeof createNBodySimulation }
  | { status: "unavailable"; reason: string }

export function NBody() {
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  const [running, setRunning] = React.useState(false)
  const [dt, setDt] = React.useState(0.05)
  const [trails, setTrails] = React.useState(true)
  const [integrator, setIntegrator] = React.useState<Integrator>("leapfrog")
  const [resetNonce, setResetNonce] = React.useState(0)
  const [backend, setBackend] = React.useState<Backend | null>(null)
  const [readout, setReadout] = React.useState({ t: 0, steps: 0, drift: 0 })
  const [wasmState, setWasmState] = React.useState<WasmState>({ status: "loading" })
  const reducedMotion = usePrefersReducedMotion()

  const palette = useLabPalette(wrapperRef)

  // Mutable mirrors of render-affecting state/refs the rAF loop reads, so
  // the loop effect below can have an empty dependency array (created once,
  // never torn down and recreated) instead of resubscribing every render.
  const runningRef = React.useRef(running)
  const dtRef = React.useRef(dt)
  const trailsRef = React.useRef(trails)
  const paletteRef = React.useRef(palette)
  const simRef = React.useRef<SimAdapter | null>(null)
  const sizeRef = React.useRef({ width: 1, height: 1 })
  const stepsRef = React.useRef(0)
  const lastReadoutRef = React.useRef(0)

  React.useEffect(() => {
    runningRef.current = running
  }, [running])
  React.useEffect(() => {
    dtRef.current = dt
  }, [dt])
  React.useEffect(() => {
    trailsRef.current = trails
  }, [trails])
  React.useEffect(() => {
    paletteRef.current = palette
  }, [palette])

  // Start running on mount unless the visitor asked for reduced motion —
  // never autoplay motion at someone who explicitly opted out of it.
  React.useEffect(() => {
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!reduced) setRunning(true)
  }, [])

  // Load the WASM backend once. lib/wasm's module scope is inert (no
  // fetch/WebAssembly/window at import time), so this dynamic import is
  // purely for code-splitting — it lands /lab's WASM binding code in its
  // own chunk instead of the initial bundle.
  React.useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const wasm = await import("@/lib/wasm")
        await wasm.loadNumerics()
        if (alive) setWasmState({ status: "ready", createSim: wasm.createNBodySimulation })
      } catch (err) {
        if (alive) setWasmState({ status: "unavailable", reason: err instanceof Error ? err.message : String(err) })
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const { width, height } = sizeRef.current
    const paper = paletteRef.current?.["--lab-paper"] ?? "#ffffff"

    ctx.fillStyle = trailsRef.current ? hexToRgba(paper, 0.14) : paper
    ctx.fillRect(0, 0, width, height)

    const sim = simRef.current
    if (!sim) return

    const scale = (Math.min(width, height) / 2 / REACH) * 0.95
    const cx = width / 2
    const cy = height / 2
    const pos = sim.positions()

    for (let i = 0; i < INITIAL_BODIES.length; i += 1) {
      const x = cx + pos[i * 3 + 0] * scale
      const y = cy - pos[i * 3 + 1] * scale
      ctx.beginPath()
      ctx.fillStyle = INITIAL_BODIES[i].color
      ctx.arc(x, y, INITIAL_BODIES[i].radiusPx, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [])

  const handleResize = React.useCallback(
    (width: number, height: number) => {
      sizeRef.current = { width, height }
      draw()
    },
    [draw],
  )
  useHiDpiCanvas(canvasRef, wrapperRef, handleResize)

  // (Re)build the simulation whenever the WASM load settles, the integrator
  // selection changes, or Reset is pressed. Euler is JS-only by design —
  // it exists purely as a "watch this NOT be conserved" comparison, so
  // there's no reason to spend a WASM export on it.
  React.useEffect(() => {
    if (wasmState.status === "loading") return
    let alive = true
    ;(async () => {
      const positions = new Float64Array(INITIAL_BODIES.flatMap((b) => b.position))
      const velocities = new Float64Array(INITIAL_BODIES.flatMap((b) => b.velocity))
      const masses = new Float64Array(INITIAL_BODIES.map((b) => b.mass))
      const bodyCount = INITIAL_BODIES.length

      let adapter: SimAdapter | null = null
      let usedBackend: Backend = "js"

      if (integrator === "leapfrog" && wasmState.status === "ready") {
        try {
          const sim = await wasmState.createSim({
            positions,
            velocities,
            masses,
            bodyCount,
            gravitationalConstant: G,
            softening: SOFTENING,
          })
          adapter = wrapWasmSim(sim)
          usedBackend = "wasm"
        } catch {
          adapter = null
        }
      }

      if (adapter === null) {
        const state = createNBodyStateJs({
          positions,
          velocities,
          masses,
          bodyCount,
          gravitationalConstant: G,
          softening: SOFTENING,
        })
        const stepFn = integrator === "euler" ? stepEulerJs : stepLeapfrogJs
        adapter = wrapJsSim(state, stepFn)
        usedBackend = "js"
      }

      if (!alive) return
      simRef.current = adapter
      stepsRef.current = 0
      setBackend(usedBackend)
      setReadout({ t: 0, steps: 0, drift: 0 })
      draw()
    })()
    return () => {
      alive = false
    }
  }, [wasmState, integrator, resetNonce, draw])

  // Created once — see the module-level note on why this has an empty
  // dependency array and reads everything through refs.
  React.useEffect(() => {
    let raf = 0
    let cancelled = false
    let last = performance.now()

    const frame = (now: number) => {
      if (cancelled) return
      const elapsed = now - last
      last = now

      const sim = simRef.current
      if (sim && runningRef.current) {
        const steps = Math.min(8, Math.max(1, Math.round(elapsed / 16.667)))
        for (let i = 0; i < steps; i += 1) {
          sim.step(dtRef.current)
          stepsRef.current += 1
        }
      }

      draw()

      if (now - lastReadoutRef.current > 250) {
        lastReadoutRef.current = now
        if (sim) setReadout({ t: sim.t(), steps: stepsRef.current, drift: sim.energyDrift() })
      }

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [draw])

  const handleStep = () => {
    const sim = simRef.current
    if (!sim) return
    sim.step(dtRef.current)
    stepsRef.current += 1
    draw()
    setReadout({ t: sim.t(), steps: stepsRef.current, drift: sim.energyDrift() })
  }

  const meta = backend ? <span>{backend === "wasm" ? "c++ / wasm" : "js"}</span> : null

  return (
    <LabPanel
      title="N-body integrator"
      meta={meta}
      footer={
        <>
          Softened gravity, {INITIAL_BODIES.length} mutually-interacting bodies. Leapfrog (kick-drift-kick) is
          symplectic and time-reversible, which is why its energy error stays bounded and oscillatory instead of
          drifting away — switch to explicit Euler to see the difference.
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mb-4 text-xs">
        <Button
          size="sm"
          variant="outline"
          className="border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black bg-transparent"
          onClick={() => setRunning((r) => !r)}
        >
          {running ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          {running ? "Pause" : "Play"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black bg-transparent"
          onClick={handleStep}
          disabled={running}
        >
          <SkipForward className="size-3.5" />
          Step
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black bg-transparent"
          onClick={() => setResetNonce((n) => n + 1)}
        >
          <RotateCcw className="size-3.5" />
          Reset
        </Button>

        <label className="flex items-center gap-2">
          dt
          <input
            type="range"
            min={0.005}
            max={0.2}
            step={0.005}
            value={dt}
            onChange={(e) => setDt(Number(e.target.value))}
            className="w-24 accent-black dark:accent-white"
          />
          <span className="tabular-nums w-10">{dt.toFixed(3)}</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={trails}
            onChange={(e) => setTrails(e.target.checked)}
            className="size-3.5 accent-black dark:accent-white"
          />
          trails
        </label>

        <label className="flex items-center gap-2">
          integrator
          <select
            value={integrator}
            onChange={(e) => setIntegrator(e.target.value as Integrator)}
            className="border border-gray-400 dark:border-gray-600 bg-transparent px-1 py-0.5 text-xs"
          >
            <option value="leapfrog">leapfrog (symplectic)</option>
            <option value="euler">explicit euler</option>
          </select>
        </label>
      </div>

      {reducedMotion ? (
        <p className="text-xs text-gray-500 mb-2">paused: reduced-motion preference detected. Use Step or Play to run it anyway.</p>
      ) : null}
      {wasmState.status === "unavailable" && integrator === "leapfrog" ? (
        <p className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-500 mb-2">
          <TriangleAlert className="size-3.5" /> wasm unavailable — running the js reference implementation instead.
        </p>
      ) : null}

      <div ref={wrapperRef} className="w-full h-[320px] sm:h-[420px] border border-gray-300 dark:border-gray-700">
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>

      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1">
        <Readout label="t" value={readout.t.toFixed(2)} />
        <Readout label="steps" value={readout.steps.toLocaleString()} />
        <Readout label="ΔE / E₀" value={readout.drift.toExponential(2)} />
        <Readout label="integrator" value={integrator} />
      </div>
    </LabPanel>
  )
}
