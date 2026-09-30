#pragma once

#include <cstdint>

namespace numerics {

// Static arenas for the efficient-frontier solver. All pointers are stable
// for the lifetime of the module (no malloc, no growth), so a JS caller can
// cache the byte offsets once and write/read directly into WASM memory.
double* frontier_cov();              // kMaxAssets * kMaxAssets, row-major
double* frontier_expected_returns();  // kMaxAssets

double* frontier_out_sigma();   // kMaxFrontierPoints
double* frontier_out_mu();      // kMaxFrontierPoints
double* frontier_out_lambda();  // kMaxFrontierPoints
double* frontier_out_weights(); // kMaxFrontierPoints * kMaxAssets

// Sweeps risk aversion lambda log-spaced across [lambda_min, lambda_max]
// and solves, at each point:
//
//   minimize   (lambda/2) w^T Sigma w  -  mu^T w
//   subject to 1^T w = 1,  and (if long_only) w >= 0
//
// Unconstrained: closed-form two-fund separation, one Cholesky factorization
// for the whole sweep. Long-only: projected-gradient (FISTA) onto the
// simplex, warm-started from the previous lambda's solution.
//
// Returns the number of points written (== `points`) on success, or a
// negative error code:
//   -1  n out of [2, kMaxAssets]
//   -2  points out of [2, kMaxFrontierPoints], or invalid lambda range
//   -3  covariance is not positive definite even after ridging
int32_t frontier_solve_impl(int32_t n, int32_t points, double lambda_min,
                             double lambda_max, int32_t long_only, double ridge);

}  // namespace numerics
