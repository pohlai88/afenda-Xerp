import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { appsBookLandingMdxPaths } from "@/lib/docs-nav.contract";

const contentRoot = join(process.cwd(), "content/docs");

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

describe("@afenda/docs apps book components", () => {
  it.each([
    "index.mdx",
    "apps/index.mdx",
  ] as const)("%s uses Cards or DocsGuideCardGrid for primary navigation", (relativePath) => {
    const source = readMdx(relativePath);
    expect(usesCardNavigation(source)).toBe(true);
  });

  it("apps/erp/index.mdx includes a status honesty warn callout", () => {
    const source = readMdx("apps/erp/index.mdx");
    expect(source).toMatch(/type="warn"|title="Status honesty"/);
  });

  it("apps/docs/index.mdx includes an authority callout", () => {
    const source = readMdx("apps/docs/index.mdx");
    expect(usesCallout(source)).toBe(true);
  });

  it("apps/storybook/index.mdx includes warn callout and runner debt language", () => {
    const source = readMdx("apps/storybook/index.mdx");
    expect(source).toMatch(/type="warn"/);
    expect(source).toMatch(/runner|Not started|storybook-test-runner/i);
  });

  it("does not use markdown table as sole navigation on home or apps index", () => {
    for (const relativePath of ["index.mdx", "apps/index.mdx"] as const) {
      const source = readMdx(relativePath);
      expect(usesCardNavigation(source)).toBe(true);
    }
  });

  it("registers all landing paths in appsBookLandingMdxPaths contract", () => {
    expect(appsBookLandingMdxPaths).toHaveLength(5);
    for (const relativePath of appsBookLandingMdxPaths) {
      expect(() => readMdx(relativePath)).not.toThrow();
    }
  });
});
