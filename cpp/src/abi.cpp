#include "exports.h"

// Bumped whenever the export surface, buffer layout, or numerical
// contract of numerics.wasm changes. The TS loader checks this against
// its own expected version at instantiation time, so a stale cached
// artifact fails loudly instead of silently returning wrong numbers.
extern "C" {

WASM_EXPORT int wasm_abi_version() { return 1; }

}  // extern "C"
