import { GraphView } from "@/components/graph-view";
import { buildGraph } from "@/lib/build-graph";

/**
 * Server wrapper — builds the docs link graph and renders the client GraphView.
 * Used on /docs/apps hub per ARCH-DOCS-001 Editorial Charter.
 */
export function DocsSiteGraph() {
  const graph = buildGraph();
  return <GraphView graph={graph} />;
}
