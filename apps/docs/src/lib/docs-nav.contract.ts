/**
 * Serializable registry of TIP-032 seed navigation targets.
 * Used by content parity tests — keep aligned with `content/docs/**/meta.json`.
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
    id: "contributing",
    slug: ["contributing"],
    title: "Contributing",
    subpages: [],
  },
] as const;

export type DocsSeedSectionId = (typeof docsSeedSections)[number]["id"];

export type DocsNavSlug = readonly string[];

/** Every seed page slug the build must resolve (section indexes + subpages). */
export const docsSeedPageSlugs: readonly DocsNavSlug[] = docsSeedSections.flatMap(
  (section) => [section.slug, ...section.subpages.map((page) => page.slug)],
);

/** Root docs home — empty slug array in Fumadocs loader. */
export const docsHomeSlug: DocsNavSlug = [];
