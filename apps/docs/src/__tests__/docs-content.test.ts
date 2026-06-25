import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  type DocsSeedSectionId,
  docsSeedSections,
} from "@/lib/docs-nav.contract";

const contentRoot = join(process.cwd(), "content/docs");

function readMetaJson(relativeDir: string): { pages: string[]; title: string } {
  const raw = readFileSync(join(contentRoot, relativeDir, "meta.json"), "utf8");
  return JSON.parse(raw) as { pages: string[]; title: string };
}

function readRootMeta(): { pages: string[] } {
  const raw = readFileSync(join(contentRoot, "meta.json"), "utf8");
  return JSON.parse(raw) as { pages: string[] };
}

describe("@afenda/docs content parity", () => {
  it("lists every seed section in root meta.json", () => {
    const rootPages = readRootMeta().pages.filter(
      (entry) => entry !== "---" && entry !== "index"
    );
    const contractIds = docsSeedSections.map((section) => section.id);

    for (const id of contractIds) {
      expect(rootPages).toContain(id);
    }
  });

  it.each(
    docsSeedSections.map((section) => [section.id, section] as const)
  )("meta.json title matches contract for %s", (id, section) => {
    const meta = readMetaJson(id);

    expect(meta.title).toBe(section.title);
  });

  it("registers getting-started subpages in section meta.json", () => {
    const meta = readMetaJson("getting-started");
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

  it("uses only known seed section ids in the contract", () => {
    const known: DocsSeedSectionId[] = [
      "getting-started",
      "monorepo-map",
      "apps",
      "contributing",
    ];

    expect(docsSeedSections.map((section) => section.id)).toEqual(known);
  });
});
