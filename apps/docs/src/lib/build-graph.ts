import type { Graph } from "@/components/graph-view";
import { source } from "@/lib/source";

interface ExtractedReference {
  readonly href: string;
}

interface PageDataWithReferences {
  readonly title: string;
  readonly description?: string;
  readonly extractedReferences?: readonly ExtractedReference[];
}

export function buildGraph(): Graph {
  const pages = source.getPages();
  const graph: Graph = { links: [], nodes: [] };

  for (const page of pages) {
    const data = page.data as PageDataWithReferences;

    graph.nodes.push({
      id: page.url,
      url: page.url,
      text: data.title,
      ...(data.description ? { description: data.description } : {}),
    });

    for (const ref of data.extractedReferences ?? []) {
      const refPage = source.getPageByHref(ref.href);
      if (!refPage) continue;

      graph.links.push({
        source: page.url,
        target: refPage.page.url,
      });
    }
  }

  return graph;
}
