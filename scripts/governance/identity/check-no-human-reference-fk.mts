#!/usr/bin/env tsx
/** ADR-0023 Slice F — alias for human-reference FK prohibition (PAS §4.1.13). */

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const gates = ["check:fk-uuid-only", "check:split-id-persistence"] as const;

for (const gate of gates) {
  const result = spawnSync("pnpm", [gate], {
    cwd: repoRoot,
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(
  "No human reference FK gate passed (ADR-0023 / PAS §4.1.13 — alias)."
);
