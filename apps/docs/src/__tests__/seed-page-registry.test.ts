import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  docsHomeSlug,
  docsSeedPageSlugs,
  docsSeedSections,
} from "@/lib/docs-nav.contract";
import { docsLocaleContentRoot } from "@/lib/docs-page-path";
import { docsDefaultLocale } from "@/lib/i18n";
import { slugToMdxPath } from "./helpers/slug-to-mdx-path";

const contentRoot = docsLocaleContentRoot(docsDefaultLocale);

const mdxTitlePattern = /^title:\s*(.+)\s*$/m;

function readMdxTitle(relativePath: string): string {
  const raw = readFileSync(join(contentRoot, relativePath), "utf8");
  const match = raw.match(mdxTitlePattern);
  if (!match?.[1]) {
    throw new Error(`Missing title frontmatter in ${relativePath}`);
  }
  return match[1];
}

describe("@afenda/docs seed page registry (filesystem)", () => {
  it("resolves home title from index.mdx", () => {
    expect(readMdxTitle(slugToMdxPath(contentRoot, docsHomeSlug))).toBe(
      "Afenda Documentation"
    );
  });

  it.each(
    docsSeedPageSlugs.map((slug) => [slug.join("/") || "home", slug])
  )("index or leaf MDX exists for slug %s", (_label, slug) => {
    const relativePath = slugToMdxPath(contentRoot, slug);
    const title = readMdxTitle(relativePath);

    expect(title.length).toBeGreaterThan(0);
  });

  it("maps every seed section to a contract title", () => {
    for (const section of docsSeedSections) {
      const title = readMdxTitle(slugToMdxPath(contentRoot, section.slug));
      expect(title).toBe(section.title);
    }
  });

  it("includes every seed section id in the nav contract", () => {
    expect(docsSeedSections.map((section) => section.id)).toEqual([
      "use-erp",
      "configure-tenant",
      "operate-tenant",
      "integrate",
      "getting-started",
      "monorepo-map",
      "apps",
      "contributing",
    ]);
  });
});
