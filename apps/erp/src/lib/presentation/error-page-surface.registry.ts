/**
 * PAS-006 — canonical ERP error page surfaces (non-module public misc).
 * SSOT for semantic paths ↔ presentation variants. Numeric aliases live in next.config redirects.
 */

import {
  ERROR_PAGE_SHELL_BLOCK_ID,
  ERROR_PAGE_VARIANTS,
  type ErrorPageCopyWire,
  type ErrorPageVariant,
} from "@afenda/shadcn-studio";

export {
  ERROR_PAGE_SHELL_BLOCK_ID,
  ERROR_PAGE_VARIANTS,
  type ErrorPageCopyWire,
  type ErrorPageVariant,
};

export type ErrorPageSurfaceEntry = {
  readonly path: string;
  readonly variant: ErrorPageVariant;
  readonly blockId: typeof ERROR_PAGE_SHELL_BLOCK_ID;
};

/** Routable semantic pages with rich ErrorPageShell UI. */
export const ERROR_PAGE_CANONICAL_SURFACES = [
  {
    path: "/access-denied",
    variant: "403",
    blockId: ERROR_PAGE_SHELL_BLOCK_ID,
  },
  {
    path: "/session-expired",
    variant: "error-session-expired",
    blockId: ERROR_PAGE_SHELL_BLOCK_ID,
  },
  {
    path: "/maintenance",
    variant: "maintenance",
    blockId: ERROR_PAGE_SHELL_BLOCK_ID,
  },
] as const satisfies readonly ErrorPageSurfaceEntry[];

export type ErrorPageCanonicalPath =
  (typeof ERROR_PAGE_CANONICAL_SURFACES)[number]["path"];

/** Legacy AdminCN-style numeric paths — configured as permanent redirects only. */
export const ERROR_PAGE_REDIRECT_ALIASES = [
  { destination: "/session-expired", source: "/401" },
  { destination: "/access-denied", source: "/403" },
  { destination: "/", source: "/500" },
] as const;

export type ErrorPageRedirectAlias =
  (typeof ERROR_PAGE_REDIRECT_ALIASES)[number];

/** Framework-native 404 — not a page route; uses app/not-found.tsx. */
export const ERROR_PAGE_NOT_FOUND_VARIANT =
  "404" as const satisfies ErrorPageVariant;

export const ERROR_PAGE_PUBLIC_PATH_PREFIXES = [
  ...ERROR_PAGE_CANONICAL_SURFACES.map((surface) => surface.path),
] as const satisfies readonly ErrorPageCanonicalPath[];

export function isErrorPageCanonicalPath(
  pathname: string
): pathname is ErrorPageCanonicalPath {
  return ERROR_PAGE_PUBLIC_PATH_PREFIXES.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function getErrorPageSurfaceByPath(
  pathname: string
): ErrorPageSurfaceEntry | undefined {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  return ERROR_PAGE_CANONICAL_SURFACES.find(
    (surface) => surface.path === normalized
  );
}
