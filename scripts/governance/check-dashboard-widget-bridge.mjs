#!/usr/bin/env node
/**
 * ERP workspace dashboard widget bridge gate — canonical widget ids must resolve
 * to MCP seed blocks with live studio preview components.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

const testRun = spawnSync(
  "pnpm",
  [
    "--filter",
    "@afenda/erp",
    "exec",
    "vitest",
    "run",
    "dashboard-widget-bridge.registry",
  ],
  { cwd: repoRoot, stdio: "inherit", shell: true }
);

if (testRun.status !== 0) {
  process.stderr.write("dashboard widget bridge: FAIL (vitest)\n");
  process.exit(testRun.status ?? 1);
}

process.stdout.write("dashboard widget bridge: OK\n");
process.exit(0);
