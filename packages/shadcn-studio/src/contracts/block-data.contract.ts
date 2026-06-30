/**
 * PAS-006B P06-003 — block data contract wire descriptors (not ORM schema).
 */

import {
  isNonEmptyString,
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
    (value["labelAtomRef"] === undefined ||
      typeof value["labelAtomRef"] === "string") &&
    (value["requiredDisplay"] === undefined ||
      typeof value["requiredDisplay"] === "boolean")
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
    (value["labelAtomRef"] === undefined ||
      typeof value["labelAtomRef"] === "string")
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
    Array.isArray(value["fields"]) &&
    value["fields"].every(isBlockDataFieldWire) &&
    (actions === undefined ||
      (Array.isArray(actions) && actions.every(isBlockDataActionWire)))
  );
}
