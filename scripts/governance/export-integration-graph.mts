import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const repoRoot = join(import.meta.dirname, "../..");
const snapshotPath = join(
  repoRoot,
  "docs/architecture/integration-graph.snapshot.json"
);

export const INTEGRATION_GRAPH_VERSION = "1.0.0" as const;

export const INTEGRATION_GRAPH_DRIFT_STALE_MESSAGE =
  "Integration graph snapshot is stale. Run: pnpm export:integration-graph";

export interface IntegrationGraphNode {
  readonly id: string;
  readonly label: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly type:
    | "api-operation"
    | "ccp"
    | "gate"
    | "lab-route"
    | "module-surface"
    | "package"
    | "spine-wiring";
}

export interface IntegrationGraphEdge {
  readonly source: string;
  readonly target: string;
  readonly type: "consumes" | "depends-on" | "materializes" | "validates";
}

export interface IntegrationGraphSlice {
  readonly id: string;
  readonly priority: string;
  readonly status: "delivered" | "in-progress" | "planned";
  readonly summary: string;
}

export interface IntegrationGraphSnapshot {
  readonly edges: readonly IntegrationGraphEdge[];
  readonly fingerprint: string;
  readonly generatedAt: string;
  readonly nodes: readonly IntegrationGraphNode[];
  readonly slices: readonly IntegrationGraphSlice[];
  readonly version: typeof INTEGRATION_GRAPH_VERSION;
}

export const FSI_CCP_DEFINITIONS = [
  {
    control: "Triple proof — registry + delegate + gate",
    gateCommand: "check:foundation-disposition",
    id: "FSI-CCP-001",
  },
  {
    control: "Registry-before-filesystem for ERP pages",
    gateCommand: "check:erp-module-readiness",
    id: "FSI-CCP-002",
  },
  {
    control: "pas006-ui contract materialization",
    gateCommand: "check:procurement-pas006-ui-contract",
    id: "FSI-CCP-003",
  },
  {
    control: "API operation registry completeness",
    gateCommand: "check:api-contracts",
    id: "FSI-CCP-004",
  },
  {
    control: "OpenAPI publication drift",
    gateCommand: "check:openapi-drift",
    id: "FSI-CCP-005",
  },
  {
    control: "Spine consumer wiring",
    gateCommand: "quality:kernel-context-surface",
    id: "FSI-CCP-006",
  },
  {
    control: "Lab route surface registry",
    gateCommand: "check:route-lab-governance",
    id: "FSI-CCP-007",
  },
  {
    control: "Lab runtime authority boundary",
    gateCommand: "check:route-lab-governance",
    id: "FSI-CCP-008",
  },
  {
    control: "Presentation v2 consumer imports",
    gateCommand: "quality:erp-metadata-pas006-consumer",
    id: "FSI-CCP-009",
  },
  {
    control: "Integration graph export freshness",
    gateCommand: "check:integration-graph-drift",
    id: "FSI-CCP-010",
  },
  {
    control: "Documentation authority sync",
    gateCommand: "check:documentation-drift",
    id: "FSI-CCP-011",
  },
  {
    control: "Developer lab greenlight",
    gateCommand: "check:developer-route-lab-greenlight",
    id: "FSI-CCP-012",
  },
  {
    control: "Module context spine consumer",
    gateCommand: "check:procurement-context-spine-consumer",
    id: "FSI-CCP-013",
  },
  {
    control: "ERP typecheck on surface change",
    gateCommand: "filter:@afenda/erp:typecheck",
    id: "FSI-CCP-014",
  },
] as const;

export const FSI_SLICE_DEFINITIONS = [
  {
    id: "FSI-S7",
    priority: "P0",
    status: "planned",
    summary: "Module surface registry materialization",
  },
  {
    id: "FSI-S8",
    priority: "P0",
    status: "planned",
    summary: "Rendering matrix (force-dynamic, BFF cache mirror)",
  },
  {
    id: "FSI-S3",
    priority: "P1",
    status: "planned",
    summary: "Lab→ERP promotion attestation",
  },
  {
    id: "FSI-S1",
    priority: "P1",
    status: "planned",
    summary: "Consumer envelope discipline",
  },
  {
    id: "FSI-S6",
    priority: "P1",
    status: "in-progress",
    summary: "v1→v2 presentation cutover",
  },
  {
    id: "FSI-S9",
    priority: "P1",
    status: "planned",
    summary: "MCP route verification",
  },
  {
    id: "FSI-S2",
    priority: "P1",
    status: "planned",
    summary: "Wire→UI mapper registry",
  },
  {
    id: "FSI-S4",
    priority: "P2",
    status: "planned",
    summary: "Metadata binding materialization",
  },
  {
    id: "FSI-S5",
    priority: "P2",
    status: "planned",
    summary: "OpenAPI↔permission parity",
  },
  {
    id: "FSI-S10",
    priority: "P1",
    status: "delivered",
    summary: "Integration graph export + dashboard",
  },
] as const satisfies readonly IntegrationGraphSlice[];

