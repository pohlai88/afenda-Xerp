"use client";

import { forceCollide, forceLink, forceManyBody } from "d3-force";
import { useRouter } from "fumadocs-core/framework";
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
  DocsGraph,
  DocsGraphLink,
  DocsGraphNode,
  DocsGraphNodeData,
} from "@/lib/docs-graph.types";

export type { DocsGraph as Graph } from "@/lib/docs-graph.types";

export interface GraphViewProps {
  readonly graph: DocsGraph;
  readonly onNodeNavigate?: (url: string) => void;
}

type ForceGraph2DProps = ForceGraphProps<
  DocsGraphNodeData,
  Record<string, unknown>
>;

type ForceGraph2DComponent = ComponentType<ForceGraph2DProps>;

const ForceGraph2D = lazy(
  async (): Promise<{ default: ForceGraph2DComponent }> => {
    const module = await import("react-force-graph-2d");
    return { default: module.default as ForceGraph2DComponent };
  }
);

function hasNodeCoords(
  node: DocsGraphNode
): node is DocsGraphNode & { x: number; y: number } {
  return typeof node.x === "number" && typeof node.y === "number";
}

function readLinkEndpointId(endpoint: DocsGraphLink["source"]): string | null {
  if (typeof endpoint === "string") {
    return endpoint;
  }
  if (typeof endpoint === "object" && endpoint !== null && "id" in endpoint) {
    const id = endpoint.id;
    return typeof id === "string" ? id : null;
  }
  return null;
}

function isDocsGraphNode(node: DocsGraphNode | null): node is DocsGraphNode {
  return (
    node !== null &&
    typeof node.text === "string" &&
    typeof node.url === "string"
  );
}

export function GraphView({ graph, onNodeNavigate }: GraphViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <div
      className="relative h-[600px] overflow-hidden rounded-xl border bg-fd-background [&_canvas]:size-full"
      ref={ref}
    >
      {mount ? (
        <ClientOnly
          containerRef={ref}
          graph={graph}
          {...(onNodeNavigate ? { onNodeNavigate } : {})}
        />
      ) : null}
    </div>
  );
}

function ClientOnly({
  containerRef,
  graph,
  onNodeNavigate,
}: GraphViewProps & { containerRef: RefObject<HTMLDivElement | null> }) {
  const graphRef = useRef<
    ForceGraphMethods<DocsGraphNodeData, Record<string, unknown>> | undefined
  >(undefined);
  const hoveredRef = useRef<DocsGraphNode | null>(null);
  const router = useRouter();
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: string;
  } | null>(null);

  const handleNodeHover = (node: DocsGraphNode | null) => {
    const graphApi = graphRef.current;
    if (!graphApi) {
      return;
    }
    hoveredRef.current = isDocsGraphNode(node) ? node : null;

    if (node && hasNodeCoords(node)) {
      const coords = graphApi.graph2ScreenCoords(node.x, node.y);
      setTooltip({
        x: coords.x + 4,
        y: coords.y + 4,
        content: node.description ?? "No description",
      });
    } else {
      setTooltip(null);
    }
  };

  const nodeCanvasObject: ForceGraph2DProps["nodeCanvasObject"] = (
    node,
    ctx
  ) => {
    if (!(isDocsGraphNode(node) && hasNodeCoords(node))) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }
    const style = getComputedStyle(container);
    const fontSize = 14;
    const radius = 5;

    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);

    const hoverNode = hoveredRef.current;
    const nodeId = typeof node.id === "string" ? node.id : null;
    const isActive =
      nodeId !== null &&
      (hoverNode?.id === nodeId ||
        hoverNode?.neighbors?.includes(nodeId) === true);

    ctx.fillStyle = isActive
      ? style.getPropertyValue("--color-fd-primary")
      : style.getPropertyValue("--color-fd-muted-foreground");
    ctx.fill();

    ctx.font = `${fontSize}px Sans-Serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = style.getPropertyValue("color");
    ctx.fillText(node.text, node.x, node.y + radius + fontSize);
  };

  const linkColor: ForceGraph2DProps["linkColor"] = (link) => {
    const container = containerRef.current;
    if (!container) {
      return "#999";
    }
    const style = getComputedStyle(container);
    const hoverNode = hoveredRef.current;
    const hoverId = typeof hoverNode?.id === "string" ? hoverNode.id : null;

    if (hoverId) {
      const sourceId = readLinkEndpointId(link.source);
      const targetId = readLinkEndpointId(link.target);
      if (hoverId === sourceId || hoverId === targetId) {
        return style.getPropertyValue("--color-fd-primary");
      }
    }

    return `color-mix(in oklab, ${style.getPropertyValue("--color-fd-muted-foreground")} 50%, transparent)`;
  };

  const enrichedNodes = useMemo(() => {
    const { nodes, links } = structuredClone(graph);
    for (const node of nodes) {
      const nodeId = typeof node.id === "string" ? node.id : null;
      if (!nodeId) {
        continue;
      }

      node.neighbors = links.flatMap((link) => {
        const sourceId = readLinkEndpointId(link.source);
        const targetId = readLinkEndpointId(link.target);
        if (sourceId === nodeId && targetId) {
          return [targetId];
        }
        if (targetId === nodeId && sourceId) {
          return [sourceId];
        }
        return [];
      });
    }

    return { nodes, links };
  }, [graph]);

  return (
    <>
      <ForceGraph2D
        enableNodeDrag
        enableZoomInteraction
        graphData={enrichedNodes}
        linkColor={linkColor}
        linkWidth={2}
        nodeCanvasObject={nodeCanvasObject}
        onNodeClick={(node) => {
          if (!isDocsGraphNode(node)) {
            return;
          }
          if (onNodeNavigate) {
            onNodeNavigate(node.url);
            return;
          }
          router.push(node.url);
        }}
        onNodeHover={handleNodeHover}
        ref={(instance) => {
          const graphApi = instance as ForceGraphMethods<
            DocsGraphNodeData,
            Record<string, unknown>
          > | null;
          graphRef.current = graphApi ?? undefined;
          if (graphApi) {
            graphApi.d3Force("link", forceLink().distance(200));
            graphApi.d3Force("charge", forceManyBody().strength(10));
            graphApi.d3Force("collision", forceCollide(60));
          }
        }}
      />
      {tooltip ? (
        <div
          className="absolute size-fit max-w-xs rounded-xl border bg-fd-popover p-2 text-fd-popover-foreground text-sm shadow-lg"
          style={{ top: tooltip.y, left: tooltip.x }}
        >
          {tooltip.content}
        </div>
      ) : null}
    </>
  );
}
