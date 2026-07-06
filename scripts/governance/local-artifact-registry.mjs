/**
 * SSOT for local agent/IDE artifact paths — must not be tracked in git.
 * Consumed by check-local-artifact-leakage.mts and guard-shell-policy.mjs.
 */

export const LOCAL_ARTIFACT_SURFACE_RULE =
  "local-artifact-guard-blocks-tracked-agent-debug-dumps";

/** Exact repo-relative paths that must never appear in `git ls-files`. */
export const LOCAL_ARTIFACT_FORBIDDEN_TRACKED_PATHS = [
  ".phase-0r-staged-safety.patch",
  ".phase-0r-worktree-safety.patch",
  ".cursor-biome-report.json",
  "skills-lock.json",
  ".cursor/brand-hex-map.json",
  ".cursor/token-hex-map.json",
  ".cursor/dsb-state-ds-build-afenda-shadcn-2026-001.json",
  ".cursor/audit/.bundle-preflight-session.json",
  ".cursor/audit/vibe-coding-violations.jsonl",
  ".cursor/audit/knip-shadcn-studio-baseline.txt",
  ".cursor/audit/knip-shadcn-studio-latest.txt",
  ".cursor/audit/storybook-orphans-dryrun.txt",
];

/** Tracked paths matching these prefixes are forbidden (normalized to forward slashes). */
export const LOCAL_ARTIFACT_FORBIDDEN_TRACKED_PREFIXES = [
  ".cursor/audit/knip-",
  ".cursor/audit/storybook-orphans-",
  ".cursor/dsb-state-",
];

/**
 * Substrings that block shell redirects (Out-File, >, tee, Set-Content) when present in command.
 * Keep in sync with forbidden paths above.
 */
export const LOCAL_ARTIFACT_REDIRECT_PREFIXES = [
  ".phase-0r-",
  ".cursor-biome-report.json",
  "skills-lock.json",
  ".cursor/brand-hex-map.json",
  ".cursor/token-hex-map.json",
  ".cursor/dsb-state-",
  ".cursor/audit/.bundle-preflight-session.json",
  ".cursor/audit/vibe-coding-violations.jsonl",
  ".cursor/audit/knip-",
  ".cursor/audit/storybook-orphans-",
];

/** Canonical .gitignore lines (documented; checker uses explicit lists above). */
export const LOCAL_ARTIFACT_GITIGNORE_LINES = [
  ".cursor/audit/knip-*.txt",
  ".cursor/audit/storybook-orphans-*.txt",
  ".cursor/audit/vibe-coding-violations.jsonl",
];

/**
 * @param {string} relativePath
 * @returns {boolean}
 */
export function isForbiddenTrackedArtifactPath(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/");

  if (LOCAL_ARTIFACT_FORBIDDEN_TRACKED_PATHS.includes(normalized)) {
    return true;
  }

  return LOCAL_ARTIFACT_FORBIDDEN_TRACKED_PREFIXES.some((prefix) =>
    normalized.startsWith(prefix)
  );
}

/**
 * @param {string} command
 * @returns {string | null}
 */
export function matchForbiddenArtifactRedirect(command) {
  if (!command) {
    return null;
  }

  const normalized = command.replace(/\\/g, "/");

  for (const prefix of LOCAL_ARTIFACT_REDIRECT_PREFIXES) {
    if (normalized.includes(prefix)) {
      return prefix;
    }
  }

  return null;
}