function gateNodeId(gateCommand: string): string {
  return `gate:${gateCommand}`;
}

function addNode(
  nodes: IntegrationGraphNode[],
  node: IntegrationGraphNode
): void {
  if (!nodes.some((entry) => entry.id === node.id)) {
    nodes.push(node);
  }
}

function addEdge(
  edges: IntegrationGraphEdge[],
  edge: IntegrationGraphEdge
): void {
  const key = `${edge.type}:${edge.source}:${edge.target}`;
  if (
    !edges.some(
      (entry) =>
        `${entry.type}:${entry.source}:${entry.target}` === key
    )
  ) {
    edges.push(edge);
  }
}

export async function buildIntegrationGraphSnapshot(): Promise<IntegrationGraphSnapshot> {
  const nodes: IntegrationGraphNode[] = [];
  const edges: IntegrationGraphEdge[] = [];

  const [
    { FOUNDATION_DISPOSITION_FINGERPRINT, FOUNDATION_DISPOSITION_REGISTRY },
    { API_CONTRACTS },
    { PROCUREMENT_PAS006_UI_CONTRACT },
    { CONTEXT_INTEGRATION_WIRING },
    { labApiRouteRegistry },
    { labRouteSurfaceRegistry },
  ] = await Promise.all([
    import(
      "../../packages/architecture-authority/src/data/foundation-disposition.registry.ts"
    ),
    import(
      "../../apps/erp/src/server/api/contracts/api-contract-registry.ts"
    ),
    import(
      "../../packages/features/erp-modules/src/procurement/procurement.pas006-ui.contract.ts"
    ),
    import(
      "../../apps/erp/src/lib/context/context-integration-registry.ts"
    ),
    import("../../apps/developer/src/lib/lab/lab-api-route-registry.ts"),
    import("../../apps/developer/src/lib/lab/route-surface-registry.ts"),
  ]);

  for (const entry of FOUNDATION_DISPOSITION_REGISTRY) {
    addNode(nodes, {
      id: `pkg:${entry.id}`,
      label: entry.packageName,
      metadata: {
        domain: entry.domain,
        lane: entry.lane,
        packageId: entry.packageId,
        runtimeOwner: entry.runtimeOwner,
      },
      type: "package",
    });
  }

  const erpPackageIds = FOUNDATION_DISPOSITION_REGISTRY.filter(
    (entry) => entry.packageName === "@afenda/erp"
  ).map((entry) => `pkg:${entry.id}`);

  for (const contract of API_CONTRACTS) {
    const nodeId = `api:${contract.id}`;
    addNode(nodes, {
      id: nodeId,
      label: contract.id,
      metadata: {
        apiFamily: contract.apiFamily,
        method: contract.method,
        path: contract.path,
      },
      type: "api-operation",
    });

    addEdge(edges, {
      source: gateNodeId("check:api-contracts"),
      target: nodeId,
      type: "validates",
    });

    for (const pkgId of erpPackageIds) {
      addEdge(edges, {
        source: pkgId,
        target: nodeId,
        type: "materializes",
      });
    }
  }

  for (const route of PROCUREMENT_PAS006_UI_CONTRACT.routes) {
    const surfaceId = `surface:${route.surfaceId}`;
    addNode(nodes, {
      id: surfaceId,
      label: route.surfaceId,
      metadata: {
        blockId: route.blockId,
        loaderPath: route.loaderPath,
        pagePath: route.pagePath,
        routePattern: route.routePattern,
        surfaceTemplateId: route.surfaceTemplateId,
      },
      type: "module-surface",
    });

    addEdge(edges, {
      source: surfaceId,
      target: gateNodeId("check:procurement-pas006-ui-contract"),
      type: "validates",
    });

    const matchingSpine = CONTEXT_INTEGRATION_WIRING.find(
      (wiring) =>
        wiring.module.includes(route.pagePath.split("/").pop() ?? "") ||
        wiring.module === route.module
    );

    if (matchingSpine) {
      addEdge(edges, {
        source: surfaceId,
        target: `spine:${matchingSpine.id}`,
        type: "consumes",
      });
    }
  }

  for (const wiring of CONTEXT_INTEGRATION_WIRING) {
    addNode(nodes, {
      id: `spine:${wiring.id}`,
      label: wiring.id,
      metadata: {
        delegate: wiring.delegate,
        module: wiring.module,
        step: wiring.step,
      },
      type: "spine-wiring",
    });
  }

  for (const entry of labApiRouteRegistry) {
    addNode(nodes, {
      id: `lab-api:${entry.routeId}`,
      label: entry.path,
      metadata: {
        dynamic: entry.dynamic,
        method: entry.method,
        summary: entry.summary,
      },
      type: "lab-route",
    });

    addEdge(edges, {
      source: `lab-api:${entry.routeId}`,
      target: gateNodeId("check:route-lab-governance"),
      type: "validates",
    });
  }

  for (const entry of labRouteSurfaceRegistry) {
    if (entry.href === "/") {
      continue;
    }

    addNode(nodes, {
      id: `lab-page:${entry.routeId}`,
      label: entry.href,
      metadata: {
        kind: entry.kind,
        promotionTarget: entry.promotionTarget,
        routePath: entry.routePath,
      },
      type: "lab-route",
    });

    addEdge(edges, {
      source: `lab-page:${entry.routeId}`,
      target: gateNodeId("check:route-lab-governance"),
      type: "validates",
    });
  }

  for (const ccp of FSI_CCP_DEFINITIONS) {
    addNode(nodes, {
      id: ccp.id,
      label: ccp.id,
      metadata: {
        control: ccp.control,
        gateCommand: ccp.gateCommand,
        owner: "full-stack-integration",
      },
      type: "ccp",
    });

    const gateId = gateNodeId(ccp.gateCommand);
    addNode(nodes, {
      id: gateId,
      label: ccp.gateCommand,
      metadata: { command: `pnpm ${ccp.gateCommand}` },
      type: "gate",
    });

    addEdge(edges, {
      source: gateId,
      target: ccp.id,
      type: "validates",
    });
  }

  addEdge(edges, {
    source: gateNodeId("check:integration-graph-drift"),
    target: "FSI-CCP-010",
    type: "validates",
  });

  return {
    edges,
    fingerprint: FOUNDATION_DISPOSITION_FINGERPRINT,
    generatedAt: new Date().toISOString(),
    nodes,
    slices: [...FSI_SLICE_DEFINITIONS],
    version: INTEGRATION_GRAPH_VERSION,
  };
}

