/** Serializable ERP operator shell contracts (PAS-006 — boundary-safe for RSC → client). */

import {
  isNonEmptyString,
  isOptionalBoolean,
  isReadonlyArrayOf,
  isWireRecord,
} from "./wire-guard.helpers.js";

export interface ErpNavItemWire {
  readonly href: string;
  readonly isActive?: boolean;
  readonly label: string;
}

export interface ErpNavGroupWire {
  readonly items: readonly ErpNavItemWire[];
  readonly label: string;
}

export interface ErpShellOperatingContextWire {
  readonly legalEntityLabel: string;
  readonly tenantLabel: string;
  readonly workspaceLabel: string;
}

export function isErpNavItemWire(value: unknown): value is ErpNavItemWire {
  if (!isWireRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value["href"]) &&
    isNonEmptyString(value["label"]) &&
    isOptionalBoolean(value["isActive"])
  );
}

export function isErpNavGroupWire(value: unknown): value is ErpNavGroupWire {
  if (!isWireRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value["label"]) &&
    isReadonlyArrayOf(value["items"], isErpNavItemWire)
  );
}

export function isErpShellOperatingContextWire(
  value: unknown
): value is ErpShellOperatingContextWire {
  if (!isWireRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value["legalEntityLabel"]) &&
    isNonEmptyString(value["tenantLabel"]) &&
    isNonEmptyString(value["workspaceLabel"])
  );
}
