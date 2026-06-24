export const SCROLL_AREA_DEMO_TITLE = "Foundation delivery notes";

export const SCROLL_AREA_DEMO_PARAGRAPHS: readonly string[] = [
  "TIP-006 AppShell authority defines the governed shell chrome, context surfaces, and command-center layout contracts used across every ERP module route.",
  "TIP-007 operating context resolves legal entity, company, and consolidation scope before any master-data or system-admin mutation reaches the execution spine.",
  "TIP-010 API RBAC wiring binds route contracts to permission registry entries so internal handlers never infer scope from query parameters alone.",
  "TIP-013 system-admin control plane exposes audit events, membership changes, and role assignments through tenant-scoped APIs with canonical actor resolution.",
];

export const SCROLL_AREA_RELEASE_TITLE = "Release tag history";

export const SCROLL_AREA_RELEASE_TAGS: readonly string[] = Array.from(
  { length: 24 },
  (_, index) => `v0.${9 - Math.floor(index / 8)}.${24 - index}-foundation`
);
