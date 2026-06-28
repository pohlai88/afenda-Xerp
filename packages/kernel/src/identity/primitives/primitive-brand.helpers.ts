import type { Brand } from "../brand/index.js";
import { isCanonicalEnterpriseId } from "../canonical/canonical-id-validator.contract.js";

/** Tenant human reference wire shape (e.g. EMP-000123) for misclassification guards. */
export const TENANT_HUMAN_REFERENCE_PATTERN_SOURCE =
  "^[A-Z][A-Z0-9]*-[A-Z0-9-]+$" as const;

export const TENANT_HUMAN_REFERENCE_PATTERN = new RegExp(
  TENANT_HUMAN_REFERENCE_PATTERN_SOURCE
);

export function rejectIfCanonicalEnterpriseId(
  value: string,
  label: string
): void {
  if (isCanonicalEnterpriseId(value)) {
    throw new Error(`${label} must not be a canonical enterprise ID.`);
  }
}

export function rejectIfMisclassifiedId(value: string, label: string): void {
  rejectIfCanonicalEnterpriseId(value, label);

  if (TENANT_HUMAN_REFERENCE_PATTERN.test(value)) {
    throw new Error(`${label} must not be a tenant human reference.`);
  }
}

export function brandTrimRequired<T extends string>(
  value: string | Brand<string, T>,
  label: string
): Brand<string, T> {
  const raw = typeof value === "string" ? value : (value as string);

  if (!raw.trim()) {
    throw new Error(`${label} is required.`);
  }

  return raw as Brand<string, T>;
}

export function brandTrimOptional<T extends string>(
  value: string | Brand<string, T> | null | undefined,
  label: string
): Brand<string, T> | null {
  if (value == null) {
    return null;
  }

  return brandTrimRequired(value, label);
}

export function parsePrimitive<T extends string>(
  value: string,
  label: string
): Brand<string, T> {
  return brandTrimRequired(value, label) as Brand<string, T>;
}
