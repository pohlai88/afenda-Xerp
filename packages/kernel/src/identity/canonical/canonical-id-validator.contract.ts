/**
 * PAS-001 §4.1.3 (format tier) and §4.1.4 (registry tier) validators.
 */

import {
  extractCanonicalEnterpriseIdPrefix,
  isRegisteredEnterpriseIdPrefix,
} from "../registry/enterprise-id-prefix.registry.js";
import {
  type EnterpriseIdFamily,
  ID_FAMILIES,
} from "../registry/id-family.registry.js";
import {
  buildCanonicalEnterpriseIdRegex,
  CANONICAL_ID_BODY_REGEX,
  CANONICAL_ID_PATTERN,
  CANONICAL_ID_SEPARATOR,
} from "./canonical-id-format.contract.js";
import { InvalidCanonicalIdError } from "./invalid-canonical-id.error.js";

export function isCanonicalEnterpriseId(value: string): boolean {
  return CANONICAL_ID_PATTERN.test(value);
}

/** Format tier + registry tier — prefix must exist in `ID_FAMILIES`. */
export function isRegisteredCanonicalEnterpriseId(value: string): boolean {
  if (value !== value.trim()) {
    return false;
  }

  if (!isCanonicalEnterpriseId(value)) {
    return false;
  }

  const prefix = extractCanonicalEnterpriseIdPrefix(value);
  return prefix !== null && isRegisteredEnterpriseIdPrefix(prefix);
}

export function isCanonicalEnterpriseIdForFamily(
  value: string,
  family: EnterpriseIdFamily
): boolean {
  if (value !== value.trim()) {
    return false;
  }

  return buildCanonicalEnterpriseIdRegex(ID_FAMILIES[family].prefix).test(
    value
  );
}

export function isCanonicalIdBody(value: string): boolean {
  return CANONICAL_ID_BODY_REGEX.test(value);
}

export function assertCanonicalIdBody(value: string): void {
  if (!isCanonicalIdBody(value)) {
    throw new InvalidCanonicalIdError(
      "Canonical enterprise ID body has invalid canonical ID format."
    );
  }
}

export function assertEnterpriseIdPrefix(
  value: string,
  family: EnterpriseIdFamily
): void {
  const { typeName, prefix } = ID_FAMILIES[family];
  const expectedPrefix = `${prefix}${CANONICAL_ID_SEPARATOR}`;

  if (!value.startsWith(expectedPrefix)) {
    throw new InvalidCanonicalIdError(
      `${typeName} must start with ${expectedPrefix}.`
    );
  }
}

export function assertRegisteredEnterpriseIdPrefix(value: string): void {
  const raw = value.trim();
  const prefix = extractCanonicalEnterpriseIdPrefix(raw);

  if (prefix === null || !isRegisteredEnterpriseIdPrefix(prefix)) {
    throw new InvalidCanonicalIdError(
      "Canonical enterprise ID prefix is not registered in ID_FAMILIES."
    );
  }
}
