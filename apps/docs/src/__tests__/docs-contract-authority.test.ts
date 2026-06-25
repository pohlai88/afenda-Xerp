import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { docsEditorialPrimitiveNames } from "@/lib/docs-editorial-palette.contract";
import {
  docsGuidesFolderGroup,
  docsSeedSections,
} from "@/lib/docs-nav.contract";
import { docsLocaleContentRoot } from "@/lib/docs-page-path";
import { docsDefaultLocale } from "@/lib/i18n";

const contentRoot = docsLocaleContentRoot(docsDefaultLocale);

describe("@afenda/docs contract authority", () => {
  it("defines nav sections only in docs-nav.contract.ts", () => {
    const contractIds = docsSeedSections.map((section) => section.id);
    const meta = JSON.parse(
      readFileSync(join(contentRoot, "meta.json"), "utf8")
    ) as { pages: string[] };

    const rootSections = meta.pages.filter(
      (entry) => entry !== "---" && entry !== "index"
    );

    expect(rootSections).toEqual([docsGuidesFolderGroup, "apps"]);

    const guidesMeta = JSON.parse(
      readFileSync(
        join(contentRoot, docsGuidesFolderGroup, "meta.json"),
        "utf8"
      )
    ) as { pages: string[] };

    for (const id of contractIds) {
      if (id === "apps") {
        expect(rootSections).toContain("apps");
      } else {
        expect(guidesMeta.pages).toContain(id);
      }
    }
  });

  it("mirrors editorial palette primitives in TypeScript contract", () => {
    expect(docsEditorialPrimitiveNames.length).toBeGreaterThan(10);
    const css = readFileSync(
      join(process.cwd(), "src/app/docs-editorial-palette.css"),
      "utf8"
    );

    for (const name of docsEditorialPrimitiveNames) {
      expect(css).toContain(`--docs-editorial-${name}`);
    }
  });

  it("does not duplicate nav authority in seed-page-registry", () => {
    const registry = readFileSync(
      join(process.cwd(), "src/__tests__/seed-page-registry.test.ts"),
      "utf8"
    );
    expect(registry).toContain("docsSeedPageSlugs");
    expect(registry).not.toContain("const docsSeedSections =");
  });
});
