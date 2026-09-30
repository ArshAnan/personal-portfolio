#pragma once

// WASM_EXPORT marks a function as part of the WebAssembly export surface.
//
// Under emcc it also keeps the symbol alive through LTO / --gc-sections.
// Without emcc (the native build used by cpp/tests) it just gives the
// symbol C linkage and default visibility, so the exact same source
// compiles and links as a native test binary with clang++.
#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#define WASM_EXPORT extern "C" EMSCRIPTEN_KEEPALIVE
#else
#define WASM_EXPORT extern "C" __attribute__((visibility("default")))
#endif
