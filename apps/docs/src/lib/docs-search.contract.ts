import type { SearchLink } from "fumadocs-ui/contexts/search";
import { docsSeedSections } from "@/lib/docs-nav.contract";

const docsHrefPrefixPattern = /^\/docs\//;

/** Empty-state quick links for Fumadocs search dialog (RootProvider `search.links`). */
export const docsSearchEmptyLinks: SearchLink[] = [
  ["Getting Started", "/docs/getting-started"],
  ["Monorepo Map", "/docs/monorepo-map"],
  ["Applications", "/docs/apps"],
  ["Contributing", "/docs/contributing"],
];

/** Hrefs aligned with seed section slugs in docs-nav.contract.ts. */
export const docsSearchEmptyLinkHrefs = docsSearchEmptyLinks.map(
  (link) => link[1]
);

const guideSectionIds = new Set(
  docsSeedSections
    .filter((section) => section.id !== "apps")
    .map((section) => section.id)
);

/** Every quick link (except Applications) maps to a guides seed section slug path. */
export function isDocsSearchLinkAlignedWithSeedSlug(href: string): boolean {
  if (href === "/docs/apps") {
    return true;
  }

  const slugPath = href.replace(docsHrefPrefixPattern, "");
  const sectionId = slugPath.split("/")[0];
  return guideSectionIds.has(
    sectionId as "getting-started" | "monorepo-map" | "contributing"
  );
}
