import { readFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = join(import.meta.dirname, "../..");
const snapshotPath = join(
  repoRoot,
  "apps/erp/src/server/api/contracts/api-breaking-change-registry.snapshot.json"
);

export const API_BREAKING_CHANGE_REGISTRY_DRIFT_STALE_MESSAGE =
  "API breaking-change registry snapshot is stale. Run: pnpm export:api-breaking-change-registry";

export function compareBreakingChangeRegistrySnapshot(
  liveDocument: unknown,
  snapshot: unknown
): { readonly ok: true } | { readonly ok: false; readonly message: string } {
  if (JSON.stringify(liveDocument) !== JSON.stringify(snapshot)) {
    return {
      ok: false,
      message: API_BREAKING_CHANGE_REGISTRY_DRIFT_STALE_MESSAGE,
    };
  }

  return { ok: true };
}

export function checkBreakingChangeRegistryDrift(input: {
  readonly liveDocument: unknown;
  readonly snapshot: unknown;
}): void {
  const result = compareBreakingChangeRegistrySnapshot(
    input.liveDocument,
    input.snapshot
  );

  if (!result.ok) {
    throw new Error(result.message);
  }
}

export async function buildLiveBreakingChangeRegistryDocument(): Promise<unknown> {
  const [{ API_CONTRACTS }, { buildBreakingChangeRegistryDocument }] =
    await Promise.all([
      import(
        "../../apps/erp/src/server/api/contracts/api-contract-registry.ts"
      ),
      import(
        "../../apps/erp/src/server/api/contracts/core/api-lifecycle.contract.ts"
      ),
    ]);

  return buildBreakingChangeRegistryDocument(API_CONTRACTS);
}

export function readBreakingChangeRegistrySnapshotFromDisk(
  path: string = snapshotPath
): unknown {
  return JSON.parse(readFileSync(path, "utf8"));
}

async function main(): Promise<void> {
  const liveDocument = await buildLiveBreakingChangeRegistryDocument();
  const snapshot = readBreakingChangeRegistrySnapshotFromDisk();

  checkBreakingChangeRegistryDrift({ liveDocument, snapshot });

  console.log("API breaking-change registry snapshot check passed.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
