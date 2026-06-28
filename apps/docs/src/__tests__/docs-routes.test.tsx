import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

const docsSlugPageSource = readFileSync(
  join(process.cwd(), "src/app/[lang]/docs/[[...slug]]/page.tsx"),
  "utf8"
);

vi.mock("fumadocs-ui/components/image-zoom", () => ({
  ImageZoom: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("@/components/docs-site-graph", () => ({
  DocsSiteGraph: () => null,
}));

vi.mock("@/components/api-page.client", () => ({
  OpenAPIPage: () => null,
}));

vi.mock("@/lib/source", () => ({
  source: {
    getPages: () => [],
    getPage: () => undefined,
    getPageByHref: () => undefined,
    generateParams: () => [],
  },
}));

import { getMDXComponents } from "@/components/mdx";
import { baseOptions } from "@/lib/layout.shared";

describe("@afenda/docs routes", () => {
  it("exposes Afenda branding in shared layout options", () => {
    const options = baseOptions("en");

    expect(options.nav?.title).toBe("Afenda Docs");
    expect(options.links?.length).toBeGreaterThanOrEqual(2);
    expect(
      options.links?.some(
        (link) => "text" in link && link.text === "Applications"
      )
    ).toBe(true);
  });

  it("merges default MDX components without losing Fumadocs link primitive", () => {
    const components = getMDXComponents();

    expect(components.a).toBeDefined();
    expect(components["DocsIdentityBlock"]).toBeDefined();
    expect(components["DocsGuideCardGrid"]).toBeDefined();
    expect(components["DocsSiteGraph"]).toBeDefined();
    expect(components.img).toBeDefined();
  });

  it("wires createRelativeLink on the docs slug MDX anchor slot", () => {
    expect(docsSlugPageSource).toContain('from "fumadocs-ui/mdx"');
    expect(docsSlugPageSource).toContain("createRelativeLink");
    expect(docsSlugPageSource).toMatch(
      /a:\s*createRelativeLink\(source,\s*page\)/
    );
  });

  it("preloads fumadocs-openapi when _openapi frontmatter is present", () => {
    expect(docsSlugPageSource).toContain('from "fumadocs-openapi/server"');
    expect(docsSlugPageSource).toContain("pageHasOpenApiFrontmatter");
    expect(docsSlugPageSource).toContain("openapi.preloadOpenAPIPage(page)");
    expect(docsSlugPageSource).toContain("OpenAPIPreloadProvider");
    expect(docsSlugPageSource).toContain("preloaded={openApiPreload.preloaded}");
    expect(docsSlugPageSource).toContain("shouldGenerateDocsOpenApiPage");
    expect(docsSlugPageSource).toContain("assertDocsOpenApiPageAvailable");
  });
});
