import { describe, expect, it } from "vitest";
import {
  docsHomeSlug,
  docsSeedPageSlugs,
  docsSeedSections,
} from "@/lib/docs-nav.contract";
import { source } from "@/lib/source";

describe("@afenda/docs source loader", () => {
  it("resolves the docs home page", () => {
    const page = source.getPage(docsHomeSlug);

    expect(page).toBeDefined();
    expect(page?.data.title).toBe("Afenda Documentation");
  });

  it.each(docsSeedPageSlugs.map((slug) => [slug.join("/") || "home", slug]))(
    "resolves seed page slug %s",
    (_label, slug) => {
      const page = source.getPage([...slug]);

      expect(page).toBeDefined();
      expect(page?.data.title.length).toBeGreaterThan(0);
    },
  );

  it("generates static params for all seed pages", () => {
    const params = source.generateParams();
    const paramKeys = new Set(
      params.map((entry) => (entry.slug ?? []).join("/")),
    );

    for (const slug of docsSeedPageSlugs) {
      expect(paramKeys.has(slug.join("/"))).toBe(true);
    }
  });

  it("includes every seed section id in the nav contract", () => {
    const ids = docsSeedSections.map((section) => section.id);

    expect(ids).toEqual([
      "getting-started",
      "monorepo-map",
      "contributing",
    ]);
  });
});
