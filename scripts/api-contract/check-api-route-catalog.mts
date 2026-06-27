import { readFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = join(import.meta.dirname, "../..");
const snapshotPath = join(
  repoRoot,
  "apps/erp/src/server/api/contracts/api-route-catalog.snapshot.json"
);

async function main(): Promise<void> {
  const [{ API_CONTRACTS }, { buildApiRouteCatalog }] = await Promise.all([
    import("../../apps/erp/src/server/api/contracts/api-contract-registry.ts"),
    import("../../apps/erp/src/server/api/contracts/api-route-catalog.ts"),
  ]);

  const liveCatalog = buildApiRouteCatalog(API_CONTRACTS);
  const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8"));

  if (JSON.stringify(liveCatalog) !== JSON.stringify(snapshot)) {
    console.error(
      "API route catalog snapshot is stale. Run: pnpm export:api-route-catalog"
    );
    process.exit(1);
  }

  console.log("API route catalog snapshot check passed.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
