// Native sanity checks for the numerics module. Compiled with plain
// clang++ (see scripts/test-cpp.sh) against the exact same cpp/src/*.cpp
// used for the WASM build — debugging a failing Cholesky factorization
// with a debugger and printf here is far easier than doing it through
// instance.exports in devtools.
#include <cstdio>
#include <cstdlib>

#include "exports.h"
#include "frontier.h"
#include "nbody.h"

namespace {

int g_failures = 0;

void check(bool cond, const char* what) {
  if (!cond) {
    std::printf("FAIL: %s\n", what);
    ++g_failures;
  } else {
    std::printf("ok:   %s\n", what);
  }
}

double fabs_(double x) { return x < 0.0 ? -x : x; }

void test_two_asset_frontier() {
  using namespace numerics;
  const int n = 2;
  double* cov = frontier_cov();
  double* mu = frontier_expected_returns();

  // Two uncorrelated assets: var 0.04 and 0.09, returns 0.08 and 0.12.
  cov[0 * n + 0] = 0.04;
  cov[0 * n + 1] = 0.0;
  cov[1 * n + 0] = 0.0;
  cov[1 * n + 1] = 0.09;
  mu[0] = 0.08;
  mu[1] = 0.12;

  const int points = 50;
  const int written = frontier_solve_impl(n, points, 0.5, 200.0, /*long_only=*/0, 1e-10);
  check(written == points, "unconstrained frontier returns requested point count");

  double* w = frontier_out_weights();
  bool weights_sum_to_one = true;
  for (int k = 0; k < written; ++k) {
    const double sum = w[k * n + 0] + w[k * n + 1];
    if (fabs_(sum - 1.0) > 1e-6) weights_sum_to_one = false;
  }
  check(weights_sum_to_one, "unconstrained frontier weights sum to 1 at every point");

  double* sigma = frontier_out_sigma();
  bool sigma_nondecreasing_in_lambda = true;  // higher risk-aversion -> safer portfolio
  for (int k = 1; k < written; ++k) {
    if (sigma[k] > sigma[k - 1] + 1e-9) sigma_nondecreasing_in_lambda = false;
  }
  check(sigma_nondecreasing_in_lambda, "risk decreases as risk-aversion increases");
}

void test_long_only_matches_unconstrained_when_already_nonnegative() {
  using namespace numerics;
  const int n = 3;
  double* cov = frontier_cov();
  double* mu = frontier_expected_returns();

  for (int i = 0; i < n; ++i)
    for (int j = 0; j < n; ++j) cov[i * n + j] = (i == j) ? 0.05 : 0.01;
  mu[0] = 0.06;
  mu[1] = 0.06;
  mu[2] = 0.06;  // symmetric problem -> unconstrained optimum is already w = [1/3, 1/3, 1/3]

  const int points = 10;
  frontier_solve_impl(n, points, 50.0, 200.0, /*long_only=*/0, 1e-10);
  double* w_unc = frontier_out_weights();
  double unc_last[3] = {w_unc[(points - 1) * n + 0], w_unc[(points - 1) * n + 1], w_unc[(points - 1) * n + 2]};

  frontier_solve_impl(n, points, 50.0, 200.0, /*long_only=*/1, 1e-10);
  double* w_lo = frontier_out_weights();

  bool matches = true;
  for (int i = 0; i < n; ++i) {
    if (fabs_(w_lo[(points - 1) * n + i] - unc_last[i]) > 1e-4) matches = false;
  }
  check(matches, "long-only matches unconstrained when the unconstrained optimum is already >= 0");
}

void test_long_only_nonnegative_and_feasible() {
  using namespace numerics;
  const int n = 4;
  double* cov = frontier_cov();
  double* mu = frontier_expected_returns();

  // A strong negative correlation pushes the unconstrained optimum negative
  // on one asset; long-only must clip it to exactly 0, not a small negative.
  for (int i = 0; i < n; ++i)
    for (int j = 0; j < n; ++j) cov[i * n + j] = (i == j) ? 0.06 : (((i + j) % 2 == 0) ? 0.03 : -0.03);
  mu[0] = 0.03;
  mu[1] = 0.20;
  mu[2] = 0.05;
  mu[3] = 0.04;

  const int points = 30;
  const int written = frontier_solve_impl(n, points, 1.0, 300.0, /*long_only=*/1, 1e-8);
  check(written == points, "long-only frontier returns requested point count");

  double* w = frontier_out_weights();
  bool all_nonneg = true;
  bool all_feasible = true;
  for (int k = 0; k < written; ++k) {
    double sum = 0.0;
    for (int i = 0; i < n; ++i) {
      const double wi = w[k * n + i];
      if (wi < -1e-9) all_nonneg = false;
      sum += wi;
    }
    if (fabs_(sum - 1.0) > 1e-6) all_feasible = false;
  }
  check(all_nonneg, "long-only weights are all >= 0");
  check(all_feasible, "long-only weights sum to 1 at every point");
}

void test_nbody_energy_drift_is_small() {
  using namespace numerics;
  const int n = 2;
  double* pos = nbody_positions();
  double* vel = nbody_velocities();
  double* mass = nbody_masses();

  // Exact circular two-body orbit about the common center of mass: equal
  // masses m=1, separation r=2, so each body orbits at radius 1 with
  // omega = sqrt(G*(m1+m2)/r^3) = sqrt(2/8) = 0.5, v = omega*r1 = 0.5.
  // No close encounters, so any drift measured here is purely integration
  // error, not a physically-real force spike from softening.
  pos[0] = 1.0;  pos[1] = 0.0; pos[2] = 0.0;
  pos[3] = -1.0; pos[4] = 0.0; pos[5] = 0.0;
  vel[0] = 0.0; vel[1] = 0.5;  vel[2] = 0.0;
  vel[3] = 0.0; vel[4] = -0.5; vel[5] = 0.0;
  mass[0] = 1.0; mass[1] = 1.0;

  const int status = nbody_init_impl(n, /*g=*/1.0, /*softening=*/0.01);
  check(status == 0, "nbody_init accepts a valid body count");

  // Orbital period T = 2*pi/omega = 4*pi =~ 12.566; run ~160 orbits.
  for (int step = 0; step < 200000; ++step) nbody_step_impl(0.01, 1);

  const double drift = nbody_energy_drift_impl();
  std::printf("  (energy drift after 200000 leapfrog steps (~160 orbits): %.3e)\n", drift);
  check(fabs_(drift) < 1e-4, "leapfrog energy drift stays bounded over ~160 orbits");
}

void test_nbody_rejects_invalid_count() {
  using namespace numerics;
  const int status_low = nbody_init_impl(1, 1.0, 0.05);
  const int status_high = nbody_init_impl(9999, 1.0, 0.05);
  check(status_low == -1 && status_high == -1, "nbody_init rejects out-of-range body counts");
}

}  // namespace

int main() {
  test_two_asset_frontier();
  test_long_only_matches_unconstrained_when_already_nonnegative();
  test_long_only_nonnegative_and_feasible();
  test_nbody_energy_drift_is_small();
  test_nbody_rejects_invalid_count();

  std::printf("\n%s\n", g_failures == 0 ? "all checks passed" : "checks failed");
  return g_failures == 0 ? 0 : 1;
}
