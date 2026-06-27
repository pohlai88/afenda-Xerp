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

  // Defensive: `resolveEnterpriseIdFamilyFromPrefix` may theoretically return null even
  // after `isRegisteredEnterpriseIdPrefix` passes (e.g. registry mutation between calls).
  // The check above already guards the common case; this guard prevents unsafe narrowing.
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

  // 1. Generic canonical format (PAS-001 §4.1.3)
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

  // Compile-time branch: `CanonicalEnterpriseId<TFamily>` is `Brand<string, …>` which is
  // always a `string` at runtime, so this branch is never reached in practice. It exists
  // so the type-checker narrows `value` to `string` for the `parseCanonicalId` call below.
  if (typeof value !== "string") {
    return value;
  }

  return parseCanonicalId(value, family);
}
