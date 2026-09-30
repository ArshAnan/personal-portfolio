#include "frontier.h"

#include "exports.h"
#include "limits.h"
#include "linalg.h"

namespace numerics {

namespace {

alignas(8) double g_cov[kMaxAssets * kMaxAssets];
alignas(8) double g_mu[kMaxAssets];

alignas(8) double g_out_sigma[kMaxFrontierPoints];
alignas(8) double g_out_mu[kMaxFrontierPoints];
alignas(8) double g_out_lambda[kMaxFrontierPoints];
alignas(8) double g_out_weights[kMaxFrontierPoints * kMaxAssets];

// Scratch. None of this is exposed to JS.
alignas(8) double g_chol[kMaxAssets * kMaxAssets];
alignas(8) double g_u[kMaxAssets];     // Sigma^-1 mu
alignas(8) double g_v[kMaxAssets];     // Sigma^-1 1
alignas(8) double g_ones[kMaxAssets];
alignas(8) double g_w[kMaxAssets];      // long-only: current iterate (also warm start)
alignas(8) double g_y[kMaxAssets];      // long-only: FISTA momentum point
alignas(8) double g_w_prev[kMaxAssets];
alignas(8) double g_grad[kMaxAssets];
alignas(8) double g_step_point[kMaxAssets];
alignas(8) double g_sort_scratch[kMaxAssets];

void insertion_sort_descending(double* a, int n) {
  for (int i = 1; i < n; ++i) {
    const double key = a[i];
    int j = i - 1;
    while (j >= 0 && a[j] < key) {
      a[j + 1] = a[j];
      --j;
    }
    a[j + 1] = key;
  }
}

// Euclidean projection of `w` (length n) onto the probability simplex
// {x : sum(x) = 1, x >= 0}. Writes into `out` (may alias `w`). Uses
// g_sort_scratch internally (n <= kMaxAssets doubles).
void project_simplex(const double* w, int n, double* out) {
  for (int i = 0; i < n; ++i) g_sort_scratch[i] = w[i];
  insertion_sort_descending(g_sort_scratch, n);

  double cumsum = 0.0;
  double theta = 0.0;
  for (int j = 0; j < n; ++j) {
    cumsum += g_sort_scratch[j];
    const double candidate = (cumsum - 1.0) / static_cast<double>(j + 1);
    if (g_sort_scratch[j] - candidate > 0.0) theta = candidate;
  }

  for (int i = 0; i < n; ++i) {
    const double v = w[i] - theta;
    out[i] = v > 0.0 ? v : 0.0;
  }
}

// Solves the long-only QP at a single lambda via FISTA, warm-started from
// (and overwriting) `w`. `l_bound` is a Gershgorin upper bound on Sigma's
// operator norm, used to pick a safe step size.
void solve_long_only(double lambda, int n, double l_bound, double* w) {
  const double step = 1.0 / (lambda * l_bound);
  constexpr int kMaxIters = 300;
  constexpr double kTol = 1e-10;

  for (int i = 0; i < n; ++i) {
    g_y[i] = w[i];
    g_w_prev[i] = w[i];
  }
  double t = 1.0;

  for (int iter = 0; iter < kMaxIters; ++iter) {
    matvec(g_cov, n, g_y, g_grad);
    for (int i = 0; i < n; ++i) g_grad[i] = lambda * g_grad[i] - g_mu[i];
    for (int i = 0; i < n; ++i) g_step_point[i] = g_y[i] - step * g_grad[i];

    project_simplex(g_step_point, n, w);

    const double t_next = (1.0 + __builtin_sqrt(1.0 + 4.0 * t * t)) / 2.0;
    const double momentum = (t - 1.0) / t_next;

    double diff2 = 0.0;
    for (int i = 0; i < n; ++i) {
      const double d = w[i] - g_w_prev[i];
      diff2 += d * d;
      g_y[i] = w[i] + momentum * d;
      g_w_prev[i] = w[i];
    }

    t = t_next;
    if (diff2 < kTol * kTol) break;
  }
}

}  // namespace

double* frontier_cov() { return g_cov; }
double* frontier_expected_returns() { return g_mu; }
double* frontier_out_sigma() { return g_out_sigma; }
double* frontier_out_mu() { return g_out_mu; }
double* frontier_out_lambda() { return g_out_lambda; }
double* frontier_out_weights() { return g_out_weights; }

int32_t frontier_solve_impl(int32_t n, int32_t points, double lambda_min,
                             double lambda_max, int32_t long_only, double ridge) {
  if (n < 2 || n > kMaxAssets) return -1;
  if (points < 2 || points > kMaxFrontierPoints) return -2;
  if (lambda_min <= 0.0 || lambda_max <= lambda_min) return -2;

  if (!cholesky_factor(g_cov, g_chol, n, ridge)) return -3;

  cholesky_solve(g_chol, n, g_mu, g_u);
  for (int i = 0; i < n; ++i) g_ones[i] = 1.0;
  cholesky_solve(g_chol, n, g_ones, g_v);

  double sum_u = 0.0;
  double sum_v = 0.0;
  for (int i = 0; i < n; ++i) {
    sum_u += g_u[i];
    sum_v += g_v[i];
  }

  double gershgorin = 0.0;
  if (long_only != 0) {
    for (int i = 0; i < n; ++i) {
      double row_sum = 0.0;
      for (int j = 0; j < n; ++j) {
        const double a = g_cov[i * n + j];
        row_sum += a >= 0.0 ? a : -a;
      }
      if (row_sum > gershgorin) gershgorin = row_sum;
    }
    if (gershgorin <= 0.0) gershgorin = 1.0;
    for (int i = 0; i < n; ++i) g_w[i] = 1.0 / static_cast<double>(n);
  }

  const double log_min = __builtin_log(lambda_min);
  const double log_max = __builtin_log(lambda_max);

  for (int k = 0; k < points; ++k) {
    const double frac = points == 1 ? 0.0 : static_cast<double>(k) / static_cast<double>(points - 1);
    const double lambda = __builtin_exp(log_min + frac * (log_max - log_min));

    double* w_out = &g_out_weights[k * n];

    if (long_only == 0) {
      const double nu = (lambda - sum_u) / sum_v;
      for (int i = 0; i < n; ++i) w_out[i] = (g_u[i] + nu * g_v[i]) / lambda;
    } else {
      solve_long_only(lambda, n, gershgorin, g_w);
      for (int i = 0; i < n; ++i) w_out[i] = g_w[i];
    }

    // Realized risk/return use the ORIGINAL covariance, not the ridged
    // Cholesky factor — the ridge is a numerical aid, not part of the model.
    double sigma2 = 0.0;
    double mu_p = 0.0;
    for (int i = 0; i < n; ++i) {
      mu_p += w_out[i] * g_mu[i];
      double row = 0.0;
      for (int j = 0; j < n; ++j) row += g_cov[i * n + j] * w_out[j];
      sigma2 += w_out[i] * row;
    }

    g_out_sigma[k] = sigma2 > 0.0 ? __builtin_sqrt(sigma2) : 0.0;
    g_out_mu[k] = mu_p;
    g_out_lambda[k] = lambda;
  }

  return points;
}

extern "C" {

WASM_EXPORT double* buf_cov() { return frontier_cov(); }
WASM_EXPORT double* buf_mu() { return frontier_expected_returns(); }
WASM_EXPORT double* buf_frontier_sigma() { return frontier_out_sigma(); }
WASM_EXPORT double* buf_frontier_mu() { return frontier_out_mu(); }
WASM_EXPORT double* buf_frontier_lambda() { return frontier_out_lambda(); }
WASM_EXPORT double* buf_frontier_w() { return frontier_out_weights(); }

WASM_EXPORT int32_t frontier_solve(int32_t n, int32_t points, double lambda_min,
                                    double lambda_max, int32_t long_only, double ridge) {
  return frontier_solve_impl(n, points, lambda_min, lambda_max, long_only, ridge);
}

}  // extern "C"

}  // namespace numerics
