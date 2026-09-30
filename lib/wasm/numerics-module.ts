// Loads public/wasm/numerics.wasm: a standalone WebAssembly module (no
// Emscripten JS glue, no imports, no malloc). Static arenas inside the C++
// mean the module's memory never grows, so Float64Array views into it never
// detach — this file still refreshes its view after every call as cheap,
// correct-by-construction insurance, not a workaround for a live bug.
//
// Module-scope here does nothing browser-specific (no fetch, no window) —
// that only happens inside loadNumerics() — because this file can be
// evaluated during a Next.js server prerender of a client component.
import manifest from "@/lib/wasm/wasm-manifest.json"

const ABI_VERSION = 1

export type NumericsExports = {
  memory: WebAssembly.Memory
  _initialize?: () => void
  wasm_abi_version: () => number

  buf_cov: () => number
  buf_mu: () => number
  buf_frontier_sigma: () => number
  buf_frontier_mu: () => number
  buf_frontier_lambda: () => number
  buf_frontier_w: () => number
  frontier_solve: (
    n: number,
    points: number,
    lambdaMin: number,
    lambdaMax: number,
    longOnly: number,
    ridge: number,
  ) => number

  buf_body_pos: () => number
  buf_body_vel: () => number
  buf_body_mass: () => number
  nbody_init: (n: number, g: number, softening: number) => number
  nbody_step: (dt: number, substeps: number) => void
  nbody_energy: () => number
  nbody_energy_drift: () => number
}

// Byte offsets of the static arenas inside WASM linear memory. These are
// link-time constants (nothing here ever moves or reallocates), so they're
// read once at load time and reused for the life of the page.
export type Offsets = {
  cov: number
  mu: number
  frontierSigma: number
  frontierMu: number
  frontierLambda: number
  frontierW: number
  bodyPos: number
  bodyVel: number
  bodyMass: number
}

export type Numerics = {
  exports: NumericsExports
  offsets: Offsets
  /** Float64 view over the whole linear memory. Always call this fresh —
   *  never hold the returned array across a WASM call. */
  f64: () => Float64Array<ArrayBuffer>
  buildInfo: typeof manifest
}

let loadPromise: Promise<Numerics> | null = null

export function loadNumerics(): Promise<Numerics> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("loadNumerics() is browser-only"))
  }
  if (loadPromise === null) {
    loadPromise = instantiate().catch((err: unknown) => {
      // Allow a retry on the next call rather than poisoning the singleton
      // for the rest of the page's life over a transient network failure.
      loadPromise = null
      throw err
    })
  }
  return loadPromise
}

// These stubs exist purely so an accidental libc pull-in (abort/assert/
// printf slipping back into a future build) fails with a legible error
// instead of an opaque LinkError with no context. A real standalone build
// should never actually call any of these.
const wasmImports: WebAssembly.Imports = {
  wasi_snapshot_preview1: {
    proc_exit: (code: number) => {
      throw new Error(`numerics.wasm called proc_exit(${code}) — likely an abort()/assert() in C++`)
    },
    fd_write: () => 0,
    fd_close: () => 0,
    fd_seek: () => 0,
    environ_get: () => 0,
    environ_sizes_get: () => 0,
  },
  env: {
    emscripten_notify_memory_growth: () => {},
  },
}

async function instantiate(): Promise<Numerics> {
  const url = `/wasm/numerics.wasm?v=${manifest.artifactHash.slice(0, 12)}`
  const response = await fetch(url, { cache: "force-cache" })
  if (!response.ok) {
    throw new Error(`failed to fetch ${url}: ${response.status} ${response.statusText}`)
  }

  let instance: WebAssembly.Instance
  try {
    const streamed = await WebAssembly.instantiateStreaming(response.clone(), wasmImports)
    instance = streamed.instance
  } catch {
    // instantiateStreaming rejects if the response's Content-Type isn't
    // exactly application/wasm (e.g. a dev proxy rewriting headers). Fall
    // back to the buffered path rather than failing the whole page.
    const bytes = await response.arrayBuffer()
    const buffered = await WebAssembly.instantiate(bytes, wasmImports)
    instance = buffered.instance
  }

  const exports = instance.exports as unknown as NumericsExports

  // Standalone reactor module: runs C++ static constructors. A no-op today
  // (every arena here is POD/zero-init), but skipping it would silently
  // corrupt results the day a static with a non-trivial initializer is added.
  exports._initialize?.()

  const abi = exports.wasm_abi_version()
  if (abi !== ABI_VERSION) {
    throw new Error(
      `numerics.wasm ABI ${abi} does not match binding layer ABI ${ABI_VERSION}. ` +
        "Run `npm run build:wasm` and commit the artifact, or hard-reload to clear a stale cache.",
    )
  }

  const offsets: Offsets = {
    cov: exports.buf_cov(),
    mu: exports.buf_mu(),
    frontierSigma: exports.buf_frontier_sigma(),
    frontierMu: exports.buf_frontier_mu(),
    frontierLambda: exports.buf_frontier_lambda(),
    frontierW: exports.buf_frontier_w(),
    bodyPos: exports.buf_body_pos(),
    bodyVel: exports.buf_body_vel(),
    bodyMass: exports.buf_body_mass(),
  }

  const memory = exports.memory
  let cachedBuffer: ArrayBufferLike | null = null
  let f64View = new Float64Array(0)

  const f64 = () => {
    if (cachedBuffer !== memory.buffer) {
      cachedBuffer = memory.buffer
      f64View = new Float64Array(memory.buffer)
    }
    return f64View
  }

  return { exports, offsets, f64, buildInfo: manifest }
}
