import type {
  IntegrationGraphNodeWire,
  IntegrationGraphSnapshotWire,
  IntegrationPostureGapWire,
  IntegrationPostureWire,
} from "./contracts";

export type IntegrationGapId = "GAP-LAB-PROMO" | "GAP-MISSING-SPINE";

export type SurfacePromotionStatus = "erp-only" | "lab-only" | "matched";

const GAP_CATALOG: Record<
  IntegrationGapId,
  {
    advice: string;
    severity: IntegrationPostureGapWire["severity"];
    sliceId: string;
    target: string;
  }
> = {
  "GAP-LAB-PROMO": {
    advice:
      "Add a pas006-ui contract row and ERP loader before promotion, or change promotionTarget if the route stays lab-only.",
    severity: "high",
    sliceId: "FSI-S3",
    target: "promotionTarget: erp-route has pas006 mirror",
  },
  "GAP-MISSING-SPINE": {
    advice:
      "Wire the surface loader through a spine delegate and add a consumes edge in context-integration-registry.",
    severity: "medium",
    sliceId: "FSI-S7",
    target: "module-surface consumes spine delegate",
  },
};

function readNodePath(node: IntegrationGraphNodeWire): string {
  const routePattern = node.metadata?.["routePattern"];
  if (typeof routePattern === "string" && routePattern.length > 0) {
    return routePattern;
  }

  const routePath = node.metadata?.["routePath"];
  if (typeof routePath === "string" && routePath.length > 0) {
    return routePath;
  }

  return node.label;
}

function readPromotionTarget(node: IntegrationGraphNodeWire): string | null {
  const promotionTarget = node.metadata?.["promotionTarget"];
  return typeof promotionTarget === "string" ? promotionTarget : null;
}

function moduleSegment(path: string): string | null {
  const segments = path.split("/").filter(Boolean);
  if (segments.length < 2 || segments[0] !== "modules") {
    return null;
  }
  return segments[1] ?? null;
}

function pathsMatchLabToSurface(labPath: string, surfacePath: string): boolean {
  if (labPath === surfacePath) {
    return true;
  }

  const labModule = moduleSegment(labPath);
  const surfaceModule = moduleSegment(surfacePath);
  if (labModule && surfaceModule && labModule === surfaceModule) {
    return true;
  }

  return false;
}

export function surfaceHasSpineEdge(
  surfaceId: string,
  graph: IntegrationGraphSnapshotWire
): boolean {
  return graph.edges.some(
    (edge) =>
      edge.source === surfaceId &&
      edge.type === "consumes" &&
      edge.target.startsWith("spine:")
  );
}

export function resolveSurfacePromotionStatus(
  node: IntegrationGraphNodeWire,
  graph: IntegrationGraphSnapshotWire
): SurfacePromotionStatus | null {
  if (node.type !== "module-surface" && node.type !== "lab-route") {
    return null;
  }

  const labRoutes = graph.nodes.filter(
    (entry) =>
      entry.type === "lab-route" &&
      readPromotionTarget(entry) === "erp-route" &&
      entry.id.startsWith("lab-page:")
  );
  const moduleSurfaces = graph.nodes.filter(
    (entry) => entry.type === "module-surface"
  );

  if (node.type === "lab-route") {
    if (readPromotionTarget(node) !== "erp-route") {
      return null;
    }

    const labPath = readNodePath(node);
    const hasMirror = moduleSurfaces.some((surface) =>
      pathsMatchLabToSurface(labPath, readNodePath(surface))
    );
    return hasMirror ? "matched" : "lab-only";
  }

  const surfacePath = readNodePath(node);
  const hasLabMirror = labRoutes.some((labRoute) =>
    pathsMatchLabToSurface(readNodePath(labRoute), surfacePath)
  );
  return hasLabMirror ? "matched" : "erp-only";
}

function collectLabPromoGapNodes(
  graph: IntegrationGraphSnapshotWire
): readonly string[] {
  const moduleSurfaces = graph.nodes.filter(
    (node) => node.type === "module-surface"
  );

  return graph.nodes
    .filter(
      (node) =>
        node.type === "lab-route" &&
        node.id.startsWith("lab-page:") &&
        readPromotionTarget(node) === "erp-route"
    )
    .filter((labRoute) => {
      const labPath = readNodePath(labRoute);
      return !moduleSurfaces.some((surface) =>
        pathsMatchLabToSurface(labPath, readNodePath(surface))
      );
    })
    .map((node) => node.id);
}

function collectMissingSpineGapNodes(
  graph: IntegrationGraphSnapshotWire
): readonly string[] {
  return graph.nodes
    .filter((node) => node.type === "module-surface")
    .filter((node) => !surfaceHasSpineEdge(node.id, graph))
    .map((node) => node.id);
}

export function deriveIntegrationPosture(
  graph: IntegrationGraphSnapshotWire
): IntegrationPostureWire {
  const gaps: IntegrationPostureGapWire[] = [];

  const labPromoNodeIds = collectLabPromoGapNodes(graph);
  if (labPromoNodeIds.length > 0) {
    const catalog = GAP_CATALOG["GAP-LAB-PROMO"];
    gaps.push({
      id: "GAP-LAB-PROMO",
      severity: catalog.severity,
      sliceId: catalog.sliceId,
      target: catalog.target,
      advice: catalog.advice,
      current: `${labPromoNodeIds.length} lab route(s) lack pas006 mirror`,
      nodeIds: labPromoNodeIds,
    });
  }

  const missingSpineNodeIds = collectMissingSpineGapNodes(graph);
  if (missingSpineNodeIds.length > 0) {
    const catalog = GAP_CATALOG["GAP-MISSING-SPINE"];
    gaps.push({
      id: "GAP-MISSING-SPINE",
      severity: catalog.severity,
      sliceId: catalog.sliceId,
      target: catalog.target,
      advice: catalog.advice,
      current: `${missingSpineNodeIds.length} module surface(s) without spine consumes edge`,
      nodeIds: missingSpineNodeIds,
    });
  }

  return {
    counts: {
      moduleSurfaces: graph.nodes.filter(
        (node) => node.type === "module-surface"
      ).length,
      labRoutes: graph.nodes.filter(
        (node) => node.type === "lab-route" && node.id.startsWith("lab-page:")
      ).length,
      gaps: gaps.length,
      slicesDelivered: graph.slices.filter(
        (slice) => slice.status === "delivered"
      ).length,
    },
    gaps,
  };
}
