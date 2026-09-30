#pragma once

namespace numerics {

// Compile-time bounds for every static arena. Keeping these small and fixed
// is what lets the whole module run with ALLOW_MEMORY_GROWTH=0: no malloc,
// no growth, so Float64Array views into the WASM heap never detach.
inline constexpr int kMaxAssets = 32;
inline constexpr int kMaxFrontierPoints = 128;
inline constexpr int kMaxBodies = 64;

}  // namespace numerics
