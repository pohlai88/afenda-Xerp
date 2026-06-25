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
    subpages: [],
  },
  {
    id: "apps",
    slug: ["apps"],
    title: "Applications Book",
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

/** Apps Book landing pages scanned for component usage (apps-book-components.test.ts). */
export const appsBookLandingMdxPaths = [
  "index.mdx",
  "apps/index.mdx",
  "apps/erp/index.mdx",
  "apps/docs/index.mdx",
  "apps/storybook/index.mdx",
] as const;
