import {
  extractCanonicalEnterpriseIdPrefix,
  isRegisteredEnterpriseIdPrefix,
  resolveEnterpriseIdFamilyFromPrefix,
} from "../registry/enterprise-id-prefix.registry.js";
import {
  type EnterpriseIdFamily,
  ID_FAMILIES,
} from "../registry/id-family.registry.js";
import type { CanonicalEnterpriseId } from "./canonical-id.contract.js";
import {
  buildCanonicalEnterpriseIdRegex,
  CANONICAL_ID_BODY_REGEX,
  CANONICAL_ID_PATTERN,
  CANONICAL_ID_SEPARATOR,
} from "./canonical-id-format.contract.js";
import { InvalidCanonicalIdError } from "./invalid-canonical-id.error.js";

export interface ParsedRegisteredCanonicalEnterpriseId<
  TFamily extends EnterpriseIdFamily = EnterpriseIdFamily,
> {
  readonly family: TFamily;
  readonly id: CanonicalEnterpriseId<TFamily>;
}

export function isCanonicalEnterpriseId(value: string): boolean {
  return CANONICAL_ID_PATTERN.test(value.trim());
}

/** Format tier + registry tier — prefix must exist in `ID_FAMILIES`. */
export function isRegisteredCanonicalEnterpriseId(value: string): boolean {
  const raw = value.trim();

  if (!isCanonicalEnterpriseId(raw)) {
    return false;
  }

  const prefix = extractCanonicalEnterpriseIdPrefix(raw);
  return prefix !== null && isRegisteredEnterpriseIdPrefix(prefix);
}

export function isCanonicalEnterpriseIdForFamily(
  value: string,
  family: EnterpriseIdFamily
): boolean {
  return buildCanonicalEnterpriseIdRegex(ID_FAMILIES[family].prefix).test(
    value.trim()
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

export function parseRegisteredCanonicalEnterpriseId<
  TFamily extends EnterpriseIdFamily = EnterpriseIdFamily,
>(value: string): ParsedRegisteredCanonicalEnterpriseId<TFamily> {
  const raw = value.trim();

  if (!raw) {
    throw new InvalidCanonicalIdError("Canonical enterprise ID is required.");
  }

  if (!isCanonicalEnterpriseId(raw)) {
    throw new InvalidCanonicalIdError(
      "Canonical enterprise ID has invalid format."
    );
  }

  const prefix = extractCanonicalEnterpriseIdPrefix(raw);

  if (prefix === null || !isRegisteredEnterpriseIdPrefix(prefix)) {
    throw new InvalidCanonicalIdError(
      "Canonical enterprise ID prefix is not registered in ID_FAMILIES."
    );
  }

  const family = resolveEnterpriseIdFamilyFromPrefix(prefix);

  if (family === null) {
    throw new InvalidCanonicalIdError(
      "Canonical enterprise ID prefix is not registered in ID_FAMILIES."
    );
  }

  return {
    family,
    id: parseCanonicalId(raw, family),
  } as ParsedRegisteredCanonicalEnterpriseId<TFamily>;
}

export function tryParseRegisteredCanonicalEnterpriseId<
  TFamily extends EnterpriseIdFamily = EnterpriseIdFamily,
>(value: string): ParsedRegisteredCanonicalEnterpriseId<TFamily> | null {
  try {
    return parseRegisteredCanonicalEnterpriseId(value);
  } catch {
    return null;
  }
}

export function parseCanonicalId<TFamily extends EnterpriseIdFamily>(
  value: string,
  family: TFamily
): CanonicalEnterpriseId<TFamily> {
  const raw = value.trim();
  const { typeName, prefix } = ID_FAMILIES[family];
  const expectedPrefix = `${prefix}${CANONICAL_ID_SEPARATOR}`;

  // 1. Non-empty
  if (!raw) {
    throw new InvalidCanonicalIdError(`${typeName} is required.`);
  }

  // 2. Generic canonical format (PAS-001 §4.1.3)
  if (!CANONICAL_ID_PATTERN.test(raw)) {
    throw new InvalidCanonicalIdError(
      `${typeName} has invalid canonical ID format.`
    );
  }

  // 3. Wire prefix registered in ID_FAMILIES (PAS-001 §4.1.4 registry tier)
  const wirePrefix = extractCanonicalEnterpriseIdPrefix(raw);
  if (wirePrefix === null || !isRegisteredEnterpriseIdPrefix(wirePrefix)) {
    throw new InvalidCanonicalIdError(
      "Canonical enterprise ID prefix is not registered in ID_FAMILIES."
    );
  }

  // 4. Prefix matches requested family
  if (!raw.startsWith(expectedPrefix)) {
    throw new InvalidCanonicalIdError(
      `${typeName} must start with ${expectedPrefix}.`
    );
  }

  return raw as CanonicalEnterpriseId<TFamily>;
}

export function tryParseCanonicalId<TFamily extends EnterpriseIdFamily>(
  value: string,
  family: TFamily
): CanonicalEnterpriseId<TFamily> | null {
  try {
    return parseCanonicalId(value, family);
  } catch {
    return null;
  }
}

export function parseOptionalCanonicalId<TFamily extends EnterpriseIdFamily>(
  value: string | CanonicalEnterpriseId<TFamily> | null | undefined,
  family: TFamily
): CanonicalEnterpriseId<TFamily> | null {
  if (value == null) {
    return null;
  }

  if (typeof value !== "string") {
    return value;
  }

  return parseCanonicalId(value, family);
}
