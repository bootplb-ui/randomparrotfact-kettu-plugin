import { mkdir, readFile, writeFile } from "node:fs/promises";
import { build } from "esbuild";
import { createHash } from "node:crypto";

const manifest = JSON.parse(await readFile("manifest.json", "utf8"));
const outDir = `builds/${manifest.id}`;
const outFile = `${outDir}/index.js`;

await mkdir(outDir, { recursive: true });
await build({
  entryPoints: ["src/index.ts"],
  outfile: outFile,
  bundle: true,
  format: "iife",
  // Kettu's legacy/Vendetta installer evaluates the file as `return <code>`.
  // A globalName would emit `var plugin = ...`, which is invalid after return.
  globalName: "plugin",
  minify: true,
  platform: "neutral",
  target: "es2020",
});

let output = await readFile(outFile, "utf8");
const prefix = '"use strict";var plugin=';
if (!output.startsWith(prefix)) {
  throw new Error("Unexpected esbuild IIFE output; cannot create Kettu expression bundle");
}
output = output.slice(prefix.length);
await writeFile(outFile, output);

const built = Buffer.from(output);
const builtManifest = {
  ...manifest,
  hash: createHash("sha256").update(built).digest("hex"),
};
await writeFile(`${outDir}/manifest.json`, `${JSON.stringify(builtManifest, null, 2)}\n`);
console.log(`Built ${manifest.id} ${manifest.version} -> ${outDir}`);
