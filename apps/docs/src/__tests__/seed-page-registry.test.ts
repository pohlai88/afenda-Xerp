import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  docsHomeSlug,
  docsSeedPageSlugs,
  docsSeedSections,
} from "@/lib/docs-nav.contract";

const contentRoot = join(process.cwd(), "content/docs");

const mdxTitlePattern = /^title:\s*(.+)\s*$/m;

function readMdxTitle(relativePath: string): string {
  const raw = readFileSync(join(contentRoot, relativePath), "utf8");
  const match = raw.match(mdxTitlePattern);
  if (!match?.[1]) {
    throw new Error(`Missing title frontmatter in ${relativePath}`);
  }
  return match[1];
}

function slugToMdxPath(slug: readonly string[]): string {
  if (slug.length === 0) {
    return "index.mdx";
  }

  const indexPath = `${slug.join("/")}/index.mdx`;
  if (existsSync(join(contentRoot, indexPath))) {
    return indexPath;
  }

  if (slug.length === 1) {
    return `${slug[0]}/index.mdx`;
  }

  return `${slug.slice(0, -1).join("/")}/${slug.at(-1)}.mdx`;
}

describe("@afenda/docs seed page registry (filesystem)", () => {
  it("resolves home title from index.mdx", () => {
    expect(readMdxTitle(slugToMdxPath(docsHomeSlug))).toBe(
      "Afenda Documentation"
    );
  });

  it.each(
    docsSeedPageSlugs.map((slug) => [slug.join("/") || "home", slug])
  )("index or leaf MDX exists for slug %s", (_label, slug) => {
    const relativePath = slugToMdxPath(slug);
    const title = readMdxTitle(relativePath);

    expect(title.length).toBeGreaterThan(0);
  });

  it("maps every seed section to a contract title", () => {
    for (const section of docsSeedSections) {
      const title = readMdxTitle(slugToMdxPath(section.slug));
      expect(title).toBe(section.title);
    }
  });

  it("includes every seed section id in the nav contract", () => {
    expect(docsSeedSections.map((section) => section.id)).toEqual([
      "getting-started",
      "monorepo-map",
      "apps",
      "contributing",
    ]);
  });
});
