import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

const catalogFiles = [
  "auth-routes.catalog.json",
  "system-admin.catalog.json",
  "permissions.catalog.json",
  "env.catalog.json",
  "modules.catalog.json",
];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function normalizeCatalogForCompare(catalog) {
  if (!catalog || typeof catalog !== "object") {
    return catalog;
  }

  const { exportedAt: _exportedAt, ...rest } = catalog;
  return rest;
}

function main() {
  const tempDir = mkdtempSync(join(tmpdir(), "afenda-docs-catalog-"));
  const committedDir = join(repoRoot, "apps/docs/data");

  try {
    const result = spawnSync(
      "pnpm",
      [
        "exec",
        "tsx",
        join(repoRoot, "scripts/docs/run-catalog-export.mts"),
        `--output-dir=${tempDir}`,
      ],
      {
        cwd: repoRoot,
        stdio: "inherit",
        shell: true,
      }
    );

    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }

    const stale = [];

    for (const fileName of catalogFiles) {
      const committedPath = join(committedDir, fileName);
      const freshPath = join(tempDir, fileName);

      let committed;
      try {
        committed = readJson(committedPath);
      } catch {
        stale.push(`${fileName} (missing committed snapshot)`);
        continue;
      }

      let fresh;
      try {
        fresh = readJson(freshPath);
      } catch {
        stale.push(`${fileName} (missing fresh export)`);
        continue;
      }

      if (
        JSON.stringify(normalizeCatalogForCompare(committed)) !==
        JSON.stringify(normalizeCatalogForCompare(fresh))
      ) {
        stale.push(fileName);
      }
    }

    if (stale.length > 0) {
      console.error(
        "Docs catalog snapshots are stale. Run: pnpm sync:product-docs\nStale files:"
      );
      for (const file of stale) {
        console.error(`  - ${file}`);
      }
      process.exit(1);
    }

    console.log("Docs catalog drift check passed.");
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

main();
