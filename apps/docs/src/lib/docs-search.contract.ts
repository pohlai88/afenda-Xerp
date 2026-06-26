import type { SearchLink } from "fumadocs-ui/contexts/search";
import { docsHref, docsSeedSections } from "@/lib/docs-nav.contract";
import { type DocsLocale, docsDefaultLocale, docsLocales } from "@/lib/i18n";
import { resolveDocsUiLocaleCopy } from "@/lib/i18n/resolve-docs-ui-locale-copy";

const docsHrefPrefixPattern = new RegExp(
  `^/(?:${docsLocales.join("|")})/docs/`
);

/** Empty-state quick links for Fumadocs search dialog (RootProvider `search.links`). */
export function docsSearchEmptyLinks(
  locale: DocsLocale = docsDefaultLocale
): SearchLink[] {
  return resolveDocsUiLocaleCopy(locale).searchLinks.map((link) => [
    link.label,
    docsHref(locale, link.docsPath),
  ]);
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
