import type { LinkObject, NodeObject } from "react-force-graph-2d";

export interface DocsGraphNodeData {
  description?: string;
  neighbors?: string[];
  text: string;
  url: string;
}

export type DocsGraphNode = NodeObject<DocsGraphNodeData>;
export type DocsGraphLink = LinkObject<
  DocsGraphNodeData,
  Record<string, unknown>
>;

export interface DocsGraph {
  links: DocsGraphLink[];
  nodes: DocsGraphNode[];
}
