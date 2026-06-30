/**
 * PAS-006D — surface template wire contract (presentation layer).
 */

import {
  isNonEmptyString,
  isStringMemberOf,
  isWireRecord,
} from "./wire-guard.helpers.js";

export const SURFACE_TEMPLATE_CLASSES = [
  "form",
  "table",
  "dashboard",
  "settings",
  "approval",
] as const;

export type SurfaceTemplateClass = (typeof SURFACE_TEMPLATE_CLASSES)[number];

export interface SurfaceTemplateBlockBindingWire {
  readonly blockId: string;
  readonly slotFills: Readonly<Record<string, string>>;
}

export interface SurfaceTemplateContractWire {
  readonly acceptanceRecordIds: readonly string[];
  readonly blockBindings: readonly SurfaceTemplateBlockBindingWire[];
  readonly metadataBindingId: string;
  readonly surfaceTemplateId: string;
  readonly templateClass: SurfaceTemplateClass;
}

export function isSurfaceTemplateClass(
  value: unknown
): value is SurfaceTemplateClass {
  return isStringMemberOf(value, SURFACE_TEMPLATE_CLASSES);
}

function isSurfaceTemplateBlockBindingWire(
  value: unknown
): value is SurfaceTemplateBlockBindingWire {
  if (!isWireRecord(value)) {
    return false;
  }

  const slotFills = value["slotFills"];

  if (!(isNonEmptyString(value["blockId"]) && isWireRecord(slotFills))) {
    return false;
  }

  return Object.values(slotFills).every(
    (fill) => typeof fill === "string" && fill.length > 0
  );
}

export function isSurfaceTemplateContractWire(
  value: unknown
): value is SurfaceTemplateContractWire {
  if (!isWireRecord(value)) {
    return false;
  }

  const acceptanceRecordIds = value["acceptanceRecordIds"];
  const blockBindings = value["blockBindings"];

  return (
    isNonEmptyString(value["surfaceTemplateId"]) &&
    isSurfaceTemplateClass(value["templateClass"]) &&
    isNonEmptyString(value["metadataBindingId"]) &&
    Array.isArray(acceptanceRecordIds) &&
    acceptanceRecordIds.every(
      (recordId) => typeof recordId === "string" && recordId.length > 0
    ) &&
    Array.isArray(blockBindings) &&
    blockBindings.every(isSurfaceTemplateBlockBindingWire)
  );
}
