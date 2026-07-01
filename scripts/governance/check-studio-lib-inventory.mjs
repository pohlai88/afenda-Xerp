#!/usr/bin/env node
/**
 * PAS-006 L2 — lib module inventory gate.
 * Fails on add/delete without updating _lib-inventory.registry.ts.
 */
import { readFileSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(fileURLToPath(new URL(".", import.meta.url)), "../..");
const libDir = join(repoRoot, "packages/shadcn-studio/src/lib");
const inventoryPath = join(libDir, "_lib-inventory.registry.ts");
const inventoryMarker = "@afenda.lib-inventory";

const violations = [];

const inventorySource = readFileSync(inventoryPath, "utf8");

const registeredFiles = [
  ...inventorySource.matchAll(/file:\s*"([^"]+\.ts)"/g),
].map((match) => match[1]);

if (registeredFiles.length === 0) {
  violations.push("_lib-inventory.registry.ts: no registered files");
}

const discoveredFiles = readdirSync(libDir, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isFile() &&
      entry.name.endsWith(".ts") &&
      entry.name !== "_lib-inventory.registry.ts" &&
      !entry.name.startsWith("_")
  )
  .map((entry) => entry.name)
  .sort();

const registeredSet = new Set(registeredFiles);
const discoveredSet = new Set(discoveredFiles);

for (const file of registeredFiles) {
  if (!discoveredSet.has(file)) {
    violations.push(`registry lists missing file: lib/${file}`);
  }
}

for (const file of discoveredFiles) {
  if (!registeredSet.has(file)) {
    violations.push(
      `unregistered lib/${file} — add to _lib-inventory.registry.ts`
    );
  }
}

if (!inventorySource.includes(inventoryMarker)) {
  violations.push(
    `_lib-inventory.registry.ts: missing ${inventoryMarker} marker`
  );
}

if (violations.length > 0) {
  process.stderr.write("studio lib inventory: FAIL\n");
  for (const violation of violations) {
    process.stderr.write(`- ${violation}\n`);
  }
  process.exit(1);
}

const testRun = spawnSync(
  "pnpm",
  [
    "--filter",
    "@afenda/shadcn-studio",
    "exec",
    "vitest",
    "run",
    "lib-inventory.registry",
  ],
  { cwd: repoRoot, stdio: "inherit", shell: true }
);

if (testRun.status !== 0) {
  process.stderr.write("studio lib inventory: FAIL (vitest)\n");
  process.exit(testRun.status ?? 1);
}

process.stdout.write(
  `studio lib inventory: OK (${discoveredFiles.length} modules, series flat-L2-lib)\n`
);
process.exit(0);
