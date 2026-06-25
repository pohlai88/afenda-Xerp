import type { DocsGraph } from "@/lib/docs-graph.types";
import type { DocsPage } from "@/lib/docs-page";
import { source } from "@/lib/source";

interface ExtractedReference {
  readonly href: string;
}

function isExtractedReference(value: unknown): value is ExtractedReference {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return "href" in value && typeof value.href === "string";
}

function readExtractedReferences(
  page: DocsPage
): readonly ExtractedReference[] {
  const references = page.data.extractedReferences;
  if (!Array.isArray(references)) {
    return [];
  }
  return references.filter(isExtractedReference);
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
