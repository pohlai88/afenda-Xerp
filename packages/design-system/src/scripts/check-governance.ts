/**
 * Governance orchestrator: runs all sub-checks in sequence.
 *
 * Exit code 0 = all checks passed.
 * Exit code 1 = one or more checks failed.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const scriptsDir = dirname(fileURLToPath(import.meta.url));

const checks = [
  "check-token-prefix.ts",
  "check-no-runtime-ui.ts",
  "check-no-deep-imports.ts",
  "check-no-duplicate-authority.ts",
  "check-public-api.ts",
];

let passed = 0;
let failed = 0;

for (const check of checks) {
  const scriptPath = join(scriptsDir, check);
  const result = spawnSync(
    process.execPath,
    ["--import", "tsx/esm", scriptPath],
    { stdio: "inherit" }
  );

  if (result.status === 0) {
    passed++;
  } else {
    failed++;
  }
}

process.stdout.write(`\n─── Governance summary ────────────────────────\n`);
process.stdout.write(`  Passed: ${passed}/${checks.length}\n`);
process.stdout.write(`  Failed: ${failed}/${checks.length}\n`);

if (failed > 0) {
  process.exit(1);
}
