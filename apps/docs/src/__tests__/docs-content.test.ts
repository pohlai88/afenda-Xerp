import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  docsSeedSections,
  type DocsSeedSectionId,
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
      (entry) => entry !== "---" && entry !== "index",
    );
    const contractIds = docsSeedSections.map((section) => section.id);

    for (const id of contractIds) {
      expect(rootPages).toContain(id);
    }
  });

  it.each(
    docsSeedSections.map((section) => [section.id, section] as const),
  )("meta.json title matches contract for %s", (id, section) => {
    const meta = readMetaJson(id);

    expect(meta.title).toBe(section.title);
  });

  it("registers getting-started subpages in section meta.json", () => {
    const meta = readMetaJson("getting-started");
    const subpageIds = docsSeedSections.find(
      (section): section is (typeof docsSeedSections)[0] =>
        section.id === "getting-started",
    )?.subpages.map((page) => page.id);

    expect(subpageIds).toEqual(["installation", "dev-setup"]);
    for (const pageId of subpageIds ?? []) {
      expect(meta.pages).toContain(pageId);
    }
  });

  it("uses only known seed section ids in the contract", () => {
    const known: DocsSeedSectionId[] = [
      "getting-started",
      "monorepo-map",
      "contributing",
    ];

    expect(docsSeedSections.map((section) => section.id)).toEqual(known);
  });
});
