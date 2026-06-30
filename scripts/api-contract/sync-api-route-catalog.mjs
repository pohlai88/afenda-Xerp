#!/usr/bin/env node
/**
 * Regenerate api-route-catalog.snapshot.json when staged contract sources change.
 *
 * Invoked from lint-staged on apps/erp contract paths — keeps snapshot aligned
 * with DEFAULT_GOVERNED_ROUTE_TEST_PATHS and registry exports before commit.
 */
import { execSync } from "node:child_process";
import { closeSync, existsSync, openSync, unlinkSync } from "node:fs";
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

const lockPath = join(repoRoot, ".git/api-route-catalog-sync.lock");

function releaseLock() {
  try {
    unlinkSync(lockPath);
  } catch {
    // ignore — lock may already be released by the owner
  }
}

function sleepMs(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function acquireLock(maxWaitMs = 120_000) {
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    try {
      const fd = openSync(lockPath, "wx");
      closeSync(fd);
      return true;
    } catch (error) {
      if (error?.code !== "EEXIST") {
        throw error;
      }
      sleepMs(100);
    }
  }
  return false;
}

function waitForLockRelease(maxWaitMs = 120_000) {
  const deadline = Date.now() + maxWaitMs;
  while (existsSync(lockPath) && Date.now() < deadline) {
    sleepMs(100);
  }
}

if (!acquireLock()) {
  waitForLockRelease();
  process.exit(0);
}

try {
  execSync("pnpm export:api-route-catalog", {
    cwd: repoRoot,
    stdio: "inherit",
  });

  execSync(`git add ${snapshotRelative}`, {
    cwd: repoRoot,
    stdio: "inherit",
  });
} finally {
  releaseLock();
}
