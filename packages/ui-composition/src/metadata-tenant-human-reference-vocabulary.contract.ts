/**
 * Metadata tenant human reference wire vocabulary (PAS-001 §4.1.13 consumer projection).
 *
 * Structural mirror of `@afenda/kernel` tenant human reference scopes — parsing and
 * branding remain in ERP/kernel at the operating trust boundary.
 */

export const METADATA_TENANT_HUMAN_REFERENCE_SCOPES = [
  "employee",
  "customer",
  "supplier",
  "sku",
  "asset",
  "document",
  "warehouse",
] as const satisfies readonly string[];

export type MetadataTenantHumanReferenceScope =
  (typeof METADATA_TENANT_HUMAN_REFERENCE_SCOPES)[number];

/** JSON-safe wire carrier for metadata form fields and diagnostics. */
export type MetadataTenantHumanReferenceWireValue = string;

export const METADATA_TENANT_HUMAN_REFERENCE_SCOPE_LABELS = {
  employee: "Employee No",
  customer: "Customer No",
  supplier: "Supplier No",
  sku: "SKU",
  asset: "Asset No",
  document: "Document No",
  warehouse: "Warehouse Code",
} as const satisfies Record<MetadataTenantHumanReferenceScope, string>;

/** Parity with `@afenda/database` tenant human reference column names (ADR-0023). */
export const METADATA_TENANT_HUMAN_REFERENCE_SCOPE_COLUMNS = {
  employee: "employee_no",
  customer: "customer_no",
  supplier: "supplier_no",
  sku: "sku",
  asset: "asset_no",
  document: "document_no",
  warehouse: "warehouse_code",
} as const satisfies Record<MetadataTenantHumanReferenceScope, string>;

export const METADATA_TENANT_HUMAN_REFERENCE_MAX_WIRE_LENGTH = 64 as const;

export interface MetadataTenantHumanReferenceFieldBinding {
  readonly scope: MetadataTenantHumanReferenceScope;
  readonly wireValue: MetadataTenantHumanReferenceWireValue;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isMetadataTenantHumanReferenceScope(
  value: string
): value is MetadataTenantHumanReferenceScope {
  return (METADATA_TENANT_HUMAN_REFERENCE_SCOPES as readonly string[]).includes(
    value
  );
}

export function assertMetadataTenantHumanReferenceWireShape(
  wire: string,
  label: string
): MetadataTenantHumanReferenceWireValue {
  const trimmed = wire.trim();

  if (!trimmed) {
    throw new Error(`${label} is required.`);
  }

  if (trimmed.length > METADATA_TENANT_HUMAN_REFERENCE_MAX_WIRE_LENGTH) {
    throw new Error(`${label} must not exceed 64 characters.`);
  }

  return trimmed;
}

export function isMetadataTenantHumanReferenceFieldBinding(
  value: unknown
): value is MetadataTenantHumanReferenceFieldBinding {
  if (!isRecord(value)) {
    return false;
  }

  const scope = value["scope"];
  const wireValue = value["wireValue"];

  if (
    typeof scope !== "string" ||
    !isMetadataTenantHumanReferenceScope(scope)
  ) {
    return false;
  }

  if (typeof wireValue !== "string") {
    return false;
  }

  try {
    assertMetadataTenantHumanReferenceWireShape(
      wireValue,
      METADATA_TENANT_HUMAN_REFERENCE_SCOPE_LABELS[scope]
    );
  } catch {
    return false;
  }

  return true;
}

/** Metadata-layer wire trim only — ERP/kernel parse* runs at the trust boundary. */
export function normalizeMetadataTenantHumanReferenceWireValue(
  wire: MetadataTenantHumanReferenceWireValue
): MetadataTenantHumanReferenceWireValue {
  return wire.trim();
}

export function serializeMetadataTenantHumanReferenceFieldBinding(
  binding: MetadataTenantHumanReferenceFieldBinding
): MetadataTenantHumanReferenceFieldBinding {
  return {
    scope: binding.scope,
    wireValue: normalizeMetadataTenantHumanReferenceWireValue(
      binding.wireValue
    ),
  };
}
