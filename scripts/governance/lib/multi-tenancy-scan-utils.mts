/**
 * Shared scan utilities for §447–480 enforcement — comment/string stripping
 * reduces false positives from prose, JSDoc, and prohibition documentation.
 */

/** Strip line comments, block comments, and string literals for code-only scans. */
export function stripCommentsAndStringLiterals(source: string): string {
  let result = "";
  let index = 0;

  while (index < source.length) {
    const char = source[index];
    const next = source[index + 1];

    if (char === "/" && next === "/") {
      index = source.indexOf("\n", index);
      if (index === -1) {
        break;
      }
      index += 1;
      continue;
    }

    if (char === "/" && next === "*") {
      const end = source.indexOf("*/", index + 2);
      index = end === -1 ? source.length : end + 2;
      continue;
    }

    if (char === "'" || char === '"' || char === "`") {
      index = skipQuotedLiteral(source, index, char);
      continue;
    }

    result += char;
    index += 1;
  }

  return result;
}

function skipQuotedLiteral(
  source: string,
  startIndex: number,
  quote: string
): number {
  let index = startIndex + 1;

  while (index < source.length) {
    const char = source[index];

    if (char === "\\") {
      index += 2;
      continue;
    }

    if (char === quote) {
      return index + 1;
    }

    index += 1;
  }

  return source.length;
}

export function sourceContainsCodePattern(
  source: string,
  pattern: RegExp
): boolean {
  return pattern.test(stripCommentsAndStringLiterals(source));
}

export function sourceContainsForbiddenAny(source: string): boolean {
  return sourceContainsCodePattern(source, /\b(as any|: any)\b/);
}
