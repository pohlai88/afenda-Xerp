/**
 * Afenda docs MDX writing conventions — detect duplicate page titles in body.
 */

const FRONTMATTER_PATTERN = /^---\n([\s\S]*?)\n---/;

function parseFrontmatterTitle(frontmatter: string): string | undefined {
  const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
  if (!titleMatch) {
    return undefined;
  }

  const raw = titleMatch[1].trim();
  if (raw.startsWith('"') && raw.endsWith('"')) {
    return raw.slice(1, -1).trim();
  }
  if (raw.startsWith("'") && raw.endsWith("'")) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

function normalizeTitle(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function isGeneratedDocsMdx(source: string): boolean {
  return source.includes("DO NOT EDIT");
}

export function extractMdxFrontmatterTitle(source: string): string | undefined {
  const match = source.match(FRONTMATTER_PATTERN);
  if (!match) {
    return undefined;
  }
  return parseFrontmatterTitle(match[1]);
}

export function mdxBodyDuplicatesFrontmatterTitle(source: string): boolean {
  if (isGeneratedDocsMdx(source)) {
    return false;
  }

  const title = extractMdxFrontmatterTitle(source);
  if (!title) {
    return false;
  }

  const body = source.replace(FRONTMATTER_PATTERN, "").trimStart();
  const firstHeading = body.match(/^#\s+(.+)$/m);
  if (!firstHeading) {
    return false;
  }

  return normalizeTitle(firstHeading[1]) === normalizeTitle(title);
}
