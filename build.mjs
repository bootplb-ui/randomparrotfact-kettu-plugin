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
  globalName: "plugin",
  minify: true,
  platform: "neutral",
  target: "es2020",
});

const output = await readFile(outFile);
const builtManifest = {
  ...manifest,
  hash: createHash("sha256").update(output).digest("hex"),
};
await writeFile(`${outDir}/manifest.json`, `${JSON.stringify(builtManifest, null, 2)}\n`);
console.log(`Built ${manifest.id} ${manifest.version} -> ${outDir}`);
