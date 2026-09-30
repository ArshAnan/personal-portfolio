// Hard gate run by build-wasm.sh: a standalone module (-sSTANDALONE_WASM,
// no exceptions/rtti/filesystem) should import nothing at all. If anything
// shows up here — printf, abort, a math function that didn't lower to a
// bare instruction, an exception-handling helper — it means libc leaked
// back in, and the "no toolchain needed on Vercel" guarantee is broken
// silently until someone's browser throws a LinkError.
//
// Uses Node's own WebAssembly API instead of depending on wabt/wasm-objdump
// being installed — nothing extra to install beyond emcc itself.
import { readFile } from "node:fs/promises"

const path = process.argv[2]
if (!path) {
  console.error("usage: node check-wasm-imports.mjs <path-to-wasm>")
  process.exit(1)
}

const bytes = await readFile(path)
const mod = await WebAssembly.compile(bytes)
const imports = WebAssembly.Module.imports(mod)

if (imports.length > 0) {
  console.error(`ERROR: ${path} has ${imports.length} import(s) — expected a standalone module with none:`)
  for (const imp of imports) {
    console.error(`  ${imp.module}.${imp.name} (${imp.kind})`)
  }
  console.error("\nThis usually means something pulled in libc (printf/assert/abort), exceptions, or RTTI.")
  process.exit(1)
}

const exportsList = WebAssembly.Module.exports(mod)
console.log(`ok: 0 imports, ${exportsList.length} exports`)
