import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("fumadocs-ui/components/image-zoom", () => ({
  ImageZoom: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("@/components/docs-site-graph", () => ({
  DocsSiteGraph: () => null,
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
    const options = baseOptions();

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
    expect(components["DocsCallout"]).toBeDefined();
    expect(components["DocsGuideCardGrid"]).toBeDefined();
    expect(components["DocsSiteGraph"]).toBeDefined();
    expect(components.img).toBeDefined();
  });
});
