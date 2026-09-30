#pragma once

namespace numerics {

// Factors an n x n row-major symmetric matrix `a` into its lower-triangular
// Cholesky factor, written into `l_out` (may NOT alias `a`; `l_out`'s upper
// triangle is zeroed). Before factoring, adds `ridge * mean(diag(a))` to
// every diagonal entry — this keeps a near-singular sample covariance
// matrix (the common case with short return histories) invertible without
// distorting it much. Returns false if the (ridged) matrix is not positive
// definite.
bool cholesky_factor(const double* a, double* l_out, int n, double ridge);

// Solves L L^T x = b for x, given the lower-triangular factor `l` produced
// by cholesky_factor. `x` and `b` may alias; `x` is used as scratch during
// the solve.
void cholesky_solve(const double* l, int n, const double* b, double* x);

// out = a * x, where `a` is n x n row-major. `out` must not alias `x`.
void matvec(const double* a, int n, const double* x, double* out);

}  // namespace numerics
