#!/usr/bin/env bash
# Compiles cpp/src/*.cpp into public/wasm/numerics.wasm: a standalone
# WebAssembly module with no Emscripten JS glue, no libc, and no imports at
# all. The artifact is committed to git, so `npm run build` (what Vercel
# runs) never needs emcc — only a contributor changing cpp/ does.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/public/wasm/numerics.wasm"

if ! command -v emcc >/dev/null 2>&1; then
  cat >&2 <<'MSG'
emcc not found.

  macOS:  brew install emscripten
  any:    git clone https://github.com/emscripten-core/emsdk ~/emsdk
          ~/emsdk/emsdk install latest && ~/emsdk/emsdk activate latest
          source ~/emsdk/emsdk_env.sh

You do NOT need emcc to run `npm run dev` or `npm run build` — the compiled
artifact is committed at public/wasm/numerics.wasm. You only need emcc to
change anything under cpp/.
MSG
  exit 1
fi

mkdir -p "$(dirname "$OUT")"

echo "running native checks first (cpp/tests, via clang++)..."
"$ROOT/scripts/test-cpp.sh"

echo "compiling $OUT ..."
emcc \
  "$ROOT"/cpp/src/*.cpp \
  -I"$ROOT/cpp/include" \
  -o "$OUT" \
  -std=c++20 \
  -O3 -flto -DNDEBUG -g0 \
  -fno-exceptions -fno-rtti \
  --no-entry \
  -sSTANDALONE_WASM=1 \
  -sALLOW_MEMORY_GROWTH=0 \
  -sINITIAL_MEMORY=2097152 \
  -sSTACK_SIZE=262144 \
  -sFILESYSTEM=0 \
  -sASSERTIONS=0 \
  -sERROR_ON_UNDEFINED_SYMBOLS=1 \
  -sEXPORTED_FUNCTIONS=_wasm_abi_version,_buf_cov,_buf_mu,_buf_frontier_sigma,_buf_frontier_mu,_buf_frontier_lambda,_buf_frontier_w,_frontier_solve,_buf_body_pos,_buf_body_vel,_buf_body_mass,_nbody_init,_nbody_step,_nbody_energy,_nbody_energy_drift

echo "verifying the module is import-free (standalone reactor, no libc leaked in)..."
node "$ROOT/scripts/check-wasm-imports.mjs" "$OUT"

node "$ROOT/scripts/wasm-manifest.mjs" write
echo "built $(wc -c < "$OUT" | tr -d ' ') bytes -> $OUT"
