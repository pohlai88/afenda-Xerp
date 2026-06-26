import { getGithubLastEdit } from "fumadocs-core/content/github";
import {
  type DocsGithubEnvSource,
  resolveDocsGithubApiBaseUrl,
  resolveDocsGithubApiToken,
  shouldResolveDocsGithubLastModified,
} from "@/lib/docs-github-env";
import { docsGithubRepository } from "@/lib/docs-github.constants";
import type { DocsLocale } from "@/lib/i18n";

/**
 * Resolves GitHub last-commit time for a locale-aware MDX path.
 * Skipped in development; optional `DOCS_GITHUB_TOKEN` raises REST rate limits.
 */
export async function resolveDocsGithubLastModified(
  contentRelativePath: string,
  lang: DocsLocale,
  env: DocsGithubEnvSource = process.env
): Promise<Date | undefined> {
  if (!shouldResolveDocsGithubLastModified(env)) {
    return;
  }

  const token = resolveDocsGithubApiToken(env);
  const baseUrl = resolveDocsGithubApiBaseUrl(env);
  const path = `${docsGithubRepository.contentPathPrefix}/${lang}/${contentRelativePath}`;

  try {
    const timestamp = await getGithubLastEdit({
      owner: docsGithubRepository.owner,
      repo: docsGithubRepository.repo,
      path,
      sha: docsGithubRepository.defaultBranch,
      ...(token ? { token } : {}),
      ...(baseUrl !== "https://api.github.com" ? { baseUrl } : {}),
    });

    return timestamp ?? undefined;
  } catch {
    return;
  }
}
