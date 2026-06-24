import { GraphView, type GraphViewProps } from "@/components/graph-view";
import { buildGraph } from "@/lib/build-graph";

export function SiteGraphView(props: Omit<GraphViewProps, "graph">) {
  return <GraphView graph={buildGraph()} {...props} />;
}
