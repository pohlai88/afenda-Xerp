import { readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import GithubSlugger from "github-slugger";

const ROUTE_GROUP_PATTERN = /^\(.+\)$/;

export interface DocsContentPageRef {
  readonly lang: string;
  readonly slug: readonly string[];
  readonly absolutePath: string;
  readonly content: string;
}

function stripRouteGroups(segments: readonly string[]): string[] {
  return segments.filter((segment) => !ROUTE_GROUP_PATTERN.test(segment));
}

function normalizeMdxRelativePath(relativePath: string): string {
  if (relativePath === "index.mdx") {
    return "";
  }

  if (relativePath.endsWith("/index.mdx")) {
    return relativePath.slice(0, -"/index.mdx".length);
  }

  if (relativePath.endsWith(".mdx")) {
    return relativePath.slice(0, -".mdx".length);
  }

  return relativePath;
}

export function parseDocsContentPageRef(
  appRoot: string,
  absolutePath: string
): DocsContentPageRef | null {
  const relativeToContent = relative(join(appRoot, "content/docs"), absolutePath);
  const segments = relativeToContent.split(sep);
  const lang = segments[0];

  if (lang === undefined || segments.length < 2) {
    return null;
  }

  const mdxRelative = segments.slice(1).join("/");
  const normalized = normalizeMdxRelativePath(mdxRelative);
  const slug = normalized.length > 0 ? stripRouteGroups(normalized.split("/")) : [];

  return {
    lang,
    slug,
    absolutePath,
    content: readFileSync(absolutePath, "utf8"),
  };
}

export function docsPageRefToLocalizedUrl(page: DocsContentPageRef): string {
  const slugPath = page.slug.length > 0 ? `/${page.slug.join("/")}` : "";
  return `/${page.lang}/docs${slugPath}`;
}

export function docsPageRefToNeutralUrl(page: DocsContentPageRef): string {
  const slugPath = page.slug.length > 0 ? `/${page.slug.join("/")}` : "";
  return `/docs${slugPath}`;
}

export function docsPageRefToValidationUrl(page: DocsContentPageRef): string {
  const localized = docsPageRefToLocalizedUrl(page);
  if (page.absolutePath.replaceAll("\\", "/").endsWith("/index.mdx")) {
    return `${localized}/index`;
  }
  return localized;
}

export function extractHeadingHashes(content: string): string[] {
  const slugger = new GithubSlugger();
  const hashes: string[] = [];

  for (const line of content.split("\n")) {
    const explicitOnly = line.match(/\[#([a-z0-9-]+)\]\s*$/i);
    if (explicitOnly) {
      hashes.push(explicitOnly[1] ?? "");
      continue;
    }

    const heading = line.match(/^#{1,6}\s+(.+?)(?:\s+\[#([a-z0-9-]+)\])?\s*$/);
    if (!heading) {
      continue;
    }

    const title = heading[1]?.trim();
    if (!title) {
      continue;
    }

    hashes.push(heading[2] ?? slugger.slug(title));
  }

  return hashes.filter((hash) => hash.length > 0);
}

function collectMdxFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMdxFiles(absolutePath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".mdx")) {
      files.push(absolutePath);
    }
  }

  return files;
}

export function collectDocsContentPages(appRoot: string): DocsContentPageRef[] {
  const contentRoot = join(appRoot, "content/docs");
  const files = collectMdxFiles(contentRoot);

  const pages: DocsContentPageRef[] = [];

  for (const file of files) {
    const page = parseDocsContentPageRef(appRoot, file);
    if (page) {
      pages.push(page);
    }
  }

  return pages;
}
