#!/usr/bin/env node
/**
 * PAS-006 L1 — registry module inventory gate.
 * Fails on add/delete without updating _registry-inventory.registry.ts.
 */
import { readFileSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(fileURLToPath(new URL(".", import.meta.url)), "../..");
const registryDir = join(repoRoot, "packages/shadcn-studio/src/meta-registry");
const inventoryPath = join(registryDir, "_registry-inventory.registry.ts");
const inventoryMarker = "@afenda.registry-inventory";

const violations = [];

const inventorySource = readFileSync(inventoryPath, "utf8");

const registeredFiles = [
  ...inventorySource.matchAll(/file:\s*"([^"]+\.tsx?)"/g),
].map((match) => match[1]);

if (registeredFiles.length === 0) {
  violations.push("_registry-inventory.registry.ts: no registered files");
}

const discoveredFiles = readdirSync(registryDir, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isFile() &&
      (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) &&
      entry.name !== "_registry-inventory.registry.ts" &&
      !entry.name.startsWith("_")
  )
  .map((entry) => entry.name)
  .sort();

const registeredSet = new Set(registeredFiles);
const discoveredSet = new Set(discoveredFiles);

for (const file of registeredFiles) {
  if (!discoveredSet.has(file)) {
    violations.push(`registry lists missing file: meta-registry/${file}`);
  }
}

for (const file of discoveredFiles) {
  if (!registeredSet.has(file)) {
    violations.push(
      `unregistered meta-registry/${file} — add to _registry-inventory.registry.ts`
    );
  }
}

if (!inventorySource.includes(inventoryMarker)) {
  violations.push(
    `_registry-inventory.registry.ts: missing ${inventoryMarker} marker`
  );
}

if (violations.length > 0) {
  process.stderr.write("studio registry inventory: FAIL\n");
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
    "registry-inventory.registry",
  ],
  { cwd: repoRoot, stdio: "inherit", shell: true }
);

if (testRun.status !== 0) {
  process.stderr.write("studio registry inventory: FAIL (vitest)\n");
  process.exit(testRun.status ?? 1);
}

process.stdout.write(
  `studio registry inventory: OK (${discoveredFiles.length} modules, series flat-L1-registry)\n`
);
process.exit(0);
