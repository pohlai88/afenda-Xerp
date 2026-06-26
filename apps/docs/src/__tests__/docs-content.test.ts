import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  type DocsSeedSectionId,
  docsBuildAfendaSection,
  docsGuidesFolderGroup,
  docsReaderSections,
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

describe("@afenda/docs content parity", () => {
  it("lists reader sections and build-afenda in en root meta.json", () => {
    const rootPages = readRootMeta().pages.filter(
      (entry) => entry !== "---" && entry !== "index"
    );

    expect(rootPages).toEqual([...docsReaderSections]);
  });

  it("registers reader task sections in en meta.json files", () => {
    for (const sectionId of [
      "use-erp",
      "configure-tenant",
      "operate-tenant",
      "integrate",
    ] as const) {
      const contract = docsSeedSections.find((section) => section.id === sectionId);
      expect(contract).toBeDefined();

      const meta = readMetaJson(sectionId);
      expect(meta.title).toBe(contract?.title);

      for (const page of contract?.subpages ?? []) {
        expect(meta.pages).toContain(page.id);
      }
    }
  });

  it("registers build-afenda engineer sections", () => {
    const meta = readMetaJson(docsBuildAfendaSection);
    expect(meta.title).toBe("Build Afenda");
    expect(meta.pages).toEqual(
      expect.arrayContaining([
        "getting-started",
        "monorepo-map",
        "contributing",
        "apps",
      ])
    );
  });

  it.each(
    docsSeedSections
      .filter((section) =>
        [
          "getting-started",
          "monorepo-map",
          "apps",
          "contributing",
        ].includes(section.id)
      )
      .map((section) => [section.id, section] as const)
  )("meta.json title matches contract for build-afenda %s", (id, section) => {
    const metaPath =
      id === "apps"
        ? `${docsBuildAfendaSection}/apps`
        : `${docsBuildAfendaSection}/${section.id}`;
    const meta = readMetaJson(metaPath);

    expect(meta.title).toBe(section.title);
  });

  it("registers getting-started subpages under build-afenda", () => {
    const meta = readMetaJson(`${docsBuildAfendaSection}/getting-started`);
    const gettingStarted = docsSeedSections.find(
      (section) => section.id === "getting-started"
    );

    for (const page of gettingStarted?.subpages ?? []) {
      expect(meta.pages).toContain(page.id);
    }
  });

  it("registers apps subpages under build-afenda", () => {
    const appsMeta = readMetaJson(`${docsBuildAfendaSection}/apps`);
    const erpMeta = readMetaJson(`${docsBuildAfendaSection}/apps/erp`);

    expect(appsMeta.pages).toEqual(
      expect.arrayContaining(["erp", "docs", "storybook"])
    );
    expect(erpMeta.pages).toEqual(
      expect.arrayContaining(["routes-and-surfaces", "development"])
    );
  });

  it("uses only known seed section ids in the contract", () => {
    const known: DocsSeedSectionId[] = [
      "use-erp",
      "configure-tenant",
      "operate-tenant",
      "integrate",
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
      join(zhRoot, `${docsGuidesFolderGroup}/getting-started/index.mdx`),
      "utf8"
    );
    const contributing = readFileSync(
      join(zhRoot, `${docsGuidesFolderGroup}/contributing/index.mdx`),
      "utf8"
    );

    expect(gettingStarted).toContain("title: 快速开始");
    expect(gettingStarted).toContain("环境要求");
    expect(contributing).toContain("title: 贡献指南");
    expect(contributing).toContain("编码前");
  });
});
