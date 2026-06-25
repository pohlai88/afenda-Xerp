import { describe, expect, it } from "vitest";
import { docsHomeSections } from "@/lib/docs-home.constants";
import { docsDefaultLocale } from "@/lib/i18n";

describe("@afenda/docs home constants", () => {
  it("lists four primary documentation sections with locale-prefixed hrefs", () => {
    const sections = docsHomeSections(docsDefaultLocale);

    expect(sections).toHaveLength(4);
    expect(sections.map((section) => section.href)).toEqual([
      "/en/docs/getting-started",
      "/en/docs/monorepo-map",
      "/en/docs/apps",
      "/en/docs/contributing",
    ]);
  });
});
