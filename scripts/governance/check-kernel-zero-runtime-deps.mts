#!/usr/bin/env tsx
/**
 * Kernel zero runtime dependencies gate (PAS-001 §14.2).
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);
const packageJsonPath = join(repoRoot, "packages/kernel/package.json");

interface KernelPackageJson {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

const pkg = JSON.parse(
  readFileSync(packageJsonPath, "utf8")
) as KernelPackageJson;

const runtimeDeps = Object.keys(pkg.dependencies ?? {});
const peerDeps = Object.keys(pkg.peerDependencies ?? {});

if (runtimeDeps.length > 0 || peerDeps.length > 0) {
  console.error("Kernel zero-runtime-deps gate failed.");
  if (runtimeDeps.length > 0) {
    console.error(`  dependencies: ${runtimeDeps.join(", ")}`);
  }
  if (peerDeps.length > 0) {
    console.error(`  peerDependencies: ${peerDeps.join(", ")}`);
  }
  process.exit(1);
}

console.log("Kernel zero-runtime-deps gate passed.");
