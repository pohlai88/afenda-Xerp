import { writeFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = join(import.meta.dirname, "../..");
const snapshotPath = join(
  repoRoot,
  "apps/erp/src/server/api/contracts/api-breaking-change-registry.snapshot.json"
);

async function main(): Promise<void> {
  const [{ API_CONTRACTS }, { buildBreakingChangeRegistryDocument }] =
    await Promise.all([
      import(
        "../../apps/erp/src/server/api/contracts/api-contract-registry.ts"
      ),
      import(
        "../../apps/erp/src/server/api/contracts/core/api-lifecycle.contract.ts"
      ),
    ]);

  const document = buildBreakingChangeRegistryDocument(API_CONTRACTS);
  writeFileSync(snapshotPath, `${JSON.stringify(document, null, 2)}\n`, "utf8");
  console.log(`Wrote ${snapshotPath}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
