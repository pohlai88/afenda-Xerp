import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { mdxBodyDuplicatesFrontmatterTitle } from "@/lib/docs-writing-conventions";
import { docsLocaleContentRoot } from "@/lib/docs-page-path";
import { docsDefaultLocale } from "@/lib/i18n";

const contentRoot = docsLocaleContentRoot(docsDefaultLocale);

function collectMdxFiles(directory: string): string[] {
  const entries = readdirSync(directory);
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = join(directory, entry);
    const stats = statSync(absolutePath);
    if (stats.isDirectory()) {
      files.push(...collectMdxFiles(absolutePath));
      continue;
    }
    if (entry.endsWith(".mdx")) {
      files.push(absolutePath);
    }
  }

  return files;
}

describe("@afenda/docs writing conventions", () => {
  it("does not repeat frontmatter title as # heading in hand-authored en MDX", () => {
    const violations: string[] = [];

    for (const absolutePath of collectMdxFiles(contentRoot)) {
      const source = readFileSync(absolutePath, "utf8");
      if (mdxBodyDuplicatesFrontmatterTitle(source)) {
        violations.push(absolutePath.replace(`${contentRoot}\\`, "").replace(`${contentRoot}/`, ""));
      }
    }

    expect(violations).toEqual([]);
  });
});
