import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { docsSeedPageSlugs } from "@/lib/docs-nav.contract";
import {
  docsSearchEmptyLinkHrefs,
  docsSearchEmptyLinks,
  isDocsSearchLinkAlignedWithSeedSlug,
} from "@/lib/docs-search.contract";
import { docsDefaultLocale } from "@/lib/i18n";

const layoutSource = readFileSync(
  join(process.cwd(), "src/app/[lang]/layout.tsx"),
  "utf8"
);

describe("@afenda/docs search UX", () => {
  it("exports locale-prefixed empty-state quick links", () => {
    expect(docsSearchEmptyLinks(docsDefaultLocale)).toEqual([
      ["Getting Started", "/en/docs/getting-started"],
      ["Monorepo Map", "/en/docs/monorepo-map"],
      ["Applications", "/en/docs/apps"],
      ["Contributing", "/en/docs/contributing"],
    ]);
  });

  it("aligns quick-link hrefs with seed page slugs", () => {
    const seedHrefSet = new Set(
      docsSeedPageSlugs.map((slug) =>
        slug.length === 0 ? "/en/docs" : `/en/docs/${slug.join("/")}`
      )
    );

    for (const href of docsSearchEmptyLinkHrefs(docsDefaultLocale)) {
      expect(isDocsSearchLinkAlignedWithSeedSlug(href)).toBe(true);
      if (!href.endsWith("/docs/apps")) {
        expect(seedHrefSet.has(href)).toBe(true);
      }
    }

    expect(seedHrefSet.has("/en/docs/apps")).toBe(true);
  });

  it("wires RootProvider search.links from docs-search.contract", () => {
    expect(layoutSource).toContain("docsSearchEmptyLinks");
    expect(layoutSource).toMatch(
      /search=\{\{\s*links:\s*docsSearchEmptyLinks\(lang\)\s*\}\}/
    );
  });
});
