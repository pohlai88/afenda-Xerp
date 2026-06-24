import { describe, expect, it, vi } from "vitest";
import { docsSeedPageSlugs } from "@/lib/docs-nav.contract";

interface MockPage {
  data: {
    title: string;
    extractedReferences: Array<{ href: string }>;
  };
  url: string;
}

const pageRegistry = new Map<string, MockPage>([
  ...docsSeedPageSlugs.map((slug): [string, MockPage] => {
    const key = slug.join("/") || "home";
    return [
      key,
      {
        url: slug.length === 0 ? "/docs" : `/docs/${slug.join("/")}`,
        data: {
          title: key,
          extractedReferences: [],
        },
      },
    ];
  }),
  [
    "linked",
    {
      url: "/docs/linked",
      data: {
        title: "Linked",
        extractedReferences: [{ href: "/docs/getting-started" }],
      },
    },
  ],
]);

vi.mock("@/lib/source", () => ({
  source: {
    getPages: () => [...pageRegistry.values()],
    getPageByHref: (href: string) => {
      const entry = [...pageRegistry.entries()].find(
        ([, page]) => page.url === href
      );
      return entry ? { page: entry[1] } : undefined;
    },
  },
}));

import { buildGraph } from "@/lib/build-graph";

describe("@afenda/docs buildGraph", () => {
  it("creates a node for every registered page", () => {
    const graph = buildGraph();

    expect(graph.nodes).toHaveLength(pageRegistry.size);
  });

  it("creates links from extractedReferences", () => {
    const graph = buildGraph();

    expect(graph.links).toEqual([
      { source: "/docs/linked", target: "/docs/getting-started" },
    ]);
  });
});
