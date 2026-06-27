import { readFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = join(import.meta.dirname, "../..");
const snapshotPath = join(
  repoRoot,
  "apps/erp/src/server/api/contracts/afenda-internal-v1.openapi.json"
);

async function main(): Promise<void> {
  const [{ API_CONTRACTS }, { buildAfendaOpenapiDocument }] = await Promise.all(
    [
      import(
        "../../apps/erp/src/server/api/contracts/api-contract-registry.ts"
      ),
      import(
        "../../apps/erp/src/server/api/contracts/openapi/build-afenda-openapi-document.ts"
      ),
    ]
  );

  const liveDocument = buildAfendaOpenapiDocument(API_CONTRACTS);
  const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8"));

  if (JSON.stringify(liveDocument) !== JSON.stringify(snapshot)) {
    console.error("OpenAPI snapshot is stale. Run: pnpm export:openapi");
    process.exit(1);
  }

  console.log("OpenAPI snapshot check passed.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
