import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { IntegrationGraphSnapshotWire } from "../contracts";
import { deriveIntegrationPosture } from "../derive-integration-posture";

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../../../.."
);
const snapshotPath = path.join(
  REPO_ROOT,
  "docs/architecture/integration-graph.snapshot.json"
);

function readSnapshot(): IntegrationGraphSnapshotWire {
  return JSON.parse(
    readFileSync(snapshotPath, "utf8")
  ) as IntegrationGraphSnapshotWire;
}

describe("deriveIntegrationPosture", () => {
  it("detects lab routes without pas006 mirror in the live snapshot", () => {
    const posture = deriveIntegrationPosture(readSnapshot());
    const labPromoGap = posture.gaps.find((gap) => gap.id === "GAP-LAB-PROMO");

    expect(labPromoGap).toBeDefined();
    expect(labPromoGap?.nodeIds.length).toBeGreaterThan(0);
    expect(labPromoGap?.sliceId).toBe("FSI-S3");
  });

  it("reports counts from graph nodes", () => {
    const graph = readSnapshot();
    const posture = deriveIntegrationPosture(graph);

    expect(posture.counts.moduleSurfaces).toBe(
      graph.nodes.filter((node) => node.type === "module-surface").length
    );
    expect(posture.counts.labRoutes).toBeGreaterThan(0);
  });
});
