import { readFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = join(import.meta.dirname, "../..");
const snapshotPath = join(
  repoRoot,
  "apps/erp/src/server/api/contracts/afenda-internal-v1.openapi.json"
);

export const OPENAPI_DRIFT_STALE_MESSAGE =
  "OpenAPI snapshot is stale. Run: pnpm export:openapi";

export function compareOpenapiSnapshot(
  liveDocument: unknown,
  snapshot: unknown
): { readonly ok: true } | { readonly ok: false; readonly message: string } {
  if (JSON.stringify(liveDocument) !== JSON.stringify(snapshot)) {
    return { ok: false, message: OPENAPI_DRIFT_STALE_MESSAGE };
  }

  return { ok: true };
}

export function checkOpenapiDrift(input: {
  readonly liveDocument: unknown;
  readonly snapshot: unknown;
}): void {
  const result = compareOpenapiSnapshot(input.liveDocument, input.snapshot);

  if (!result.ok) {
    throw new Error(result.message);
  }
}

export async function buildLiveOpenapiDocument(): Promise<unknown> {
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

  return buildAfendaOpenapiDocument(API_CONTRACTS);
}

export function readOpenapiSnapshotFromDisk(
  path: string = snapshotPath
): unknown {
  return JSON.parse(readFileSync(path, "utf8"));
}

async function main(): Promise<void> {
  const liveDocument = await buildLiveOpenapiDocument();
  const snapshot = readOpenapiSnapshotFromDisk();

  checkOpenapiDrift({ liveDocument, snapshot });

  console.log("OpenAPI snapshot check passed.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
