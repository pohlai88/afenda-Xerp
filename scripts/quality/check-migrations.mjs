import { spawnSync } from "node:child_process";

run("pnpm", ["--filter", "@afenda/database", "db:validate-journal"]);

if (process.env.DATABASE_URL) {
  run("pnpm", ["--filter", "@afenda/database", "db:repair-journal:check"]);
} else {
  console.log("migration live ledger check skipped: DATABASE_URL is not set");
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
