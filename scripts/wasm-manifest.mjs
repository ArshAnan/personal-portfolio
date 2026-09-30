// Tracks whether public/wasm/numerics.wasm is in sync with the cpp/ source
// that produced it. Both the committed .wasm AND this manifest are checked
// in, so a reviewer (or a future you) can see "sourceHash matches
// artifactHash" without needing emcc installed to verify it.
//
//   node wasm-manifest.mjs write          recompute + write the manifest
//   node wasm-manifest.mjs check          exit 1 if cpp/ has drifted
//   node wasm-manifest.mjs check --warn-only   same, but exit 0 (for prebuild)
import { createHash } from "node:crypto"
import { execSync } from "node:child_process"
import { readdir, readFile, writeFile, stat } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const wasmPath = path.join(root, "public/wasm/numerics.wasm")
const manifestPath = path.join(root, "lib/wasm/wasm-manifest.json")

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await listFiles(full)))
    else if (/\.(cpp|h)$/.test(entry.name)) files.push(full)
  }
  return files
}

async function computeSourceHash() {
  const files = await listFiles(path.join(root, "cpp"))
  files.push(path.join(root, "scripts/build-wasm.sh"))
  files.sort()

  const hash = createHash("sha256")
  for (const file of files) {
    hash.update(path.relative(root, file))
    hash.update("\0")
    hash.update(await readFile(file))
    hash.update("\0")
  }
  return hash.digest("hex")
}

async function computeArtifactHash() {
  const bytes = await readFile(wasmPath)
  return createHash("sha256").update(bytes).digest("hex")
}

function emccVersion() {
  try {
    return execSync("emcc --version", { encoding: "utf8" }).split("\n")[0].trim()
  } catch {
    return "unknown (emcc not found at manifest time)"
  }
}

const mode = process.argv[2]
const warnOnly = process.argv.includes("--warn-only")

if (mode === "write") {
  const sourceHash = await computeSourceHash()
  const artifactHash = await computeArtifactHash()
  const bytes = (await stat(wasmPath)).size

  const manifest = {
    abi: 1,
    sourceHash,
    artifactHash,
    emcc: emccVersion(),
    bytes,
    builtAt: new Date().toISOString(),
  }

  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n")
  console.log(`wrote ${path.relative(root, manifestPath)}`)
  console.log(manifest)
} else if (mode === "check") {
  let manifest
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"))
  } catch {
    console.error(`no manifest at ${path.relative(root, manifestPath)} — run: npm run build:wasm`)
    process.exit(warnOnly ? 0 : 1)
  }

  const sourceHash = await computeSourceHash()
  if (sourceHash !== manifest.sourceHash) {
    console.error("cpp/ has changed since public/wasm/numerics.wasm was built.")
    console.error(`  expected sourceHash ${manifest.sourceHash.slice(0, 12)}…  got ${sourceHash.slice(0, 12)}…`)
    console.error("Run: npm run build:wasm  (then commit public/wasm/ and lib/wasm/wasm-manifest.json)")
    process.exit(warnOnly ? 0 : 1)
  }

  const artifactHash = await computeArtifactHash()
  if (artifactHash !== manifest.artifactHash) {
    console.error("public/wasm/numerics.wasm does not match the manifest's recorded artifactHash.")
    console.error("Run: npm run build:wasm  (then commit public/wasm/ and lib/wasm/wasm-manifest.json)")
    process.exit(warnOnly ? 0 : 1)
  }

  console.log("ok: public/wasm/numerics.wasm is in sync with cpp/")
} else {
  console.error("usage: node wasm-manifest.mjs <write|check> [--warn-only]")
  process.exit(1)
}
