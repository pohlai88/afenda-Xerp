import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import {
  buildIntegrationGraphSnapshot,
  compareIntegrationGraphSnapshots,
  type IntegrationGraphSnapshot,
} from "./export-integration-graph.mts";

const repoRoot = join(import.meta.dirname, "../..");
const snapshotPath = join(
  repoRoot,
  "docs/architecture/integration-graph.snapshot.json"
);

export function readIntegrationGraphSnapshotFromDisk(
  path: string = snapshotPath
): IntegrationGraphSnapshot {
  return JSON.parse(readFileSync(path, "utf8")) as IntegrationGraphSnapshot;
}

export function checkIntegrationGraphDrift(input: {
  readonly liveSnapshot: IntegrationGraphSnapshot;
  readonly snapshot: IntegrationGraphSnapshot;
}): void {
  const result = compareIntegrationGraphSnapshots(
    input.liveSnapshot,
    input.snapshot
  );

  if (!result.ok) {
    throw new Error(result.message);
  }
}

async function main(): Promise<void> {
  const liveSnapshot = await buildIntegrationGraphSnapshot();
  const snapshot = readIntegrationGraphSnapshotFromDisk();

  checkIntegrationGraphDrift({ liveSnapshot, snapshot });

  console.log("Integration graph snapshot check passed.");
  console.log(
    `Nodes: ${snapshot.nodes.length} · Edges: ${snapshot.edges.length}`
  );
}

const isDirectRun =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
