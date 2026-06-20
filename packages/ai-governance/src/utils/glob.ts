/**
 * Normalizes repo-relative paths for deterministic glob matching.
 */
export function normalizeRepoPath(path: string): string {
  return path.replaceAll("\\", "/").replace(/^\.\//u, "");
}

/**
 * Matches a repo path against a scope glob.
 *
 * Supported syntax:
 * - `**` — at most once per pattern; splits into optional prefix and suffix anchors
 * - `*` — as a whole segment, matches zero or more path segments; within a segment,
 *   matches characters via regex
 *
 * Limitations (by design — scope manifests use simple patterns):
 * - Multiple `**` tokens are not supported; only the first split is evaluated
 * - `**` is not recursive globstar between segments; suffix matching starts at the
 *   remainder after the prefix, not at an arbitrary nested directory
 */
export function matchesGlob(path: string, pattern: string): boolean {
  const normalizedPath = normalizeRepoPath(path);
  const normalizedPattern = normalizeRepoPath(pattern);

  if (normalizedPattern.includes("**")) {
    const parts = normalizedPattern.split("**");
    const prefix = parts[0]?.replace(/\/$/u, "") ?? "";
    const suffix = parts[1]?.replace(/^\//u, "") ?? "";

    if (prefix && !pathStartsWithPrefix(normalizedPath, prefix)) {
      return false;
    }

    if (!suffix) {
      return true;
    }

    const remainder = prefix
      ? normalizedPath.slice(prefix.length).replace(/^\//u, "")
      : normalizedPath;

    return matchGlobSegment(remainder, suffix);
  }

  return matchGlobSegment(normalizedPath, normalizedPattern);
}

function pathStartsWithPrefix(path: string, prefix: string): boolean {
  return path === prefix || path.startsWith(`${prefix}/`);
}

function matchGlobSegment(path: string, pattern: string): boolean {
  const pathParts = path.split("/");
  const patternParts = pattern.split("/");

  return matchParts(pathParts, patternParts);
}

function matchParts(pathParts: string[], patternParts: string[]): boolean {
  if (patternParts.length === 0) {
    return pathParts.length === 0;
  }

  const [patternHead, ...patternTail] = patternParts;

  if (patternHead === "*") {
    for (let index = 0; index <= pathParts.length; index += 1) {
      if (matchParts(pathParts.slice(index), patternTail)) {
        return true;
      }
    }
    return false;
  }

  const [pathHead, ...pathTail] = pathParts;

  if (pathHead === undefined || patternHead === undefined) {
    return false;
  }

  if (!matchSingleSegment(pathHead, patternHead)) {
    return false;
  }

  return matchParts(pathTail, patternTail);
}

function matchSingleSegment(value: string, pattern: string): boolean {
  if (!pattern.includes("*")) {
    return value === pattern;
  }

  const regex = new RegExp(
    `^${pattern.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&").replace(/\\\*/gu, ".*")}$`,
    "u"
  );
  return regex.test(value);
}

export function pathMatchesAnyGlob(
  path: string,
  patterns: readonly string[]
): boolean {
  return patterns.some((pattern) => matchesGlob(path, pattern));
}
