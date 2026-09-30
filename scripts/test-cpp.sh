#!/usr/bin/env bash
# Native correctness checks for cpp/src, compiled with plain clang++ (no
# Emscripten needed). Run this after any change under cpp/ before rebuilding
# the WASM artifact — it's much faster to debug here than through
# instance.exports in a browser.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BIN="$(mktemp -t numerics-test)"

clang++ -std=c++20 -O2 -fno-exceptions -fno-rtti \
  -I "$ROOT/cpp/include" \
  "$ROOT"/cpp/src/*.cpp \
  "$ROOT/cpp/tests/main.cpp" \
  -o "$BIN"

"$BIN"
