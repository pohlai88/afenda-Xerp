import {
  assertTenantExtensionFieldKeyDoesNotForkKernelBrand,
  isTenantExtensionNonAuthoritativeKind,
  TENANT_EXTENSION_NON_AUTHORITATIVE_KINDS,
  type WireTenantExtensionBoundaryVocabulary,
} from "./tenant-extension-boundary.contract.js";

export function assertTenantExtensionNonAuthoritativeKind(
  value: string,
  label = "kind"
): void {
  if (!isTenantExtensionNonAuthoritativeKind(value)) {
    throw new Error(
      `${label} must be one of: ${TENANT_EXTENSION_NON_AUTHORITATIVE_KINDS.join(", ")}.`
    );
  }
}

function assertWireTenantExtensionBoundaryVocabularyShape(
  value: WireTenantExtensionBoundaryVocabulary
): void {
  assertTenantExtensionNonAuthoritativeKind(value.kind);
  assertTenantExtensionFieldKeyDoesNotForkKernelBrand(value.fieldKey);
}

/** JSON ingress guard — fail closed before accepting extension metadata. */
export function assertWireTenantExtensionBoundaryVocabulary(
  value: unknown
): asserts value is WireTenantExtensionBoundaryVocabulary {
  if (value === null || typeof value !== "object") {
    throw new Error("WireTenantExtensionBoundaryVocabulary must be an object.");
  }

  const record = value as Record<string, unknown>;

  if (typeof record["kind"] !== "string") {
    throw new Error("kind must be a string.");
  }
  if (typeof record["fieldKey"] !== "string") {
    throw new Error("fieldKey must be a string.");
  }

  assertWireTenantExtensionBoundaryVocabularyShape(
    value as WireTenantExtensionBoundaryVocabulary
  );
}
