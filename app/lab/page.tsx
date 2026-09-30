import type { Metadata } from "next"
import { Navigation, StatusBar } from "@/components/navigation"
import { EfficientFrontier } from "@/components/lab/efficient-frontier"
import { NBody } from "@/components/lab/nbody"
import { WasmBench } from "@/components/lab/wasm-bench"

export const metadata: Metadata = {
  title: "Lab — Arsh's Internet Corner",
  description: "Interactive numerics compiled from C++ to WebAssembly: an efficient-frontier solver, an n-body integrator, and a WASM vs JS benchmark.",
}

export default function LabPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-mono">
      <Navigation />

      <div className="p-8 max-w-4xl mx-auto pb-24">
        <header className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Lab</h1>
          <div className="w-16 h-0.5 bg-black dark:bg-white mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
            Numerics written in C++ and compiled to WebAssembly. Everything below runs in your browser — the
            covariance solve, the orbit integration, the benchmark — nothing is precomputed or server-rendered.
          </p>
        </header>

        <div className="space-y-10">
          <EfficientFrontier />
          <NBody />
          <WasmBench />
        </div>
      </div>

      <StatusBar leftText="Lab" rightText="wasm · 3 demos" />
    </div>
  )
}
