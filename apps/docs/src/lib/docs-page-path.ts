import { join } from "node:path";
import { docsGithubRepository } from "@/lib/docs-github.constants";
import type { DocsPage } from "@/lib/docs-page";
import { resolveDocsSeedMdxPath } from "@/lib/docs-seed-mdx-path";

const contentRoot = join(process.cwd(), "content/docs");

/**
 * Resolves the MDX file path relative to `content/docs/` for GitHub edit links.
 */
export function resolveDocsContentRelativePath(page: DocsPage): string {
  if ("path" in page && typeof page.path === "string" && page.path.length > 0) {
    return page.path;
  }

  const slugs = page.slugs;
  if (slugs.length === 0) {
    return "index.mdx";
  }

  return resolveDocsSeedMdxPath(contentRoot, slugs);
}

export function resolveGithubContentPath(page: DocsPage): string {
  const relative = resolveDocsContentRelativePath(page);
  return `${docsGithubRepository.contentPathPrefix}/${relative}`;
}
