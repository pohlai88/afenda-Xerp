import { readFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = join(import.meta.dirname, "../..");
const snapshotPath = join(
  repoRoot,
  "apps/erp/src/server/api/contracts/api-route-catalog.snapshot.json"
);

export const API_ROUTE_CATALOG_DRIFT_STALE_MESSAGE =
  "API route catalog snapshot is stale. Run: pnpm export:api-route-catalog";

export function compareApiRouteCatalogSnapshot(
  liveCatalog: unknown,
  snapshot: unknown
): { readonly ok: true } | { readonly ok: false; readonly message: string } {
  if (JSON.stringify(liveCatalog) !== JSON.stringify(snapshot)) {
    return { ok: false, message: API_ROUTE_CATALOG_DRIFT_STALE_MESSAGE };
  }

  return { ok: true };
}

export function checkApiRouteCatalogDrift(input: {
  readonly liveCatalog: unknown;
  readonly snapshot: unknown;
}): void {
  const result = compareApiRouteCatalogSnapshot(
    input.liveCatalog,
    input.snapshot
  );

  if (!result.ok) {
    throw new Error(result.message);
  }
}

export async function buildLiveApiRouteCatalog(): Promise<unknown> {
  const [{ API_CONTRACTS }, { buildApiRouteCatalog }] = await Promise.all([
    import("../../apps/erp/src/server/api/contracts/api-contract-registry.ts"),
    import("../../apps/erp/src/server/api/contracts/api-route-catalog.ts"),
  ]);

  return buildApiRouteCatalog(API_CONTRACTS);
}

export function readApiRouteCatalogSnapshotFromDisk(
  path: string = snapshotPath
): unknown {
  return JSON.parse(readFileSync(path, "utf8"));
}

async function main(): Promise<void> {
  const liveCatalog = await buildLiveApiRouteCatalog();
  const snapshot = readApiRouteCatalogSnapshotFromDisk();

  checkApiRouteCatalogDrift({ liveCatalog, snapshot });

  console.log("API route catalog snapshot check passed.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
