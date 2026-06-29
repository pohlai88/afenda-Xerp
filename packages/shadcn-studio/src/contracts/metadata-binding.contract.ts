/**
 * PAS-006D — metadata binding wire contract (presentation layer).
 * Wire-safe field → block slot mapping — not ORM schema.
 */

export type MetadataBindingFieldPresentationKind =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "checkbox"
  | "readonly";

export type MetadataBindingDensity = "compact" | "comfortable" | "spacious";

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
  readonly stateKind: "empty" | "loading" | "error" | "forbidden";
}

export interface MetadataBindingContractWire {
  readonly blockId: string;
  readonly erpDomainKvId?: string;
  readonly erpDomainModuleSlug?: string;
  readonly fields: readonly MetadataBindingFieldWire[];
  readonly metadataBindingId: string;
  readonly stateTemplates?: readonly MetadataBindingStateTemplateWire[];
  readonly surfaceTemplateClass?: string;
  readonly tableColumns?: readonly MetadataBindingTableColumnWire[];
}

export function isMetadataBindingContractWire(
  value: unknown
): value is MetadataBindingContractWire {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record["metadataBindingId"] === "string" &&
    typeof record["blockId"] === "string" &&
    Array.isArray(record["fields"]) &&
    record["fields"].every(isMetadataBindingFieldWire)
  );
}

function isMetadataBindingFieldWire(
  value: unknown
): value is MetadataBindingFieldWire {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record["fieldKey"] === "string" &&
    typeof record["slotId"] === "string" &&
    typeof record["presentationKind"] === "string"
  );
}
