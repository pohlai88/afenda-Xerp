/**
 * @afenda.l1-contract-envelope block-data
 * Role: Block data field/column wire descriptors (not ORM schema)
 * Family: block-data · flat L1 wire
 * Relies on: wire-guard.helpers
 * Relied on by: registry/block-slot.registry, build-metadata-binding-from-data-contracts
 * Refactored: 2026-07-01 · series flat-L1
 * Gate: check:studio-l1-contracts
 */

import {
  isNonEmptyString,
  isOptionalBoolean,
  isOptionalNonEmptyString,
  isReadonlyArrayOf,
  isStringMemberOf,
  isWireRecord,
} from "./wire-guard.helpers.js";

export const BLOCK_DATA_FIELD_KINDS = [
  "text",
  "email",
  "password",
  "number",
  "date",
  "select",
  "boolean",
  "readonly",
] as const;

export type BlockDataFieldKind = (typeof BLOCK_DATA_FIELD_KINDS)[number];

export const BLOCK_DATA_ACTION_KINDS = [
  "submit",
  "cancel",
  "navigate",
  "dialog",
] as const;

export type BlockDataActionKind = (typeof BLOCK_DATA_ACTION_KINDS)[number];

export interface BlockDataFieldWire {
  readonly fieldKey: string;
  readonly kind: BlockDataFieldKind;
  readonly labelAtomRef?: string;
  readonly requiredDisplay?: boolean;
  readonly slotId: string;
}

export interface BlockDataActionWire {
  readonly actionKey: string;
  readonly kind: BlockDataActionKind;
  readonly labelAtomRef?: string;
  readonly slotId: string;
}

export interface BlockDataContractWire {
  readonly actions?: readonly BlockDataActionWire[];
  readonly blockDataContractId: string;
  readonly blockId: string;
  readonly fields: readonly BlockDataFieldWire[];
}

export function isBlockDataFieldKind(
  value: unknown
): value is BlockDataFieldKind {
  return isStringMemberOf(value, BLOCK_DATA_FIELD_KINDS);
}

export function isBlockDataActionKind(
  value: unknown
): value is BlockDataActionKind {
  return isStringMemberOf(value, BLOCK_DATA_ACTION_KINDS);
}

export function isBlockDataFieldWire(
  value: unknown
): value is BlockDataFieldWire {
  if (!isWireRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value["fieldKey"]) &&
    isNonEmptyString(value["slotId"]) &&
    isBlockDataFieldKind(value["kind"]) &&
    isOptionalNonEmptyString(value["labelAtomRef"]) &&
    isOptionalBoolean(value["requiredDisplay"])
  );
}

function isBlockDataActionWire(value: unknown): value is BlockDataActionWire {
  if (!isWireRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value["actionKey"]) &&
    isNonEmptyString(value["slotId"]) &&
    isBlockDataActionKind(value["kind"]) &&
    isOptionalNonEmptyString(value["labelAtomRef"])
  );
}

export function isBlockDataContractWire(
  value: unknown
): value is BlockDataContractWire {
  if (!isWireRecord(value)) {
    return false;
  }

  const actions = value["actions"];

  return (
    isNonEmptyString(value["blockDataContractId"]) &&
    isNonEmptyString(value["blockId"]) &&
    isReadonlyArrayOf(value["fields"], isBlockDataFieldWire) &&
    (actions === undefined || isReadonlyArrayOf(actions, isBlockDataActionWire))
  );
}

export function assertBlockDataContractWire(
  value: unknown
): asserts value is BlockDataContractWire {
  if (!isBlockDataContractWire(value)) {
    throw new Error("Invalid block data contract wire payload.");
  }
}
