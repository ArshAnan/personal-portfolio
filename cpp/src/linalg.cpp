#include "linalg.h"

namespace numerics {

bool cholesky_factor(const double* a, double* l_out, int n, double ridge) {
  double mean_diag = 0.0;
  for (int i = 0; i < n; ++i) mean_diag += a[i * n + i];
  mean_diag /= static_cast<double>(n);
  const double loading = ridge * mean_diag;

  for (int i = 0; i < n; ++i) {
    for (int j = 0; j <= i; ++j) {
      double sum = a[i * n + j];
      for (int k = 0; k < j; ++k) sum -= l_out[i * n + k] * l_out[j * n + k];

      if (i == j) {
        const double diag = sum + loading;
        if (diag <= 0.0) return false;
        // __builtin_sqrt lowers directly to the f64.sqrt WASM instruction —
        // no libm import, works identically under emcc and native clang++.
        l_out[i * n + i] = __builtin_sqrt(diag);
      } else {
        l_out[i * n + j] = sum / l_out[j * n + j];
      }
    }
    for (int j = i + 1; j < n; ++j) l_out[i * n + j] = 0.0;
  }
  return true;
}

void cholesky_solve(const double* l, int n, const double* b, double* x) {
  // Forward substitution: L y = b. Result lands in x.
  for (int i = 0; i < n; ++i) {
    double sum = b[i];
    for (int k = 0; k < i; ++k) sum -= l[i * n + k] * x[k];
    x[i] = sum / l[i * n + i];
  }
  // Backward substitution: L^T z = y, y currently held in x. Safe in place:
  // iterating i from n-1 down to 0, every x[k] read (k > i) was already
  // finalized by an earlier iteration of this same loop.
  for (int i = n - 1; i >= 0; --i) {
    double sum = x[i];
    for (int k = i + 1; k < n; ++k) sum -= l[k * n + i] * x[k];
    x[i] = sum / l[i * n + i];
  }
}

void matvec(const double* a, int n, const double* x, double* out) {
  for (int i = 0; i < n; ++i) {
    double sum = 0.0;
    for (int j = 0; j < n; ++j) sum += a[i * n + j] * x[j];
    out[i] = sum;
  }
}

}  // namespace numerics
