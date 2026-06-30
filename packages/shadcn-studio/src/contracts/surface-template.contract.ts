/**
 * PAS-006D — surface template wire contract (presentation layer).
 */

import {
  isNonEmptyString,
  isReadonlyArrayOf,
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

  return Object.entries(slotFills).every(
    ([slotId, fill]) => isNonEmptyString(slotId) && isNonEmptyString(fill)
  );
}

export function isSurfaceTemplateContractWire(
  value: unknown
): value is SurfaceTemplateContractWire {
  if (!isWireRecord(value)) {
    return false;
  }

  const blockBindings = value["blockBindings"];

  return (
    isNonEmptyString(value["surfaceTemplateId"]) &&
    isSurfaceTemplateClass(value["templateClass"]) &&
    isNonEmptyString(value["metadataBindingId"]) &&
    isReadonlyArrayOf(value["acceptanceRecordIds"], isNonEmptyString) &&
    isReadonlyArrayOf(blockBindings, isSurfaceTemplateBlockBindingWire)
  );
}

export function assertSurfaceTemplateContractWire(
  value: unknown
): asserts value is SurfaceTemplateContractWire {
  if (!isSurfaceTemplateContractWire(value)) {
    throw new Error("Invalid surface template contract wire payload.");
  }
}
