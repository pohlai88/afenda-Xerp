import type { SearchLink } from "fumadocs-ui/contexts/search";
import { docsHref, docsSeedSections } from "@/lib/docs-nav.contract";
import { type DocsLocale, docsDefaultLocale } from "@/lib/i18n";

const docsHrefPrefixPattern = /^\/(?:en|zh)\/docs\//;

/** Empty-state quick links for Fumadocs search dialog (RootProvider `search.links`). */
export function docsSearchEmptyLinks(
  locale: DocsLocale = docsDefaultLocale
): SearchLink[] {
  return [
    ["Getting Started", docsHref(locale, "/docs/getting-started")],
    ["Monorepo Map", docsHref(locale, "/docs/monorepo-map")],
    ["Applications", docsHref(locale, "/docs/apps")],
    ["Contributing", docsHref(locale, "/docs/contributing")],
  ];
}

/** Hrefs aligned with seed section slugs in docs-nav.contract.ts. */
export function docsSearchEmptyLinkHrefs(
  locale: DocsLocale = docsDefaultLocale
): string[] {
  return docsSearchEmptyLinks(locale).map((link) => link[1]);
}

const guideSectionIds = new Set(
  docsSeedSections
    .filter((section) => section.id !== "apps")
    .map((section) => section.id)
);

/** Every quick link (except Applications) maps to a guides seed section slug path. */
export function isDocsSearchLinkAlignedWithSeedSlug(href: string): boolean {
  if (href.endsWith("/docs/apps")) {
    return true;
  }

  const slugPath = href.replace(docsHrefPrefixPattern, "");
  const sectionId = slugPath.split("/")[0];
  return guideSectionIds.has(
    sectionId as "getting-started" | "monorepo-map" | "contributing"
  );
}
