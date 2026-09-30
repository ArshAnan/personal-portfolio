// Single entry point for /lab's dynamic `import("@/lib/wasm")`. Keeping
// this file free of anything but re-exports means the import itself never
// touches WebAssembly/fetch/window at module-evaluation time — that only
// happens once a caller actually invokes loadNumerics() (or solveFrontier /
// createNBodySimulation, which call it internally).
export { loadNumerics } from "@/lib/wasm/numerics-module"
export { solveFrontier, MAX_ASSETS, MAX_FRONTIER_POINTS } from "@/lib/wasm/frontier"
export type { FrontierInput, FrontierPoint } from "@/lib/wasm/frontier"
export { createNBodySimulation, MAX_BODIES } from "@/lib/wasm/nbody"
export type { NBodySimulation } from "@/lib/wasm/nbody"
