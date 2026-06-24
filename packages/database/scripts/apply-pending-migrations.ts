import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { applyPendingSqlMigrationsFallback } from "./apply-sql-migrations-fallback.js";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

const result = spawnSync(
  "drizzle-kit",
  ["migrate", "--config", "drizzle.config.ts"],
  {
    cwd: packageRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      FORCE_COLOR: "0",
      NO_COLOR: "1",
    },
    shell: process.platform === "win32",
  }
);

if (result.stdout) {
  process.stdout.write(result.stdout);
}

if (result.stderr) {
  process.stderr.write(result.stderr);
}

if (result.status === 0) {
  console.log("migrate: applied pending migrations successfully");
  process.exit(0);
}

const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
if (output.length > 0) {
  console.error("\nmigrate: drizzle-kit failed:");
  console.error(output);
} else if (result.error) {
  console.error("\nmigrate: drizzle-kit failed:", result.error.message);
} else {
  console.error(
    "\nmigrate: drizzle-kit failed with no output — attempting statement-by-statement fallback"
  );
}

try {
  const applied = await applyPendingSqlMigrationsFallback();
  if (applied === 0) {
    console.error(
      "migrate: fallback found no pending migrations — check ledger drift with db:repair-journal"
    );
    process.exit(result.status ?? 1);
  }

  console.log(`migrate: fallback applied ${applied} migration(s) successfully`);
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error("migrate: fallback failed:", message);
  process.exit(1);
}
