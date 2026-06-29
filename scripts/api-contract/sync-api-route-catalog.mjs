#!/usr/bin/env node
/**
 * Regenerate api-route-catalog.snapshot.json when staged contract sources change.
 *
 * Invoked from lint-staged on apps/erp contract paths — keeps snapshot aligned
 * with DEFAULT_GOVERNED_ROUTE_TEST_PATHS and registry exports before commit.
 */
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const snapshotRelative =
  "apps/erp/src/server/api/contracts/api-route-catalog.snapshot.json";

const stagedPaths = process.argv.slice(2).filter((arg) => arg.length > 0);

const shouldSync = stagedPaths.some(
  (filePath) =>
    filePath
      .replace(/\\/g, "/")
      .includes("apps/erp/src/server/api/contracts/") &&
    !filePath.endsWith("api-route-catalog.snapshot.json")
);

if (!shouldSync) {
  process.exit(0);
}

execSync("pnpm export:api-route-catalog", {
  cwd: repoRoot,
  stdio: "inherit",
});

execSync(`git add ${snapshotRelative}`, {
  cwd: repoRoot,
  stdio: "inherit",
});
