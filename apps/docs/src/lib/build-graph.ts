import type { DocsGraph } from "@/lib/docs-graph.types";
import type { DocsPage } from "@/lib/docs-page";
import { source } from "@/lib/source";

function readExtractedReferences(page: DocsPage): readonly { href: string }[] {
  const references = page.data.extractedReferences;
  if (!Array.isArray(references)) {
    return [];
  }
  return references;
}

export function buildGraph(): DocsGraph {
  const pages = source.getPages();
  const graph: DocsGraph = { links: [], nodes: [] };

  for (const page of pages) {
    graph.nodes.push({
      id: page.url,
      url: page.url,
      text: page.data.title,
      ...(page.data.description ? { description: page.data.description } : {}),
    });

    for (const ref of readExtractedReferences(page)) {
      const refPage = source.getPageByHref(ref.href);
      if (!refPage) {
        continue;
      }

      graph.links.push({
        source: page.url,
        target: refPage.page.url,
      });
    }
  }

  return graph;
}
