import { join } from "node:path";
import { docsGithubRepository } from "@/lib/docs-github.constants";
import type { DocsPage } from "@/lib/docs-page";
import { resolveDocsSeedMdxPath } from "@/lib/docs-seed-mdx-path";
import { type DocsLocale, docsDefaultLocale } from "@/lib/i18n";

/** Resolves `content/docs/{locale}/` root for filesystem parity tests and GitHub paths. */
export function docsLocaleContentRoot(
  locale: DocsLocale = docsDefaultLocale
): string {
  return join(process.cwd(), "content/docs", locale);
}

/**
 * Resolves the MDX file path relative to `content/docs/{locale}/` for GitHub edit links.
 */
export function resolveDocsContentRelativePath(
  page: DocsPage,
  locale: DocsLocale = docsDefaultLocale
): string {
  if ("path" in page && typeof page.path === "string" && page.path.length > 0) {
    const localePrefix = `${locale}/`;
    if (page.path.startsWith(localePrefix)) {
      return page.path.slice(localePrefix.length);
    }
    return page.path;
  }

  const slugs = page.slugs;
  if (slugs.length === 0) {
    return "index.mdx";
  }

  return resolveDocsSeedMdxPath(docsLocaleContentRoot(locale), slugs);
}

export function resolveGithubContentPath(page: DocsPage): string {
  const relative = resolveDocsContentRelativePath(page);
  return `${docsGithubRepository.contentPathPrefix}/${relative}`;
}
