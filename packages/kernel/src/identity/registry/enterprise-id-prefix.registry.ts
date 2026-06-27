/**
 * PAS-001 §4.1.4 — frozen enterprise ID prefix authority derived from `ID_FAMILIES`.
 */

import {
  ENTERPRISE_ID_FAMILIES,
  type EnterpriseIdFamily,
  type EnterpriseIdPrefix,
  ID_FAMILIES,
} from "./id-family.registry.js";

export type RegisteredEnterpriseIdPrefix = EnterpriseIdPrefix;

/** All 22 registered three-letter enterprise ID prefixes — derived from `ID_FAMILIES`. */
export const REGISTERED_ENTERPRISE_ID_PREFIXES = Object.freeze(
  ENTERPRISE_ID_FAMILIES.map(
    (family) => ID_FAMILIES[family].prefix
  ) as RegisteredEnterpriseIdPrefix[]
);

const registeredPrefixSet = new Set<string>(REGISTERED_ENTERPRISE_ID_PREFIXES);

/** Prefix → registry family key lookup. */
export const ENTERPRISE_ID_PREFIX_TO_FAMILY = Object.freeze(
  Object.fromEntries(
    ENTERPRISE_ID_FAMILIES.map((family) => [ID_FAMILIES[family].prefix, family])
  ) as Record<RegisteredEnterpriseIdPrefix, EnterpriseIdFamily>
);

export function isRegisteredEnterpriseIdPrefix(
  prefix: string
): prefix is RegisteredEnterpriseIdPrefix {
  return registeredPrefixSet.has(prefix);
}

/** Extract the three-letter prefix from a trimmed or untrimmed canonical ID string. */
export function extractCanonicalEnterpriseIdPrefix(
  value: string
): string | null {
  const trimmed = value.trim();
  const separatorIndex = trimmed.indexOf("_");

  if (separatorIndex !== 3) {
    return null;
  }

  const prefix = trimmed.slice(0, 3);

  if (!/^[a-z]{3}$/.test(prefix)) {
    return null;
  }

  return prefix;
}

export function resolveEnterpriseIdFamilyFromPrefix(
  prefix: string
): EnterpriseIdFamily | null {
  if (!isRegisteredEnterpriseIdPrefix(prefix)) {
    return null;
  }

  return ENTERPRISE_ID_PREFIX_TO_FAMILY[prefix] ?? null;
}
