import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  type DocsSeedSectionId,
  docsGuidesFolderGroup,
  docsSeedSections,
} from "@/lib/docs-nav.contract";
import { docsLocaleContentRoot } from "@/lib/docs-page-path";
import { docsDefaultLocale } from "@/lib/i18n";

const contentRoot = docsLocaleContentRoot(docsDefaultLocale);

function readMetaJson(relativeDir: string): {
  pages: string[];
  title: string;
  root?: boolean;
} {
  const raw = readFileSync(join(contentRoot, relativeDir, "meta.json"), "utf8");
  return JSON.parse(raw) as {
    pages: string[];
    title: string;
    root?: boolean;
  };
}

function readRootMeta(): { pages: string[] } {
  const raw = readFileSync(join(contentRoot, "meta.json"), "utf8");
  return JSON.parse(raw) as { pages: string[] };
}

function guidesSectionMetaPath(sectionId: string): string {
  return `${docsGuidesFolderGroup}/${sectionId}`;
}

describe("@afenda/docs content parity", () => {
  it("lists guides folder group and apps in root meta.json", () => {
    const rootPages = readRootMeta().pages.filter(
      (entry) => entry !== "---" && entry !== "index"
    );

    expect(rootPages).toEqual([docsGuidesFolderGroup, "apps"]);
  });

  it("registers guide sections under (guides) meta.json with root tab", () => {
    const guidesMeta = readMetaJson(docsGuidesFolderGroup);
    const guideSectionIds = docsSeedSections
      .filter((section) => section.id !== "apps")
      .map((section) => section.id);

    expect(guidesMeta.root).toBe(true);
    expect(guidesMeta.title).toBe("Guides");

    for (const id of guideSectionIds) {
      expect(guidesMeta.pages).toContain(id);
    }
  });

  it.each(
    docsSeedSections.map((section) => [section.id, section] as const)
  )("meta.json title matches contract for %s", (id, section) => {
    const metaPath = id === "apps" ? "apps" : guidesSectionMetaPath(section.id);
    const meta = readMetaJson(metaPath);

    expect(meta.title).toBe(section.title);
  });

  it("registers getting-started subpages in section meta.json", () => {
    const meta = readMetaJson(guidesSectionMetaPath("getting-started"));
    const gettingStarted = docsSeedSections.find(
      (section) => section.id === "getting-started"
    );

    expect(gettingStarted?.subpages.map((page) => page.id)).toEqual([
      "installation",
      "dev-setup",
    ]);

    for (const page of gettingStarted?.subpages ?? []) {
      expect(meta.pages).toContain(page.id);
    }
  });

  it("registers apps subpages in section meta.json files", () => {
    const appsMeta = readMetaJson("apps");
    const erpMeta = readMetaJson("apps/erp");
    const appsSection = docsSeedSections.find(
      (section) => section.id === "apps"
    );

    expect(appsMeta.pages).toEqual(
      expect.arrayContaining(["erp", "docs", "storybook"])
    );
    expect(erpMeta.pages).toEqual(
      expect.arrayContaining(["routes-and-surfaces", "development"])
    );

    for (const page of appsSection?.subpages ?? []) {
      if (page.slug.length === 2) {
        expect(appsMeta.pages).toContain(page.id);
      }
      if (page.slug.length === 3 && page.slug[1] === "erp") {
        expect(erpMeta.pages).toContain(page.id);
      }
    }
  });

  it("registers monorepo-map subpages in section meta.json", () => {
    const meta = readMetaJson(guidesSectionMetaPath("monorepo-map"));
    const monorepoMap = docsSeedSections.find(
      (section) => section.id === "monorepo-map"
    );

    expect(monorepoMap?.subpages.map((page) => page.id)).toEqual([
      "docs-contracts",
      "docs-i18n-contract",
    ]);

    for (const page of monorepoMap?.subpages ?? []) {
      expect(meta.pages).toContain(page.id);
    }
  });

  it("uses only known seed section ids in the contract", () => {
    const known: DocsSeedSectionId[] = [
      "getting-started",
      "monorepo-map",
      "apps",
      "contributing",
    ];

    expect(docsSeedSections.map((section) => section.id)).toEqual(known);
  });

  it("translates zh body copy for getting-started and contributing indexes", () => {
    const zhRoot = join(process.cwd(), "content/docs/zh");
    const gettingStarted = readFileSync(
      join(zhRoot, "(guides)/getting-started/index.mdx"),
      "utf8"
    );
    const contributing = readFileSync(
      join(zhRoot, "(guides)/contributing/index.mdx"),
      "utf8"
    );

    expect(gettingStarted).toContain("title: 快速开始");
    expect(gettingStarted).toContain("环境要求");
    expect(contributing).toContain("title: 贡献指南");
    expect(contributing).toContain("编码前");
  });
});
