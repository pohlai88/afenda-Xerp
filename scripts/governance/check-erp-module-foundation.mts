#!/usr/bin/env tsx
/**
 * Composite ERP module foundation gate (PAS-001C §6).
 * Runs all sub-gates; exit 0 only when every sub-gate passes.
 */

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import {
  ERP_MODULE_FOUNDATION_GATE,
  ERP_MODULE_FOUNDATION_SUB_GATES,
} from "./erp-module-foundation-registry.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const failures: string[] = [];

for (const gate of ERP_MODULE_FOUNDATION_SUB_GATES) {
  const result = spawnSync("pnpm", [gate], {
    cwd: repoRoot,
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) {
    failures.push(gate);
  }
}

if (failures.length > 0) {
  console.error(
    `✗ ${ERP_MODULE_FOUNDATION_GATE} failed — sub-gates: ${failures.join(", ")}`
  );
  process.exit(1);
}

console.log(`✓ ${ERP_MODULE_FOUNDATION_GATE} passed (all sub-gates green)`);
