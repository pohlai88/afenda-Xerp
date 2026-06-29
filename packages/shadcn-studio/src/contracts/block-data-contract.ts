/**
 * PAS-006B P06-003 — block data contract wire descriptors (not ORM schema).
 */

export type BlockDataFieldKind =
  | "text"
  | "email"
  | "password"
  | "number"
  | "date"
  | "select"
  | "boolean"
  | "readonly";

export type BlockDataActionKind = "submit" | "cancel" | "navigate" | "dialog";

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

export function isBlockDataContractWire(
  value: unknown
): value is BlockDataContractWire {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record["blockDataContractId"] === "string" &&
    typeof record["blockId"] === "string" &&
    Array.isArray(record["fields"]) &&
    record["fields"].every(isBlockDataFieldWire)
  );
}

function isBlockDataFieldWire(value: unknown): value is BlockDataFieldWire {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record["fieldKey"] === "string" &&
    typeof record["slotId"] === "string" &&
    typeof record["kind"] === "string"
  );
}
