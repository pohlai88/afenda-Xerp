/**
 * @afenda.l1-contract-envelope app-shell
 * Role: App shell nav + operating context wire guards (RSC → client)
 * Family: app-shell · flat L1 wire (renamed from erp-shell)
 * Relies on: wire-guard.helpers
 * Relied on by: components/app-shell, apps/erp AppProtectedShell, index barrel
 * Refactored: 2026-07-01 · series flat-L1
 * Gate: check:studio-l1-contracts
 */

import {
  isNonEmptyString,
  isOptionalBoolean,
  isReadonlyArrayOf,
  isWireRecord,
} from "./wire-guard.helpers.js";

export interface AppShellNavItemWire {
  readonly href: string;
  readonly isActive?: boolean;
  readonly label: string;
}

export interface AppShellNavGroupWire {
  readonly items: readonly AppShellNavItemWire[];
  readonly label: string;
}

export interface AppShellOperatingContextWire {
  readonly legalEntityLabel: string;
  readonly tenantLabel: string;
  readonly workspaceLabel: string;
}

export function isAppShellNavItemWire(
  value: unknown
): value is AppShellNavItemWire {
  if (!isWireRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value["href"]) &&
    isNonEmptyString(value["label"]) &&
    isOptionalBoolean(value["isActive"])
  );
}

export function isAppShellNavGroupWire(
  value: unknown
): value is AppShellNavGroupWire {
  if (!isWireRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value["label"]) &&
    isReadonlyArrayOf(value["items"], isAppShellNavItemWire)
  );
}

export function isAppShellOperatingContextWire(
  value: unknown
): value is AppShellOperatingContextWire {
  if (!isWireRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value["legalEntityLabel"]) &&
    isNonEmptyString(value["tenantLabel"]) &&
    isNonEmptyString(value["workspaceLabel"])
  );
}

/** @deprecated Use `AppShellNavItemWire` */
export type ErpNavItemWire = AppShellNavItemWire;

/** @deprecated Use `AppShellNavGroupWire` */
export type ErpNavGroupWire = AppShellNavGroupWire;

/** @deprecated Use `AppShellOperatingContextWire` */
export type ErpShellOperatingContextWire = AppShellOperatingContextWire;
