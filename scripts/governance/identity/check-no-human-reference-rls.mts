#!/usr/bin/env tsx
/** ADR-0023 Slice F — alias for human-reference RLS prohibition (PAS §4.1.13). */

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const result = spawnSync("pnpm", ["check:rls-uuid-tenant-only"], {
  cwd: repoRoot,
  stdio: "inherit",
  shell: true,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(
  "No human reference RLS gate passed (ADR-0023 / PAS §4.1.13 — alias)."
);
