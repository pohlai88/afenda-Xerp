"use client";

import { forceCollide, forceLink, forceManyBody } from "d3-force";
import {
  type ComponentType,
  lazy,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ForceGraphMethods, ForceGraphProps } from "react-force-graph-2d";
import type {
  IntegrationGraphNodeWire,
  IntegrationGraphSnapshotWire,
} from "@/lib/lab/contracts";

interface ForceGraphNode extends IntegrationGraphNodeWire {
  neighbors?: string[];
  x?: number;
  y?: number;
}

interface ForceGraphLink {
  source: string | ForceGraphNode;
  target: string | ForceGraphNode;
  type: string;
}

interface ArchitectureForceGraphPanelProps {
  readonly graph: IntegrationGraphSnapshotWire;
}

type ForceGraph2DProps = ForceGraphProps<ForceGraphNode, ForceGraphLink>;

type ForceGraph2DComponent = ComponentType<ForceGraph2DProps>;

const ForceGraph2D = lazy(
  async (): Promise<{ default: ForceGraph2DComponent }> => {
    const module = await import("react-force-graph-2d");
    return { default: module.default as ForceGraph2DComponent };
  }
);

function hasNodeCoords(
  node: ForceGraphNode
): node is ForceGraphNode & { x: number; y: number } {
  return typeof node.x === "number" && typeof node.y === "number";
}

function readLinkEndpointId(endpoint: ForceGraphLink["source"]): string | null {
  if (typeof endpoint === "string") {
    return endpoint;
  }
  if (typeof endpoint === "object" && endpoint !== null && "id" in endpoint) {
    return endpoint.id;
  }
  return null;
}

function readThemeToken(
  container: HTMLElement | null,
  token: string,
  fallback: string
): string {
  if (!container) {
    return fallback;
  }
  const value = getComputedStyle(container).getPropertyValue(token).trim();
  return value.length > 0 ? value : fallback;
}

function nodeColor(type: string, container: HTMLElement | null): string {
  switch (type) {
    case "api-operation":
      return readThemeToken(container, "--chart-1", "var(--chart-1)");
    case "module-surface":
      return readThemeToken(container, "--chart-2", "var(--chart-2)");
    case "spine-wiring":
      return readThemeToken(container, "--chart-3", "var(--chart-3)");
    case "lab-route":
      return readThemeToken(container, "--chart-4", "var(--chart-4)");
    case "ccp":
      return readThemeToken(container, "--destructive", "var(--destructive)");
    case "gate":
      return readThemeToken(
        container,
        "--muted-foreground",
        "var(--muted-foreground)"
      );
    case "package":
      return readThemeToken(container, "--chart-5", "var(--chart-5)");
    default:
      return readThemeToken(
        container,
        "--muted-foreground",
        "var(--muted-foreground)"
      );
  }
}

export function ArchitectureForceGraphPanel({
  graph,
}: ArchitectureForceGraphPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <div
      className="relative h-[600px] overflow-hidden rounded-xl border bg-card [&_canvas]:size-full"
      ref={containerRef}
    >
      {mount ? (
        <ClientOnly containerRef={containerRef} graph={graph} />
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
          Loading dependency graph…
        </div>
      )}
    </div>
  );
}

function ClientOnly({
  containerRef,
  graph,
}: ArchitectureForceGraphPanelProps & {
  readonly containerRef: RefObject<HTMLDivElement | null>;
}) {
  const graphRef = useRef<
    ForceGraphMethods<ForceGraphNode, ForceGraphLink> | undefined
  >(undefined);
  const hoveredRef = useRef<ForceGraphNode | null>(null);
  const [tooltip, setTooltip] = useState<{
    content: string;
    x: number;
    y: number;
  } | null>(null);

  const enrichedGraph = useMemo(() => {
    const nodes: ForceGraphNode[] = graph.nodes.map((node) => ({ ...node }));
    const links: ForceGraphLink[] = graph.edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      type: edge.type,
    }));

    for (const node of nodes) {
      node.neighbors = links.flatMap((link) => {
        const sourceId = readLinkEndpointId(link.source);
        const targetId = readLinkEndpointId(link.target);
        if (sourceId === node.id && targetId) {
          return [targetId];
        }
        if (targetId === node.id && sourceId) {
          return [sourceId];
        }
        return [];
      });
    }

    return { links, nodes };
  }, [graph]);

  const handleNodeHover = (node: ForceGraphNode | null) => {
    const graphApi = graphRef.current;
    if (!graphApi) {
      return;
    }

    hoveredRef.current = node;

    if (node && hasNodeCoords(node)) {
      const coords = graphApi.graph2ScreenCoords(node.x, node.y);
      const meta = node.metadata
        ? Object.entries(node.metadata)
            .slice(0, 3)
            .map(([key, value]) => `${key}: ${String(value)}`)
            .join(" · ")
        : node.type;
      setTooltip({
        content: `${node.label} (${node.type})${meta ? ` — ${meta}` : ""}`,
        x: coords.x + 4,
        y: coords.y + 4,
      });
    } else {
      setTooltip(null);
    }
  };

  const nodeCanvasObject: ForceGraph2DProps["nodeCanvasObject"] = (
    node,
    ctx
  ) => {
    if (!hasNodeCoords(node)) {
      return;
    }

    const container = containerRef.current;
    const radius = 6;
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = nodeColor(node.type, container);
    ctx.fill();

    const hoverNode = hoveredRef.current;
    const isActive =
      hoverNode?.id === node.id ||
      hoverNode?.neighbors?.includes(node.id) === true;

    if (isActive) {
      ctx.strokeStyle = readThemeToken(
        container,
        "--foreground",
        "var(--foreground)"
      );
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.font = "11px Sans-Serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = readThemeToken(
      container,
      "--foreground",
      "var(--foreground)"
    );
    ctx.fillText(node.label, node.x, node.y + radius + 12);
  };

  const linkColor: ForceGraph2DProps["linkColor"] = (link) => {
    const container = containerRef.current;
    const hoverNode = hoveredRef.current;
    const hoverId = hoverNode?.id ?? null;

    if (hoverId) {
      const sourceId = readLinkEndpointId(link.source);
      const targetId = readLinkEndpointId(link.target);
      if (hoverId === sourceId || hoverId === targetId) {
        return readThemeToken(container, "--primary", "var(--primary)");
      }
    }

    const muted = readThemeToken(
      container,
      "--muted-foreground",
      "var(--muted-foreground)"
    );
    return `color-mix(in oklab, ${muted} 45%, transparent)`;
  };

  return (
    <>
      <ForceGraph2D
        enableNodeDrag
        enableZoomInteraction
        graphData={enrichedGraph}
        linkColor={linkColor}
        linkDirectionalArrowLength={4}
        linkWidth={1.5}
        nodeCanvasObject={nodeCanvasObject}
        onNodeHover={handleNodeHover}
        ref={(instance) => {
          const graphApi = instance as ForceGraphMethods<
            ForceGraphNode,
            ForceGraphLink
          > | null;
          graphRef.current = graphApi ?? undefined;
          if (graphApi) {
            graphApi.d3Force("link", forceLink().distance(120));
            graphApi.d3Force("charge", forceManyBody().strength(-120));
            graphApi.d3Force("collision", forceCollide(48));
          }
        }}
      />
      {tooltip ? (
        <div
          className="pointer-events-none absolute max-w-xs rounded-lg border bg-popover p-2 text-popover-foreground text-xs shadow-md"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.content}
        </div>
      ) : null}
    </>
  );
}
