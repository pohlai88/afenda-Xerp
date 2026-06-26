/** Server-only env bag for docs GitHub App feedback. */
export type DocsGithubFeedbackEnvSource = Readonly<
  Record<string, string | undefined>
>;

export function resolveDocsGithubAppId(
  env: DocsGithubFeedbackEnvSource = process.env
): string | undefined {
  const value = env["DOCS_GITHUB_APP_ID"]?.trim();
  return value && value.length > 0 ? value : undefined;
}

export function resolveDocsGithubAppPrivateKey(
  env: DocsGithubFeedbackEnvSource = process.env
): string | undefined {
  const raw = env["DOCS_GITHUB_APP_PRIVATE_KEY"]?.trim();
  if (!raw) {
    return;
  }

  let key = raw;
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  if (key.includes("\\\\n")) {
    key = key.replace(/\\\\n/g, "\n");
  }

  if (key.includes("\\n")) {
    key = key.replace(/\\n/g, "\n");
  }

  // dotenv can leave a stray `\` before real newlines in synced .env.local values.
  if (key.includes("\\\n")) {
    key = key.replace(/\\\n/g, "\n");
  }

  return key;
}

/** Whether page/block feedback can be forwarded to GitHub Discussions. */
export function isDocsFeedbackConfigured(
  env: DocsGithubFeedbackEnvSource = process.env
): boolean {
  return (
    resolveDocsGithubAppId(env) !== undefined &&
    resolveDocsGithubAppPrivateKey(env) !== undefined
  );
}
