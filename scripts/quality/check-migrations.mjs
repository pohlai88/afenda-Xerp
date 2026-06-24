import { spawnSync } from "node:child_process";

import {
  findMissingRequiredKeys,
  loadMergedEnv,
  resolveRepoRoot,
} from "../env-utils.mjs";

run("pnpm", ["--filter", "@afenda/database", "db:validate-journal"]);

const repoRoot = resolveRepoRoot();
const merged = loadMergedEnv(repoRoot);
const missingDatabaseConfig = findMissingRequiredKeys(merged.entries);

if (missingDatabaseConfig.length === 0) {
  run("pnpm", ["--filter", "@afenda/database", "db:repair-journal:check"]);
} else {
  console.log(
    `migration live ledger check skipped: database not configured (${missingDatabaseConfig.join("; ")})`
  );
}

function run(command, args) {
  const result = spawnSync(command, args, {
    shell: process.platform === "win32",
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
