/**
 * @afenda.l1-contract-envelope metadata-binding
 * Role: Metadata binding wire (field → slot)
 * Family: metadata-binding · flat L1 wire
 * Relies on: surface-template.contract, wire-guard.helpers
 * Relied on by: registry/metadata-binding.registry, registry/build-metadata-binding-from-data-contracts, index barrel
 * Refactored: 2026-07-01 · series flat-L1
 * Gate: check:studio-l1-contracts
 */

import type { SurfaceTemplateClass } from "./surface-template.contract.js";
import { isSurfaceTemplateClass } from "./surface-template.contract.js";
import {
  isNonEmptyString,
  isOptionalBoolean,
  isOptionalNonEmptyString,
  isReadonlyArrayOf,
  isStringMemberOf,
  isWireRecord,
} from "./wire-guard.helpers.js";

export const METADATA_BINDING_PRESENTATION_KINDS = [
  "text",
  "textarea",
  "number",
  "date",
  "select",
  "checkbox",
  "readonly",
] as const;

export type MetadataBindingFieldPresentationKind =
  (typeof METADATA_BINDING_PRESENTATION_KINDS)[number];

export const METADATA_BINDING_DENSITIES = [
  "compact",
  "comfortable",
  "spacious",
] as const;

export type MetadataBindingDensity =
  (typeof METADATA_BINDING_DENSITIES)[number];

export const METADATA_BINDING_STATE_KINDS = [
  "empty",
  "loading",
  "error",
  "forbidden",
] as const;

export type MetadataBindingStateKind =
  (typeof METADATA_BINDING_STATE_KINDS)[number];

export interface MetadataBindingFieldWire {
  readonly density?: MetadataBindingDensity;
  readonly fieldKey: string;
  readonly helpTextAtomRef?: string;
  readonly labelAtomRef?: string;
  readonly presentationKind: MetadataBindingFieldPresentationKind;
  readonly requiredDisplay?: boolean;
  readonly slotId: string;
}

export interface MetadataBindingTableColumnWire {
  readonly columnKey: string;
  readonly labelAtomRef?: string;
  readonly slotId: string;
  readonly sortableDisplay?: boolean;
}

export interface MetadataBindingStateTemplateWire {
  readonly messageAtomRef?: string;
  readonly slotId: string;
  readonly stateKind: MetadataBindingStateKind;
}

export interface MetadataBindingContractWire {
  readonly blockId: string;
  readonly erpDomainKvId?: string;
  readonly erpDomainModuleSlug?: string;
  readonly fields: readonly MetadataBindingFieldWire[];
  readonly metadataBindingId: string;
  readonly stateTemplates?: readonly MetadataBindingStateTemplateWire[];
  readonly surfaceTemplateClass?: SurfaceTemplateClass;
  readonly tableColumns?: readonly MetadataBindingTableColumnWire[];
}

export function isValidMetadataBindingPresentationKind(
  value: string
): value is MetadataBindingFieldPresentationKind {
  return isStringMemberOf(value, METADATA_BINDING_PRESENTATION_KINDS);
}

export function isMetadataBindingFieldWire(
  value: unknown
): value is MetadataBindingFieldWire {
  if (!isWireRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value["fieldKey"]) &&
    isNonEmptyString(value["slotId"]) &&
    isStringMemberOf(
      value["presentationKind"],
      METADATA_BINDING_PRESENTATION_KINDS
    ) &&
    (value["density"] === undefined ||
      isStringMemberOf(value["density"], METADATA_BINDING_DENSITIES)) &&
    isOptionalNonEmptyString(value["labelAtomRef"]) &&
    isOptionalNonEmptyString(value["helpTextAtomRef"]) &&
    isOptionalBoolean(value["requiredDisplay"])
  );
}

function isMetadataBindingTableColumnWire(
  value: unknown
): value is MetadataBindingTableColumnWire {
  if (!isWireRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value["columnKey"]) &&
    isNonEmptyString(value["slotId"]) &&
    isOptionalNonEmptyString(value["labelAtomRef"]) &&
    isOptionalBoolean(value["sortableDisplay"])
  );
}

function isMetadataBindingStateTemplateWire(
  value: unknown
): value is MetadataBindingStateTemplateWire {
  if (!isWireRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value["slotId"]) &&
    isStringMemberOf(value["stateKind"], METADATA_BINDING_STATE_KINDS) &&
    isOptionalNonEmptyString(value["messageAtomRef"])
  );
}

export function isMetadataBindingContractWire(
  value: unknown
): value is MetadataBindingContractWire {
  if (!isWireRecord(value)) {
    return false;
  }

  const stateTemplates = value["stateTemplates"];
  const tableColumns = value["tableColumns"];
  const surfaceTemplateClass = value["surfaceTemplateClass"];

  return (
    isNonEmptyString(value["metadataBindingId"]) &&
    isNonEmptyString(value["blockId"]) &&
    isReadonlyArrayOf(value["fields"], isMetadataBindingFieldWire) &&
    isOptionalNonEmptyString(value["erpDomainKvId"]) &&
    isOptionalNonEmptyString(value["erpDomainModuleSlug"]) &&
    (surfaceTemplateClass === undefined ||
      isSurfaceTemplateClass(surfaceTemplateClass)) &&
    (stateTemplates === undefined ||
      isReadonlyArrayOf(stateTemplates, isMetadataBindingStateTemplateWire)) &&
    (tableColumns === undefined ||
      isReadonlyArrayOf(tableColumns, isMetadataBindingTableColumnWire))
  );
}

export function assertMetadataBindingContractWire(
  value: unknown
): asserts value is MetadataBindingContractWire {
  if (!isMetadataBindingContractWire(value)) {
    throw new Error("Invalid metadata binding contract wire payload.");
  }
}
