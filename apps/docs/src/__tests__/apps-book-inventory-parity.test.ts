import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { docsBuildAfendaSection, docsSeedSections } from "@/lib/docs-nav.contract";
import { docsLocaleContentRoot } from "@/lib/docs-page-path";
import { docsDefaultLocale } from "@/lib/i18n";

const contentRoot = docsLocaleContentRoot(docsDefaultLocale);

function readMdx(relativePath: string): string {
  return readFileSync(join(contentRoot, relativePath), "utf8");
}

describe("@afenda/docs apps book inventory parity", () => {
  it("mentions ERP, Docs, and Storybook dev ports in apps MDX", () => {
    const appsErp = readMdx(`${docsBuildAfendaSection}/apps/erp/index.mdx`);
    const appsDocs = readMdx(`${docsBuildAfendaSection}/apps/docs/index.mdx`);
    const appsStorybook = readMdx(`${docsBuildAfendaSection}/apps/storybook/index.mdx`);

    expect(appsErp).toMatch(/3000/);
    expect(appsDocs).toMatch(/3001/);
    expect(appsStorybook).toMatch(/6006/);
  });

  it("includes erp, docs, and storybook in apps nav contract", () => {
    const appsSection = docsSeedSections.find(
      (section) => section.id === "apps"
    );
    const subpageIds = appsSection?.subpages.map((page) => page.id) ?? [];

    expect(subpageIds).toEqual(
      expect.arrayContaining(["erp", "docs", "storybook"])
    );
  });

  it("links ERP page to monorepo-feature-inventory.md", () => {
    const erpIndex = readMdx(`${docsBuildAfendaSection}/apps/erp/index.mdx`);
    expect(erpIndex).toContain("monorepo-feature-inventory.md");
  });

  it("links Docs page to docs-app-architecture.md", () => {
    const docsIndex = readMdx(`${docsBuildAfendaSection}/apps/docs/index.mdx`);
    expect(docsIndex).toContain("docs-app-architecture.md");
  });

  it("states Storybook runner or FDR status debt honestly", () => {
    const storybookIndex = readMdx(`${docsBuildAfendaSection}/apps/storybook/index.mdx`);
    expect(storybookIndex).toMatch(
      /storybook-test-runner-red|Not started|runner debt|test:storybook:run/i
    );
  });
});
