#!/usr/bin/env tsx
/** @deprecated Use check-split-id-persistence.mts — retained as alias for CI scripts. */

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const target = join(scriptDir, "check-split-id-persistence.mts");

const result = spawnSync("pnpm", ["exec", "tsx", target], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

process.exit(result.status ?? 1);
