import { existsSync } from "node:fs";
import { join } from "node:path";
import { docsGuidesFolderGroup } from "@/lib/docs-nav.contract";

const guidesSections = new Set([
  "getting-started",
  "monorepo-map",
  "contributing",
]);

function contentPrefixForSlug(slug: readonly string[]): string {
  const root = slug[0];
  if (root && guidesSections.has(root)) {
    return `${docsGuidesFolderGroup}/${slug.join("/")}`;
  }
  return slug.join("/");
}

/** Candidate MDX paths for a slug — first existing match wins in slugToMdxPath. */
export function docsSeedSlugToMdxCandidates(slug: readonly string[]): string[] {
  if (slug.length === 0) {
    return ["index.mdx"];
  }

  const prefix = contentPrefixForSlug(slug);
  const candidates: string[] = [`${prefix}/index.mdx`];

  if (slug.length > 1) {
    const root = slug[0];
    const parentPrefix =
      root && guidesSections.has(root)
        ? `${docsGuidesFolderGroup}/${slug.slice(0, -1).join("/")}`
        : slug.slice(0, -1).join("/");
    const leaf = slug.at(-1);
    if (leaf) {
      candidates.push(`${parentPrefix}/${leaf}.mdx`);
    }
  }

  return candidates;
}

export function resolveDocsSeedMdxPath(
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
