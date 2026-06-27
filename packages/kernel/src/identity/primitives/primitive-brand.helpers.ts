import type { Brand } from "../brand/brand.contract.js";
import { isCanonicalEnterpriseId } from "../canonical/canonical-id-parser.contract.js";

/** Detects tenant human reference shape (e.g. EMP-000123) for misclassification guards. */
export const TENANT_HUMAN_REFERENCE_PATTERN = /^[A-Z][A-Z0-9]*-[A-Z0-9-]+$/;

export function rejectIfMisclassifiedId(value: string, label: string): void {
  if (isCanonicalEnterpriseId(value)) {
    throw new Error(`${label} must not be a canonical enterprise ID.`);
  }

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
