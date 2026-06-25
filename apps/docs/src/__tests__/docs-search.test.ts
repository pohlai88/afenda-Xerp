import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { docsSeedPageSlugs } from "@/lib/docs-nav.contract";
import {
  docsSearchEmptyLinkHrefs,
  docsSearchEmptyLinks,
  isDocsSearchLinkAlignedWithSeedSlug,
} from "@/lib/docs-search.contract";

const layoutSource = readFileSync(
  join(process.cwd(), "src/app/layout.tsx"),
  "utf8"
);

describe("@afenda/docs search UX", () => {
  it("exports empty-state quick links for key guide and apps pages", () => {
    expect(docsSearchEmptyLinks).toEqual([
      ["Getting Started", "/docs/getting-started"],
      ["Monorepo Map", "/docs/monorepo-map"],
      ["Applications", "/docs/apps"],
      ["Contributing", "/docs/contributing"],
    ]);
  });

  it("aligns quick-link hrefs with seed page slugs", () => {
    const seedHrefSet = new Set(
      docsSeedPageSlugs.map((slug) =>
        slug.length === 0 ? "/docs" : `/docs/${slug.join("/")}`
      )
    );

    for (const href of docsSearchEmptyLinkHrefs) {
      expect(isDocsSearchLinkAlignedWithSeedSlug(href)).toBe(true);
      if (href !== "/docs/apps") {
        expect(seedHrefSet.has(href)).toBe(true);
      }
    }

    expect(seedHrefSet.has("/docs/apps")).toBe(true);
  });

  it("wires RootProvider search.links from docs-search.contract", () => {
    expect(layoutSource).toContain("docsSearchEmptyLinks");
    expect(layoutSource).toMatch(
      /search=\{\{\s*links:\s*docsSearchEmptyLinks\s*\}\}/
    );
  });
});
