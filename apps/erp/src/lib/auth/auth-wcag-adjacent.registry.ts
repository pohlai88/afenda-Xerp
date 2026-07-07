/**
 * PAS-006C P06-007 — auth-adjacent surface registry for WCAG 2.2 AA pack.
 * Derived from auth-route-catalog SSOT.
 */

import { ERROR_PAGE_PUBLIC_PATH_PREFIXES } from "@/lib/presentation/error-page-surface.registry";

import type { AuthShellVariant } from "./auth-path.registry";
import { AUTH_ROUTE_CATALOG } from "./auth-route-catalog";

const CATALOG_ENTRIES_WITH_WCAG = AUTH_ROUTE_CATALOG.filter(
  (entry) => entry.wcagRequiredSlots.length > 0
);

export const AUTH_ADJACENT_SURFACE_PATHS = [
  ...CATALOG_ENTRIES_WITH_WCAG.map((entry) => entry.path),
  ...ERROR_PAGE_PUBLIC_PATH_PREFIXES.filter(
    (path) => path !== "/session-expired" && path !== "/access-denied"
  ),
] as const;

export type AuthAdjacentSurfacePath =
  (typeof AUTH_ADJACENT_SURFACE_PATHS)[number];

const UNIQUE_WCAG_BLOCK_IDS = [
  ...new Set(CATALOG_ENTRIES_WITH_WCAG.map((entry) => entry.blockId)),
] as const;

/** Presentation blocks wired to auth-adjacent ERP routes. */
export const AUTH_ADJACENT_AUTH_BLOCK_IDS =
  UNIQUE_WCAG_BLOCK_IDS satisfies readonly AuthShellVariant[];

export type AuthAdjacentAuthBlockId =
  (typeof AUTH_ADJACENT_AUTH_BLOCK_IDS)[number];

function buildWcagRequiredSlotsMap(): Readonly<
  Record<AuthAdjacentAuthBlockId, readonly string[]>
> {
  const slotsByBlockId = new Map<AuthAdjacentAuthBlockId, readonly string[]>();

  for (const entry of CATALOG_ENTRIES_WITH_WCAG) {
    if (!slotsByBlockId.has(entry.blockId)) {
      slotsByBlockId.set(entry.blockId, entry.wcagRequiredSlots);
    }
  }

  return Object.fromEntries(slotsByBlockId) as Readonly<
    Record<AuthAdjacentAuthBlockId, readonly string[]>
  >;
}

/** Slot ids that must exist for WCAG form labeling on auth blocks. */
export const AUTH_ADJACENT_WCAG_REQUIRED_SLOTS = buildWcagRequiredSlotsMap();
