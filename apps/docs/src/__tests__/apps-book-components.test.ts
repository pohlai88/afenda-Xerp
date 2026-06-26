import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { appsBookLandingMdxPaths } from "@/lib/docs-nav.contract";
import { docsLocaleContentRoot } from "@/lib/docs-page-path";
import { docsDefaultLocale } from "@/lib/i18n";

const contentRoot = docsLocaleContentRoot(docsDefaultLocale);

function readMdx(relativePath: string): string {
  return readFileSync(join(contentRoot, relativePath), "utf8");
}

function usesCardNavigation(source: string): boolean {
  return (
    source.includes("<Cards") ||
    source.includes("DocsGuideCardGrid") ||
    source.includes("<Card ")
  );
}

function usesCallout(source: string): boolean {
  return source.includes("<Callout") || source.includes("DocsCallout");
}

/** Nav sections must not use markdown tables (charter: Cards/DocsGuideCardGrid only). */
function usesNavMarkdownTable(source: string): boolean {
  const navSectionPattern =
    /## (Dev servers|When to read which chapter)[\s\S]*?\n\|[^\n]+\|\n\|[-:\s|]+\|/;
  return navSectionPattern.test(source);
}

describe("@afenda/docs apps book components", () => {
  it.each(["index.mdx", ...appsBookLandingMdxPaths.filter((path) =>
    path.endsWith("apps/index.mdx")
  )] as const)(
    "%s uses Cards or DocsGuideCardGrid for primary navigation",
    (relativePath) => {
      const source = readMdx(relativePath);
      expect(usesCardNavigation(source)).toBe(true);
    }
  );

  it.each(["index.mdx", ...appsBookLandingMdxPaths.filter((path) =>
    path.endsWith("apps/index.mdx")
  )] as const)(
    "%s does not use markdown tables for navigation sections",
    (relativePath) => {
      const source = readMdx(relativePath);
      expect(usesNavMarkdownTable(source)).toBe(false);
    }
  );

  it("build-afenda apps index renders DocsSiteGraph for cross-link discovery", () => {
    const source = readMdx("build-afenda/apps/index.mdx");
    expect(source).toContain("<DocsSiteGraph");
  });

  it("build-afenda apps erp index includes a status honesty warn callout", () => {
    const source = readMdx("build-afenda/apps/erp/index.mdx");
    expect(source).toMatch(/type="warn"|title="Status honesty"/);
  });

  it("build-afenda apps docs index includes an authority callout", () => {
    const source = readMdx("build-afenda/apps/docs/index.mdx");
    expect(usesCallout(source)).toBe(true);
  });

  it("build-afenda apps storybook index includes warn callout and runner debt language", () => {
    const source = readMdx("build-afenda/apps/storybook/index.mdx");
    expect(source).toMatch(/type="warn"/);
    expect(source).toMatch(/runner|Not started|storybook-test-runner/i);
  });

  it("registers all landing paths in appsBookLandingMdxPaths contract", () => {
    expect(appsBookLandingMdxPaths).toHaveLength(5);
    for (const relativePath of appsBookLandingMdxPaths) {
      expect(() => readMdx(relativePath)).not.toThrow();
    }
  });
});
