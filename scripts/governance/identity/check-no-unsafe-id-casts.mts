#!/usr/bin/env tsx
/** @deprecated Use check-identity-boundary.mts — retained as alias for CI scripts. */

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const target = join(scriptDir, "check-identity-boundary.mts");

const result = spawnSync("pnpm", ["exec", "tsx", target], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

process.exit(result.status ?? 1);
