import { assertWireTenantSaasLifecycleVocabulary } from "./tenant-saas-lifecycle.assert.js";
import type {
  TenantSaasLifecycleVocabulary,
  WireTenantSaasLifecycleVocabulary,
} from "./tenant-saas-lifecycle.contract.js";

function parseValidatedTenantSaasLifecycleVocabulary(
  value: WireTenantSaasLifecycleVocabulary
): TenantSaasLifecycleVocabulary {
  return { phase: value.phase as TenantSaasLifecycleVocabulary["phase"] };
}

export function parseTenantSaasLifecycleVocabulary(
  value: WireTenantSaasLifecycleVocabulary
): TenantSaasLifecycleVocabulary {
  assertWireTenantSaasLifecycleVocabulary(value);
  return parseValidatedTenantSaasLifecycleVocabulary(value);
}

export function parseUnknownTenantSaasLifecycleVocabulary(
  value: unknown
): TenantSaasLifecycleVocabulary {
  assertWireTenantSaasLifecycleVocabulary(value);
  return parseValidatedTenantSaasLifecycleVocabulary(value);
}

export function serializeTenantSaasLifecycleVocabulary(
  value: TenantSaasLifecycleVocabulary
): WireTenantSaasLifecycleVocabulary {
  return { phase: value.phase };
}
