import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { docsEditorialPrimitiveNames } from "@/lib/docs-editorial-palette.contract";
import { docsSeedSections } from "@/lib/docs-nav.contract";

describe("@afenda/docs contract authority", () => {
  it("defines nav sections only in docs-nav.contract.ts", () => {
    const contractIds = docsSeedSections.map((section) => section.id);
    const meta = JSON.parse(
      readFileSync(join(process.cwd(), "content/docs/meta.json"), "utf8")
    ) as { pages: string[] };

    const rootSections = meta.pages.filter(
      (entry) => entry !== "---" && entry !== "index"
    );

    for (const id of contractIds) {
      expect(rootSections).toContain(id);
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
