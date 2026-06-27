import type { DocsPage } from "@/lib/docs-page";
import { resolveDocsGithubLastModified } from "@/lib/docs-github.server";
import type { DocsGithubEnvSource } from "@/lib/docs-github-env";
import type { DocsLocale } from "@/lib/i18n";

function readPluginLastModified(page: DocsPage): Date | undefined {
  const value = (page.data as { lastModified?: unknown }).lastModified;
  return value instanceof Date ? value : undefined;
}

/**
 * Resolves page last-modified time with git-first, GitHub REST fallback.
 *
 * 1. `fumadocs-mdx/plugins/last-modified` — local git history at build/dev time
 * 2. `getGithubLastEdit` — production fallback when git metadata is unavailable
 */
export async function resolveDocsLastModified(
  page: DocsPage,
  contentRelativePath: string,
  lang: DocsLocale,
  env: DocsGithubEnvSource = process.env
): Promise<Date | undefined> {
  const fromGit = readPluginLastModified(page);
  if (fromGit) {
    return fromGit;
  }

  return resolveDocsGithubLastModified(contentRelativePath, lang, env);
}
