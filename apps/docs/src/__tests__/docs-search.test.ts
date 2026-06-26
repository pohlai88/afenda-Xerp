import { existsSync, readFileSync } from "node:fs";
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
const searchServerSource = readFileSync(
  join(process.cwd(), "src/lib/docs-search.server.ts"),
  "utf8"
);
const searchRouteSource = readFileSync(
  join(process.cwd(), "src/app/api/search/route.ts"),
  "utf8"
);

describe("@afenda/docs search UX", () => {
  it("exports locale-prefixed empty-state quick links", () => {
    expect(docsSearchEmptyLinks(docsDefaultLocale)).toEqual([
      ["Getting Started", "/en/docs/build-afenda/getting-started"],
      ["Monorepo Map", "/en/docs/build-afenda/monorepo-map"],
      ["Applications", "/en/docs/build-afenda/apps"],
      ["Contributing", "/en/docs/build-afenda/contributing"],
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
      if (!href.endsWith("/docs/build-afenda/apps")) {
        expect(seedHrefSet.has(href)).toBe(true);
      }
    }

    expect(seedHrefSet.has("/en/docs/build-afenda/apps")).toBe(true);
  });

  it("wires RootProvider search.links from docs-search.contract", () => {
    expect(layoutSource).toContain("docsSearchEmptyLinks");
    expect(layoutSource).toMatch(
      /search=\{\{\s*links:\s*docsSearchEmptyLinks\(lang\)\s*\}\}/
    );
  });

  it("wires Orama search from source via docs-search.server", () => {
    expect(existsSync(join(process.cwd(), "src/lib/docs-search.server.ts"))).toBe(
      true
    );
    expect(searchServerSource).toContain("createFromSource");
    expect(searchServerSource).toContain('from "@/lib/source"');
    expect(searchServerSource).toContain("export const { GET }");
  });

  it("exposes GET at /api/search through route re-export", () => {
    expect(existsSync(join(process.cwd(), "src/app/api/search/route.ts"))).toBe(
      true
    );
    expect(searchRouteSource).toContain('from "@/lib/docs-search.server"');
    expect(searchRouteSource).toContain("export { GET }");
  });
});
