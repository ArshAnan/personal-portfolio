#include "nbody.h"

#include "exports.h"
#include "limits.h"

namespace numerics {

namespace {

alignas(8) double g_pos[kMaxBodies * 3];
alignas(8) double g_vel[kMaxBodies * 3];
alignas(8) double g_mass[kMaxBodies];
alignas(8) double g_acc[kMaxBodies * 3];  // scratch, not exposed

int g_count = 0;
double g_g = 1.0;
double g_softening2 = 0.0025;
double g_energy0 = 0.0;

// Softened gravity: a_i = G * sum_{j != i} m_j * (x_j - x_i) / (|x_ij|^2 + eps^2)^1.5
// The matching potential below uses the SAME softening, so the reported
// energy is consistent with the forces actually integrated — using the
// unsoftened 1/r potential here would fabricate a fake drift signal.
void compute_accelerations() {
  const int n = g_count;
  for (int i = 0; i < n * 3; ++i) g_acc[i] = 0.0;

  for (int i = 0; i < n; ++i) {
    for (int j = i + 1; j < n; ++j) {
      const double dx = g_pos[j * 3 + 0] - g_pos[i * 3 + 0];
      const double dy = g_pos[j * 3 + 1] - g_pos[i * 3 + 1];
      const double dz = g_pos[j * 3 + 2] - g_pos[i * 3 + 2];
      const double dist2 = dx * dx + dy * dy + dz * dz + g_softening2;
      const double inv_dist = 1.0 / __builtin_sqrt(dist2);
      const double inv_dist3 = inv_dist * inv_dist * inv_dist;
      const double f = g_g * inv_dist3;

      const double ai = f * g_mass[j];
      const double aj = f * g_mass[i];
      g_acc[i * 3 + 0] += ai * dx;
      g_acc[i * 3 + 1] += ai * dy;
      g_acc[i * 3 + 2] += ai * dz;
      g_acc[j * 3 + 0] -= aj * dx;
      g_acc[j * 3 + 1] -= aj * dy;
      g_acc[j * 3 + 2] -= aj * dz;
    }
  }
}

double compute_energy() {
  const int n = g_count;
  double kinetic = 0.0;
  for (int i = 0; i < n; ++i) {
    const double vx = g_vel[i * 3 + 0];
    const double vy = g_vel[i * 3 + 1];
    const double vz = g_vel[i * 3 + 2];
    kinetic += 0.5 * g_mass[i] * (vx * vx + vy * vy + vz * vz);
  }

  double potential = 0.0;
  for (int i = 0; i < n; ++i) {
    for (int j = i + 1; j < n; ++j) {
      const double dx = g_pos[j * 3 + 0] - g_pos[i * 3 + 0];
      const double dy = g_pos[j * 3 + 1] - g_pos[i * 3 + 1];
      const double dz = g_pos[j * 3 + 2] - g_pos[i * 3 + 2];
      const double dist2 = dx * dx + dy * dy + dz * dz + g_softening2;
      potential -= g_g * g_mass[i] * g_mass[j] / __builtin_sqrt(dist2);
    }
  }
  return kinetic + potential;
}

void step_once(double dt) {
  const int n = g_count;
  compute_accelerations();  // a(x_t)
  for (int i = 0; i < n * 3; ++i) g_vel[i] += 0.5 * dt * g_acc[i];
  for (int i = 0; i < n * 3; ++i) g_pos[i] += dt * g_vel[i];
  compute_accelerations();  // a(x_{t+dt})
  for (int i = 0; i < n * 3; ++i) g_vel[i] += 0.5 * dt * g_acc[i];
}

}  // namespace

double* nbody_positions() { return g_pos; }
double* nbody_velocities() { return g_vel; }
double* nbody_masses() { return g_mass; }

int32_t nbody_init_impl(int32_t n, double g, double softening) {
  if (n < 2 || n > kMaxBodies) return -1;
  g_count = n;
  g_g = g;
  g_softening2 = softening * softening;
  g_energy0 = compute_energy();
  return 0;
}

void nbody_step_impl(double dt, int32_t substeps) {
  const int reps = substeps > 0 ? substeps : 1;
  const double sub_dt = dt / static_cast<double>(reps);
  for (int s = 0; s < reps; ++s) step_once(sub_dt);
}

double nbody_energy_impl() { return compute_energy(); }

double nbody_energy_drift_impl() {
  if (g_energy0 == 0.0) return 0.0;
  const double e = compute_energy();
  const double diff = e - g_energy0;
  const double abs_e0 = g_energy0 > 0.0 ? g_energy0 : -g_energy0;
  return diff / abs_e0;
}

extern "C" {

WASM_EXPORT double* buf_body_pos() { return nbody_positions(); }
WASM_EXPORT double* buf_body_vel() { return nbody_velocities(); }
WASM_EXPORT double* buf_body_mass() { return nbody_masses(); }

WASM_EXPORT int32_t nbody_init(int32_t n, double g, double softening) {
  return nbody_init_impl(n, g, softening);
}

WASM_EXPORT void nbody_step(double dt, int32_t substeps) {
  nbody_step_impl(dt, substeps);
}

WASM_EXPORT double nbody_energy() { return nbody_energy_impl(); }
WASM_EXPORT double nbody_energy_drift() { return nbody_energy_drift_impl(); }

}  // extern "C"

}  // namespace numerics
