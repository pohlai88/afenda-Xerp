import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Metadata } from "next";
import type {
  ArchitectureMapPageData,
  IntegrationGraphSnapshotWire,
  LabRouteLoader,
} from "./contracts";
import { createCachedLabLoader } from "./create-cached-lab-loader.server";
import { createRouteLabMetadata } from "./create-route-lab-metadata";
import { deriveIntegrationPosture } from "./derive-integration-posture";

const repoRoot = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../../.."
);
const snapshotPath = join(
  repoRoot,
  "docs/architecture/integration-graph.snapshot.json"
);

export const architectureMapPromotionNote = {
  futureDataSource: "domain-loader",
  futureErpPath: "N/A — lab-only governance UX per ADR-0044",
  notes:
    "Integration Map stays in the Developer Route Lab permanently. ERP operators do not need architecture force graphs.",
} as const satisfies ArchitectureMapPageData["promotion"];

const TARGET_INGRESS_MERMAID = `flowchart TB
  subgraph contract [Contract Layer]
    PAS006[pas006-ui contract row]
    MODFDN[erp-modules foundation]
  end

  subgraph loader [Loader Layer]
    LOAD[load-*-page.server.ts]
    SPINE[spine delegate]
  end

  subgraph ingress [Presentation Ingress]
    PAGE[page.tsx RSC]
    COMP[_components/]
    V2[studio-v2 blocks]
  end

  subgraph proof [Mechanical Proof]
    GATE[registry gate or test]
  end

  MODFDN --> PAS006
  PAS006 --> LOAD
  LOAD --> SPINE
  LOAD --> PAGE
  PAGE --> COMP
  COMP --> V2
  PAS006 --> GATE
  LOAD --> GATE`;

function readIntegrationGraphSnapshot(): IntegrationGraphSnapshotWire {
  const raw = readFileSync(snapshotPath, "utf8");
  return JSON.parse(raw) as IntegrationGraphSnapshotWire;
}

const loadArchitectureMapPageUncached: LabRouteLoader<
  ArchitectureMapPageData
> = async () => {
  await Promise.resolve();
  const graph = readIntegrationGraphSnapshot();

  const generatedAtLabel = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(graph.generatedAt));

  return {
    canonicalHref: "/architecture",
    title: "Integration Map — full-stack traceability mirror",
    description:
      "Read-only architecture mirror — force graph, layer overview, surface traceability, and CCP status seeded from generated integration-graph.snapshot.json.",
    previewImage: {
      alt: "Integration Map dashboard showing layer overview, dependency graph, and traceability panels in the Afenda route lab.",
      height: 720,
      src: "/route-lab-blueprint.svg",
      width: 1280,
    },
    promotionSummary:
      "Governance visualization only. Snapshot regenerates from live registries via pnpm export:integration-graph.",
    promotion: architectureMapPromotionNote,
    targetIngressMermaid: TARGET_INGRESS_MERMAID,
    generatedAtLabel,
    graph,
    posture: deriveIntegrationPosture(graph),
    slices: graph.slices,
  } satisfies ArchitectureMapPageData;
};

export const loadArchitectureMapPage = createCachedLabLoader(
  loadArchitectureMapPageUncached
);

export function createArchitectureMapMetadata(): Metadata {
  return createRouteLabMetadata({
    canonicalHref: "/architecture",
    description:
      "Developer Route Lab Integration Map — machine traceability mirror for full-stack integration registries.",
    previewImage: {
      alt: "Integration Map dashboard showing layer overview, dependency graph, and traceability panels in the Afenda route lab.",
      height: 720,
      src: "/route-lab-blueprint.svg",
      width: 1280,
    },
    title: "Integration Map — full-stack traceability mirror",
  });
}
