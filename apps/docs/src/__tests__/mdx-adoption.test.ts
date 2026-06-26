import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  docsInlineTocLabels,
  isDocsLongFormContentPath,
  resolveDocsInlineTocLabel,
} from "@/lib/docs-inline-toc.contract";
import { docsLongFormMdxPaths } from "@/lib/docs-nav.contract";
import { docsLocaleContentRoot } from "@/lib/docs-page-path";
import { docsDefaultLocale, docsLocales } from "@/lib/i18n";

const contentRoot = docsLocaleContentRoot(docsDefaultLocale);
const docsSlugPageSource = readFileSync(
  join(process.cwd(), "src/app/[lang]/docs/[[...slug]]/page.tsx"),
  "utf8"
);

function readMdx(relativePath: string): string {
  return readFileSync(join(contentRoot, relativePath), "utf8");
}

function usesAccordions(source: string): boolean {
  return source.includes("<Accordions") || source.includes("<Accordion ");
}

describe("@afenda/docs MDX adoption (Slice C)", () => {
  it("wires page-level InlineTOC from page.data.toc on long-form routes", () => {
    expect(docsSlugPageSource).toContain("InlineTOC");
    expect(docsSlugPageSource).toContain("isDocsLongFormContentPath");
    expect(docsSlugPageSource).toContain("resolveDocsInlineTocLabel");
    expect(docsSlugPageSource).toContain("page.data.toc");
    expect(docsSlugPageSource).toContain("defaultOpen");
  });

  it.each(docsLongFormMdxPaths)(
    "%s is registered for page-level InlineTOC",
    (relativePath) => {
      expect(isDocsLongFormContentPath(relativePath)).toBe(true);
    }
  );

  it("does not duplicate InlineTOC inside long-form MDX bodies", () => {
    for (const relativePath of docsLongFormMdxPaths) {
      const source = readMdx(relativePath);
      expect(source).not.toContain("<InlineTOC");
      expect(source).not.toContain("<DocsInlineToc");
    }
  });

  it("defines localized InlineTOC labels for every docs locale", () => {
    for (const locale of docsLocales) {
      expect(resolveDocsInlineTocLabel(locale)).toBe(docsInlineTocLabels[locale]);
      expect(docsInlineTocLabels[locale].length).toBeGreaterThan(0);
    }
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
