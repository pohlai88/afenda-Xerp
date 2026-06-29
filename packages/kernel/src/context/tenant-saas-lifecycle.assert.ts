import {
  isTenantSaasLifecyclePhase,
  TENANT_SAAS_LIFECYCLE_PHASES,
  type WireTenantSaasLifecycleVocabulary,
} from "./tenant-saas-lifecycle.contract.js";

export function assertTenantSaasLifecyclePhase(
  value: string,
  label = "phase"
): void {
  if (!isTenantSaasLifecyclePhase(value)) {
    throw new Error(
      `${label} must be one of: ${TENANT_SAAS_LIFECYCLE_PHASES.join(", ")}.`
    );
  }
}

function assertWireTenantSaasLifecycleVocabularyShape(
  value: WireTenantSaasLifecycleVocabulary
): void {
  assertTenantSaasLifecyclePhase(value.phase);
}

/** JSON ingress guard — fail closed before branding. */
export function assertWireTenantSaasLifecycleVocabulary(
  value: unknown
): asserts value is WireTenantSaasLifecycleVocabulary {
  if (value === null || typeof value !== "object") {
    throw new Error("WireTenantSaasLifecycleVocabulary must be an object.");
  }

  const record = value as Record<string, unknown>;

  if (typeof record["phase"] !== "string") {
    throw new Error("phase must be a string.");
  }

  assertWireTenantSaasLifecycleVocabularyShape(
    value as WireTenantSaasLifecycleVocabulary
  );
}
