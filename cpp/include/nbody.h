#pragma once

#include <cstdint>

namespace numerics {

double* nbody_positions();  // kMaxBodies * 3, xyz-interleaved
double* nbody_velocities(); // kMaxBodies * 3
double* nbody_masses();     // kMaxBodies

// Registers the current contents of the position/velocity/mass buffers as
// the simulation's initial state (positions/velocities/masses must already
// be written before calling) and records the initial total energy used as
// the drift baseline. Returns 0 on success, -1 if n is out of range.
int32_t nbody_init_impl(int32_t n, double g, double softening);

// Advances the simulation by `dt`, split into `substeps` equal leapfrog
// (kick-drift-kick / velocity-Verlet) steps. Symplectic and time-reversible,
// which is why the energy error stays bounded and oscillatory instead of
// drifting away secularly — unlike, say, explicit Euler at the same dt.
void nbody_step_impl(double dt, int32_t substeps);

double nbody_energy_impl();

// (E - E0) / |E0|, or 0 if E0 == 0.
double nbody_energy_drift_impl();

}  // namespace numerics
