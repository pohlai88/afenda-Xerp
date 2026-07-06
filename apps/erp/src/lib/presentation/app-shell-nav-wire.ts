/** Stable nav group id from operator-facing label text. */
export function toNavGroupId(groupLabel: string): string {
  return groupLabel
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-+|-+$/gu, "");
}

/** Stable nav item id from route href (PAS-006D column/slot alignment pattern). */
export function toNavItemId(href: string): string {
  const normalized = href.replace(/^\//u, "").replace(/\//gu, ".");

  return normalized.length > 0 ? normalized : "root";
}
