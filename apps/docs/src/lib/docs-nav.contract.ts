import type { DocsLocale } from "@/lib/i18n";

/**
 * Fumadocs folder group for legacy Guides sidebar tab — non-English locales in Slice 1.
 * @see https://fumadocs.dev/docs/page-conventions#folder-group
 */
export const docsGuidesFolderGroup = "(guides)" as const;

export const docsBuildAfendaSection = "build-afenda" as const;

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

export const docsReaderSections = [
  "use-erp",
  "configure-tenant",
  "operate-tenant",
  "integrate",
  docsBuildAfendaSection,
] as const;

export type DocsReaderSectionId = (typeof docsReaderSections)[number];

/**
 * Engineer docs under build-afenda are English-only.
 * Reader IA (use-erp, configure-tenant, operate-tenant, integrate) is scaffolded for all locales.
 */
export function isEnglishOnlyDocsSlug(
  slug: readonly string[] | undefined
): boolean {
  if (!slug || slug.length === 0) {
    return false;
  }

  const [root] = slug;

  return root === docsBuildAfendaSection;
}

/**
 * Serializable registry of English reader IA + build-afenda engineer paths.
 * Used by content parity tests — keep aligned with content/docs/en meta.json files.
 */
export const docsSeedSections = [
  {
    id: "use-erp",
    slug: ["use-erp"],
    title: "Use ERP",
    subpages: [{ slug: ["use-erp", "sign-in"], id: "sign-in" }],
  },
  {
    id: "configure-tenant",
    slug: ["configure-tenant"],
    title: "Configure Tenant",
    subpages: [
      {
        slug: ["configure-tenant", "users-and-memberships"],
        id: "users-and-memberships",
      },
      {
        slug: ["configure-tenant", "roles-and-permissions"],
        id: "roles-and-permissions",
      },
    ],
  },
  {
    id: "operate-tenant",
    slug: ["operate-tenant"],
    title: "Operate Tenant",
    subpages: [
      {
        slug: ["operate-tenant", "environment-and-auth"],
        id: "environment-and-auth",
      },
      {
        slug: ["operate-tenant", "troubleshooting-login"],
        id: "troubleshooting-login",
      },
    ],
  },
  {
    id: "integrate",
    slug: ["integrate"],
    title: "Integrate",
    subpages: [
      { slug: ["integrate", "internal-v1"], id: "internal-v1" },
    ],
  },
  {
    id: "getting-started",
    slug: [docsBuildAfendaSection, "getting-started"],
    title: "Getting Started",
    subpages: [
      {
        slug: [docsBuildAfendaSection, "getting-started", "installation"],
        id: "installation",
      },
      {
        slug: [docsBuildAfendaSection, "getting-started", "dev-setup"],
        id: "dev-setup",
      },
    ],
  },
  {
    id: "monorepo-map",
    slug: [docsBuildAfendaSection, "monorepo-map"],
    title: "Monorepo Map",
    subpages: [
      {
        slug: [docsBuildAfendaSection, "monorepo-map", "docs-contracts"],
        id: "docs-contracts",
      },
      {
        slug: [docsBuildAfendaSection, "monorepo-map", "docs-i18n-contract"],
        id: "docs-i18n-contract",
      },
    ],
  },
  {
    id: "apps",
    slug: [docsBuildAfendaSection, "apps"],
    title: "Applications",
    subpages: [
      { slug: [docsBuildAfendaSection, "apps", "erp"], id: "erp" },
      {
        slug: [docsBuildAfendaSection, "apps", "erp", "routes-and-surfaces"],
        id: "routes-and-surfaces",
      },
      {
        slug: [docsBuildAfendaSection, "apps", "erp", "development"],
        id: "development",
      },
      { slug: [docsBuildAfendaSection, "apps", "docs"], id: "docs" },
      { slug: [docsBuildAfendaSection, "apps", "storybook"], id: "storybook" },
    ],
  },
  {
    id: "contributing",
    slug: [docsBuildAfendaSection, "contributing"],
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
  `${docsBuildAfendaSection}/apps/index.mdx`,
  `${docsBuildAfendaSection}/apps/erp/index.mdx`,
  `${docsBuildAfendaSection}/apps/docs/index.mdx`,
  `${docsBuildAfendaSection}/apps/storybook/index.mdx`,
] as const;

/** Long-form pages that receive page-level InlineTOC from `page.data.toc`. */
export const docsLongFormMdxPaths = [
  `${docsBuildAfendaSection}/monorepo-map/index.mdx`,
  `${docsBuildAfendaSection}/contributing/index.mdx`,
  `${docsBuildAfendaSection}/apps/erp/index.mdx`,
  `${docsBuildAfendaSection}/apps/docs/index.mdx`,
  `${docsBuildAfendaSection}/apps/storybook/index.mdx`,
] as const;

/** Relative MDX path under content/docs for a seed slug (filesystem layout). */
export function docsSeedSlugToContentPath(slug: readonly string[]): string {
  if (slug.length === 0) {
    return "index.mdx";
  }

  const readerRoots = new Set<string>(docsReaderSections);
  const buildAfendaRoots = new Set([
    "getting-started",
    "monorepo-map",
    "contributing",
    "apps",
  ]);

  const root = slug[0];
  if (root && readerRoots.has(root)) {
    if (slug.length === 1) {
      return `${root}/index.mdx`;
    }
    const leaf = slug.at(-1);
    if (!leaf) {
      return `${root}/index.mdx`;
    }
    if (slug.length === 2) {
      return `${root}/${leaf}.mdx`;
    }
    return `${slug.slice(0, -1).join("/")}/${leaf}.mdx`;
  }

  if (root === docsBuildAfendaSection) {
    const section = slug[1];
    if (!section) {
      return `${docsBuildAfendaSection}/index.mdx`;
    }
    if (buildAfendaRoots.has(section)) {
      if (slug.length === 2) {
        return `${docsBuildAfendaSection}/${section}/index.mdx`;
      }
      const leaf = slug.at(-1);
      if (!leaf) {
        return `${docsBuildAfendaSection}/${section}/index.mdx`;
      }
      if (slug.length === 3) {
        return `${docsBuildAfendaSection}/${section}/${leaf}.mdx`;
      }
      return `${docsBuildAfendaSection}/${slug.slice(1, -1).join("/")}/${leaf}.mdx`;
    }
  }

  const guidesPrefix = `${docsGuidesFolderGroup}/`;
  const guidesSections = new Set([
    "getting-started",
    "monorepo-map",
    "contributing",
  ]);

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
