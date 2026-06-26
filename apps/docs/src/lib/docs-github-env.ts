/** Server-only env bag for docs GitHub API helpers. */
export type DocsGithubEnvSource = Readonly<
  Record<string, string | undefined>
>;

const defaultGithubApiBaseUrl = "https://api.github.com";

/** Whether production GitHub last-edit lookup should run (skipped in local dev). */
export function shouldResolveDocsGithubLastModified(
  env: DocsGithubEnvSource = process.env
): boolean {
  return env["NODE_ENV"] !== "development";
}

/**
 * Optional bearer token for GitHub REST API rate limits during production builds.
 * Accepts raw `ghp_*` values or an existing `Bearer …` prefix.
 */
export function resolveDocsGithubApiToken(
  env: DocsGithubEnvSource = process.env
): string | undefined {
  const raw = env["DOCS_GITHUB_TOKEN"]?.trim();

  if (!raw) {
    return;
  }

  return raw.startsWith("Bearer ") ? raw : `Bearer ${raw}`;
}

/** GitHub REST API base URL — defaults to github.com; override for GitHub Enterprise. */
export function resolveDocsGithubApiBaseUrl(
  env: DocsGithubEnvSource = process.env
): string {
  const raw = env["DOCS_GITHUB_API_BASE_URL"]?.trim();

  return raw && raw.length > 0 ? raw : defaultGithubApiBaseUrl;
}

export { defaultGithubApiBaseUrl };
