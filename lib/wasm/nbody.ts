// Marshalling layer for the n-body integrator. Mirrors
// cpp/include/limits.h's kMaxBodies. Simulation state lives entirely in
// WASM memory — JS never re-uploads bodies per frame, only reads the
// updated positions back out.
import { loadNumerics } from "@/lib/wasm/numerics-module"

export const MAX_BODIES = 64

export type NBodySimulation = {
  bodyCount: number
  /** Reused scratch, length 3n, xyz-interleaved. Valid until the next step(). */
  readonly positions: Float64Array<ArrayBuffer>
  step: (dt: number, substeps?: number) => void
  energy: () => number
  /** (E - E0) / |E0| */
  energyDrift: () => number
}

export async function createNBodySimulation(init: {
  positions: Float64Array<ArrayBuffer>
  velocities: Float64Array<ArrayBuffer>
  masses: Float64Array<ArrayBuffer>
  bodyCount: number
  gravitationalConstant?: number
  softening?: number
}): Promise<NBodySimulation> {
  const n = init.bodyCount
  if (n < 2 || n > MAX_BODIES) throw new RangeError(`bodyCount must be in [2, ${MAX_BODIES}]`)

  const { exports, offsets, f64 } = await loadNumerics()
  {
    const heap = f64()
    heap.set(init.positions.subarray(0, n * 3), offsets.bodyPos >>> 3)
    heap.set(init.velocities.subarray(0, n * 3), offsets.bodyVel >>> 3)
    heap.set(init.masses.subarray(0, n), offsets.bodyMass >>> 3)
  }

  const status = exports.nbody_init(n, init.gravitationalConstant ?? 1, init.softening ?? 0.05)
  if (status !== 0) throw new Error(`nbody_init failed (code ${status})`)

  // Allocated once. The render loop never allocates.
  const positions = new Float64Array(n * 3)
  const posBase = offsets.bodyPos >>> 3

  return {
    bodyCount: n,
    positions,
    step(dt, substeps = 1) {
      exports.nbody_step(dt, substeps)
      const heap = f64()
      positions.set(heap.subarray(posBase, posBase + n * 3))
    },
    energy: () => exports.nbody_energy(),
    energyDrift: () => exports.nbody_energy_drift(),
  }
}
