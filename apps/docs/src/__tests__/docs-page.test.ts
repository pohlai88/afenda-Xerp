import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
}));

const { pageBySlug, seedSlugs } = vi.hoisted(() => {
  const slugs = [
    [],
    ["getting-started"],
    ["getting-started", "installation"],
    ["getting-started", "dev-setup"],
    ["monorepo-map"],
    ["apps"],
    ["apps", "erp"],
    ["apps", "erp", "routes-and-surfaces"],
    ["apps", "erp", "development"],
    ["apps", "docs"],
    ["apps", "storybook"],
    ["contributing"],
  ] as const;

  const registry = new Map(
    slugs.map((slug) => {
      const label = slug.join("/") || "home";
      return [
        label,
        {
          data: {
            title: label === "home" ? "Afenda Documentation" : label,
            description: "Implementation guides for the Afenda ERP monorepo.",
          },
        },
      ] as const;
    })
  );

  return { pageBySlug: registry, seedSlugs: slugs };
});

vi.mock("@/lib/source", () => ({
  source: {
    getPage: vi.fn((slug?: string[]) => {
      const key = !slug || slug.length === 0 ? "home" : slug.join("/");
      return pageBySlug.get(key);
    }),
  },
}));

import { resolveDocsPage } from "@/lib/docs-page";

describe("@afenda/docs page resolution", () => {
  it("returns the resolved page when the slug exists", () => {
    const page = resolveDocsPage([]);

    expect(page.data.title).toBe("Afenda Documentation");
  });

  it.each(
    seedSlugs
      .filter((slug) => slug.length > 0)
      .map((slug) => [slug.join("/"), slug] as const)
  )("resolves seed slug %s", (_label, slug) => {
    const page = resolveDocsPage(slug);

    expect(page.data.title.length).toBeGreaterThan(0);
  });

  it("calls notFound when the slug does not resolve", () => {
    expect(() => resolveDocsPage(["missing-page"])).toThrow("NOT_FOUND");
  });
});
