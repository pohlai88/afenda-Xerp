import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
}));

vi.mock("@/lib/source", () => ({
  source: {
    getPage: vi.fn((slug?: string[]) => {
      if (!slug || slug.length === 0) {
        return {
          data: {
            title: "Afenda Documentation",
            description: "Implementation guides for the Afenda ERP monorepo.",
          },
        };
      }

      return;
    }),
  },
}));

import { resolveDocsPage } from "@/lib/docs-page";

describe("@afenda/docs page resolution", () => {
  it("returns the resolved page when the slug exists", () => {
    const page = resolveDocsPage([]);

    expect(page.data.title).toBe("Afenda Documentation");
  });

  it("calls notFound when the slug does not resolve", () => {
    expect(() => resolveDocsPage(["missing-page"])).toThrow("NOT_FOUND");
  });
});
