import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const repoRoot = join(import.meta.dirname, "../..");
const canonicalPath = join(
  repoRoot,
  "apps/erp/src/server/api/contracts/afenda-internal-v1.openapi.json"
);
const docsCopyPath = join(
  repoRoot,
  "apps/docs/openapi/afenda-internal-v1.openapi.json"
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

  const document = buildAfendaOpenapiDocument(API_CONTRACTS);
  const serialized = `${JSON.stringify(document, null, 2)}\n`;

  writeFileSync(canonicalPath, serialized, "utf8");
  console.log(`Wrote ${canonicalPath}`);

  mkdirSync(dirname(docsCopyPath), { recursive: true });
  writeFileSync(docsCopyPath, serialized, "utf8");
  console.log(`Wrote ${docsCopyPath}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
