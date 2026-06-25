import type { DocsLocale } from "@/lib/i18n";

/**
 * Fumadocs folder group for Guides sidebar tab — parentheses omit slug prefix.
 * @see https://fumadocs.dev/docs/page-conventions#folder-group
 */
export const docsGuidesFolderGroup = "(guides)" as const;

/** Locale-prefixed href for docs routes (e.g. `/en/docs/getting-started`). */
export function docsHref(locale: DocsLocale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (normalized.startsWith(`/${locale}/`)) {
    return normalized;
  }

  if (normalized === "/docs" || normalized.startsWith("/docs/")) {
    return `/${locale}${normalized}`;
  }

  return `/${locale}/docs${normalized === "/" ? "" : normalized}`;
}

/**
 * Serializable registry of TIP-032 seed navigation targets.
 * Used by content parity tests — keep aligned with content/docs meta.json files.
 */
export const docsSeedSections = [
  {
    id: "getting-started",
    slug: ["getting-started"],
    title: "Getting Started",
    subpages: [
      { slug: ["getting-started", "installation"], id: "installation" },
      { slug: ["getting-started", "dev-setup"], id: "dev-setup" },
    ],
  },
  {
    id: "monorepo-map",
    slug: ["monorepo-map"],
    title: "Monorepo Map",
    subpages: [
      { slug: ["monorepo-map", "docs-contracts"], id: "docs-contracts" },
    ],
  },
  {
    id: "apps",
    slug: ["apps"],
    title: "Applications",
    subpages: [
      { slug: ["apps", "erp"], id: "erp" },
      {
        slug: ["apps", "erp", "routes-and-surfaces"],
        id: "routes-and-surfaces",
      },
      { slug: ["apps", "erp", "development"], id: "development" },
      { slug: ["apps", "docs"], id: "docs" },
      { slug: ["apps", "storybook"], id: "storybook" },
    ],
  },
  {
    id: "contributing",
    slug: ["contributing"],
    title: "Contributing",
    subpages: [],
  },
] as const;

export type DocsSeedSectionId = (typeof docsSeedSections)[number]["id"];

export type DocsNavSlug = readonly string[];

/** Every seed page slug the build must resolve (section indexes + subpages). */
export const docsSeedPageSlugs: readonly DocsNavSlug[] =
  docsSeedSections.flatMap((section) => [
    section.slug,
    ...section.subpages.map((page) => page.slug),
  ]);

/** Root docs home — empty slug array in Fumadocs loader. */
export const docsHomeSlug: DocsNavSlug = [];

/** Applications landing pages scanned for component usage (apps-nav-components.test.ts). */
export const appsBookLandingMdxPaths = [
  "index.mdx",
  "apps/index.mdx",
  "apps/erp/index.mdx",
  "apps/docs/index.mdx",
  "apps/storybook/index.mdx",
] as const;

/** Long-form pages that adopt InlineTOC + Accordion (mdx-adoption.test.ts). */
export const docsLongFormMdxPaths = [
  `${docsGuidesFolderGroup}/monorepo-map/index.mdx`,
  `${docsGuidesFolderGroup}/contributing/index.mdx`,
  "apps/erp/index.mdx",
  "apps/docs/index.mdx",
  "apps/storybook/index.mdx",
] as const;

/** Relative MDX path under content/docs for a seed slug (filesystem layout). */
export function docsSeedSlugToContentPath(slug: readonly string[]): string {
  if (slug.length === 0) {
    return "index.mdx";
  }

  const guidesPrefix = `${docsGuidesFolderGroup}/`;
  const guidesSections = new Set([
    "getting-started",
    "monorepo-map",
    "contributing",
  ]);

  const root = slug[0];
  if (root && guidesSections.has(root)) {
    if (slug.length === 1) {
      return `${guidesPrefix}${root}/index.mdx`;
    }
    const leaf = slug.at(-1);
    if (!leaf) {
      return `${guidesPrefix}${root}/index.mdx`;
    }
    if (slug.length === 2) {
      return `${guidesPrefix}${root}/${leaf}.mdx`;
    }
    return `${guidesPrefix}${slug.slice(0, -1).join("/")}/${leaf}.mdx`;
  }

  if (slug.length === 1) {
    return `${root ?? slug[0]}/index.mdx`;
  }

  const leaf = slug.at(-1);
  if (!leaf) {
    return `${slug.join("/")}/index.mdx`;
  }

  if (slug.length === 2) {
    return `${slug[0]}/${leaf}/index.mdx`;
  }

  return `${slug.slice(0, -1).join("/")}/${leaf}.mdx`;
}
