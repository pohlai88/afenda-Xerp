import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { docsLongFormMdxPaths } from "@/lib/docs-nav.contract";

const contentRoot = join(process.cwd(), "content/docs");

function readMdx(relativePath: string): string {
  return readFileSync(join(contentRoot, relativePath), "utf8");
}

function usesInlineToc(source: string): boolean {
  return source.includes("<InlineTOC") || source.includes("<DocsInlineToc");
}

function usesAccordions(source: string): boolean {
  return source.includes("<Accordions") || source.includes("<Accordion ");
}

describe("@afenda/docs MDX adoption (Slice C)", () => {
  it.each(
    docsLongFormMdxPaths
  )("%s includes InlineTOC for in-page navigation", (relativePath) => {
    expect(usesInlineToc(readMdx(relativePath))).toBe(true);
  });

  it.each(
    docsLongFormMdxPaths
  )("%s includes Accordions for collapsible sections", (relativePath) => {
    expect(usesAccordions(readMdx(relativePath))).toBe(true);
  });

  it("monorepo-map/index.mdx includes a zoomable layer diagram", () => {
    const monorepoPath = docsLongFormMdxPaths.find((path) =>
      path.includes("monorepo-map/index.mdx")
    );
    expect(monorepoPath).toBeDefined();
    const source = readMdx(monorepoPath ?? "");
    expect(source).toMatch(/!\[.*\]\(\/docs\/monorepo-layers\.svg\)/);
  });

  it("registers all long-form paths in docsLongFormMdxPaths contract", () => {
    expect(docsLongFormMdxPaths).toHaveLength(5);
    for (const relativePath of docsLongFormMdxPaths) {
      expect(() => readMdx(relativePath)).not.toThrow();
    }
  });
});
