/**
 * Serializable GitHub coordinates for docs page actions.
 * Boundary-safe — no secrets; used server-side only.
 */
export const docsGithubRepository = {
  owner: "pohlai88",
  repo: "afenda-Xerp",
  contentPathPrefix: "apps/docs/content/docs",
  defaultBranch: "main",
} as const;

export type DocsGithubRepository = typeof docsGithubRepository;

export function buildGithubBlobUrl(contentRelativePath: string): string {
  const { owner, repo, defaultBranch, contentPathPrefix } =
    docsGithubRepository;
  return `https://github.com/${owner}/${repo}/blob/${defaultBranch}/${contentPathPrefix}/${contentRelativePath}`;
}
