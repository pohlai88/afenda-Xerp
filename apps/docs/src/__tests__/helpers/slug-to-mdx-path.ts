import { existsSync } from "node:fs";
import { join } from "node:path";
import { docsSeedSlugToMdxCandidates } from "@/lib/docs-seed-mdx-path";

export function slugToMdxPath(
  contentRoot: string,
  slug: readonly string[]
): string {
  for (const relativePath of docsSeedSlugToMdxCandidates(slug)) {
    if (existsSync(join(contentRoot, relativePath))) {
      return relativePath;
    }
  }

  const fallback = docsSeedSlugToMdxCandidates(slug).at(-1);
  return fallback ?? "index.mdx";
}
