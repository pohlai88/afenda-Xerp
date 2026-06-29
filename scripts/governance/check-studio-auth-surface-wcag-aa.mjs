#!/usr/bin/env node
import { spawnSync } from "node:child_process";
/**
 * PAS-006C P06-007 — auth-adjacent WCAG 2.2 AA acceptance gate.
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

const requiredPaths = [
  "apps/erp/src/lib/auth/auth-wcag-adjacent.registry.ts",
  "apps/erp/src/lib/auth/__tests__/auth-wcag-aa.contract.test.tsx",
];

const missing = requiredPaths.filter(
  (relativePath) => !existsSync(join(repoRoot, relativePath))
);

if (missing.length > 0) {
  process.stderr.write("studio auth surface WCAG AA: FAIL\n");
  for (const path of missing) {
    process.stderr.write(`- missing required file: ${path}\n`);
  }
  process.exit(1);
}

const testRun = spawnSync(
  "pnpm",
  ["--filter", "@afenda/erp", "exec", "vitest", "run", "auth-wcag-aa.contract"],
  { cwd: repoRoot, stdio: "inherit", shell: true }
);

if (testRun.status !== 0) {
  process.stderr.write("studio auth surface WCAG AA: FAIL (vitest)\n");
  process.exit(testRun.status ?? 1);
}

process.stdout.write("studio auth surface WCAG AA: OK\n");
process.exit(0);
