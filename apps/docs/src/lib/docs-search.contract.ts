import type { SearchLink } from "fumadocs-ui/contexts/search";
import {
  docsBuildAfendaSection,
  docsHref,
  docsReaderSections,
  docsSeedSections,
} from "@/lib/docs-nav.contract";
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

const buildAfendaSectionIds = new Set<string>(
  docsSeedSections
    .filter((section) =>
      ["getting-started", "monorepo-map", "contributing", "apps"].includes(
        section.id
      )
    )
    .map((section) => section.id)
);

const readerSectionIds = new Set<string>(docsReaderSections);

/** Every quick link maps to a reader or build-afenda seed section slug path. */
export function isDocsSearchLinkAlignedWithSeedSlug(href: string): boolean {
  const slugPath = href.replace(docsHrefPrefixPattern, "");
  const [root, second] = slugPath.split("/");

  if (root === docsBuildAfendaSection && second) {
    return buildAfendaSectionIds.has(second);
  }

  if (root && readerSectionIds.has(root)) {
    return true;
  }

  return false;
}
