import { describe, expect, it } from "vitest";
import { docsHomeSections } from "@/lib/docs-home.constants";

describe("@afenda/docs home constants", () => {
  it("lists four primary documentation sections with stable hrefs", () => {
    expect(docsHomeSections).toHaveLength(4);
    expect(docsHomeSections.map((section) => section.href)).toEqual([
      "/docs/getting-started",
      "/docs/monorepo-map",
      "/docs/apps",
      "/docs/contributing",
    ]);
  });
});
