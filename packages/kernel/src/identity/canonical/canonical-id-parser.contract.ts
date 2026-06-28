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
  CANONICAL_ID_PATTERN,
  CANONICAL_ID_SEPARATOR,
} from "./canonical-id-format.contract.js";
import { isCanonicalEnterpriseId } from "./canonical-id-validator.contract.js";
import { InvalidCanonicalIdError } from "./invalid-canonical-id.error.js";

export interface ParsedRegisteredCanonicalEnterpriseId<
  TFamily extends EnterpriseIdFamily = EnterpriseIdFamily,
> {
  readonly family: TFamily;
  readonly id: CanonicalEnterpriseId<TFamily>;
}

export function parseRegisteredCanonicalEnterpriseId(
  value: string
): ParsedRegisteredCanonicalEnterpriseId {
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
  };
}

export function tryParseRegisteredCanonicalEnterpriseId(
  value: string
): ParsedRegisteredCanonicalEnterpriseId | null {
  try {
    return parseRegisteredCanonicalEnterpriseId(value);
  } catch {
    return null;
  }
}

function assertCanonicalEnterpriseIdWireShape(
  value: string,
  typeName: string
): string {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new InvalidCanonicalIdError(`${typeName} is required.`);
  }

  if (value !== trimmed) {
    throw new InvalidCanonicalIdError(
      `${typeName} has invalid canonical ID format.`
    );
  }

  return trimmed;
}

export function parseCanonicalId<TFamily extends EnterpriseIdFamily>(
  value: string,
  family: TFamily
): CanonicalEnterpriseId<TFamily> {
  const { typeName, prefix } = ID_FAMILIES[family];
  const raw = assertCanonicalEnterpriseIdWireShape(value, typeName);
  const expectedPrefix = `${prefix}${CANONICAL_ID_SEPARATOR}`;

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

  return parseCanonicalId(value, family);
}