export function compareIntegrationGraphSnapshots(
  live: IntegrationGraphSnapshot,
  snapshot: IntegrationGraphSnapshot
): { readonly ok: true } | { readonly ok: false; readonly message: string } {
  const normalize = (value: IntegrationGraphSnapshot): unknown => ({
    edges: [...value.edges].sort((a, b) =>
      `${a.type}:${a.source}:${a.target}`.localeCompare(
        `${b.type}:${b.source}:${b.target}`
      )
    ),
    fingerprint: value.fingerprint,
    nodes: [...value.nodes].sort((a, b) => a.id.localeCompare(b.id)),
    slices: [...value.slices].sort((a, b) => a.id.localeCompare(b.id)),
    version: value.version,
  });

  if (JSON.stringify(normalize(live)) !== JSON.stringify(normalize(snapshot))) {
    return { ok: false, message: INTEGRATION_GRAPH_DRIFT_STALE_MESSAGE };
  }

  return { ok: true };
}

async function main(): Promise<void> {
  const snapshot = await buildIntegrationGraphSnapshot();
  const serialized = `${JSON.stringify(snapshot, null, 2)}\n`;

  mkdirSync(dirname(snapshotPath), { recursive: true });
  writeFileSync(snapshotPath, serialized, "utf8");

  console.log(`Wrote ${snapshotPath}`);
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
