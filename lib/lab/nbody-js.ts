// Pure-TypeScript reference implementation of the n-body integrator.
// Mirrors cpp/src/nbody.cpp: same softened-gravity force law, same
// potential (softened to match — an unsoftened potential against softened
// forces would fabricate a fake energy-drift signal), same kick-drift-kick
// leapfrog step. Used as the WASM fallback and as the "explicit Euler"
// comparison toggle in the n-body demo (Euler is intentionally NOT
// symplectic, to show why leapfrog's bounded drift is the interesting part).
export type NBodyStateJs = {
  n: number
  g: number
  softening2: number
  pos: Float64Array<ArrayBuffer> // 3n
  vel: Float64Array<ArrayBuffer> // 3n
  mass: Float64Array<ArrayBuffer> // n
  acc: Float64Array<ArrayBuffer> // 3n scratch
  energy0: number
  t: number
}

export function createNBodyStateJs(init: {
  positions: Float64Array<ArrayBuffer>
  velocities: Float64Array<ArrayBuffer>
  masses: Float64Array<ArrayBuffer>
  bodyCount: number
  gravitationalConstant?: number
  softening?: number
}): NBodyStateJs {
  const n = init.bodyCount
  const softening = init.softening ?? 0.05
  const state: NBodyStateJs = {
    n,
    g: init.gravitationalConstant ?? 1,
    softening2: softening * softening,
    pos: Float64Array.from(init.positions.subarray(0, n * 3)),
    vel: Float64Array.from(init.velocities.subarray(0, n * 3)),
    mass: Float64Array.from(init.masses.subarray(0, n)),
    acc: new Float64Array(n * 3),
    energy0: 0,
    t: 0,
  }
  state.energy0 = computeEnergy(state)
  return state
}

function computeAccelerations(state: NBodyStateJs) {
  const { n, g, softening2, pos, mass, acc } = state
  acc.fill(0)
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const dx = pos[j * 3 + 0] - pos[i * 3 + 0]
      const dy = pos[j * 3 + 1] - pos[i * 3 + 1]
      const dz = pos[j * 3 + 2] - pos[i * 3 + 2]
      const dist2 = dx * dx + dy * dy + dz * dz + softening2
      const invDist = 1 / Math.sqrt(dist2)
      const invDist3 = invDist * invDist * invDist
      const f = g * invDist3

      const ai = f * mass[j]
      const aj = f * mass[i]
      acc[i * 3 + 0] += ai * dx
      acc[i * 3 + 1] += ai * dy
      acc[i * 3 + 2] += ai * dz
      acc[j * 3 + 0] -= aj * dx
      acc[j * 3 + 1] -= aj * dy
      acc[j * 3 + 2] -= aj * dz
    }
  }
}

function computeEnergy(state: NBodyStateJs): number {
  const { n, g, softening2, pos, vel, mass } = state
  let kinetic = 0
  for (let i = 0; i < n; i += 1) {
    const vx = vel[i * 3 + 0]
    const vy = vel[i * 3 + 1]
    const vz = vel[i * 3 + 2]
    kinetic += 0.5 * mass[i] * (vx * vx + vy * vy + vz * vz)
  }
  let potential = 0
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const dx = pos[j * 3 + 0] - pos[i * 3 + 0]
      const dy = pos[j * 3 + 1] - pos[i * 3 + 1]
      const dz = pos[j * 3 + 2] - pos[i * 3 + 2]
      const dist2 = dx * dx + dy * dy + dz * dz + softening2
      potential -= (g * mass[i] * mass[j]) / Math.sqrt(dist2)
    }
  }
  return kinetic + potential
}

/** Symplectic kick-drift-kick (velocity-Verlet) leapfrog step. */
export function stepLeapfrogJs(state: NBodyStateJs, dt: number, substeps = 1) {
  const reps = substeps > 0 ? substeps : 1
  const subDt = dt / reps
  const { n, pos, vel } = state
  for (let s = 0; s < reps; s += 1) {
    computeAccelerations(state)
    for (let i = 0; i < n * 3; i += 1) vel[i] += 0.5 * subDt * state.acc[i]
    for (let i = 0; i < n * 3; i += 1) pos[i] += subDt * vel[i]
    computeAccelerations(state)
    for (let i = 0; i < n * 3; i += 1) vel[i] += 0.5 * subDt * state.acc[i]
    state.t += subDt
  }
}

/** Non-symplectic explicit Euler — intentionally worse, for comparison. */
export function stepEulerJs(state: NBodyStateJs, dt: number, substeps = 1) {
  const reps = substeps > 0 ? substeps : 1
  const subDt = dt / reps
  const { n, pos, vel } = state
  for (let s = 0; s < reps; s += 1) {
    computeAccelerations(state)
    for (let i = 0; i < n * 3; i += 1) pos[i] += subDt * vel[i]
    for (let i = 0; i < n * 3; i += 1) vel[i] += subDt * state.acc[i]
    state.t += subDt
  }
}

export function energyDriftJs(state: NBodyStateJs): number {
  if (state.energy0 === 0) return 0
  return (computeEnergy(state) - state.energy0) / Math.abs(state.energy0)
}

export function energyJs(state: NBodyStateJs): number {
  return computeEnergy(state)
}
