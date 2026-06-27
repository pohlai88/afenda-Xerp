import type { Brand } from "../brand/brand.contract.js";
import type { CanonicalId } from "../canonical/canonical-id.contract.js";
import {
  type ParsedRegisteredCanonicalEnterpriseId,
  parseCanonicalId,
  parseRegisteredCanonicalEnterpriseId,
} from "../canonical/canonical-id-parser.contract.js";
import type { EnterpriseIdFamily } from "../registry/id-family.registry.js";

/** Plain-string canonical enterprise ID at JSON wire boundaries (ingress unparsed). */
export type WireCanonicalId = string;

export function parseWireCanonicalId<TFamily extends EnterpriseIdFamily>(
  value: string,
  family: TFamily
): CanonicalId<TFamily> {
  return parseCanonicalId(value, family);
}

/** Family-unknown wire ingress — resolves prefix via `ID_FAMILIES` before parse. */
export function parseWireRegisteredCanonicalId<
  TFamily extends EnterpriseIdFamily = EnterpriseIdFamily,
>(value: string): ParsedRegisteredCanonicalEnterpriseId<TFamily> {
  return parseRegisteredCanonicalEnterpriseId(value);
}

export function serializeCanonicalId<TFamily extends EnterpriseIdFamily>(
  value: CanonicalId<TFamily>
): string {
  return value as string;
}

export function normalizeBrandedIdForWire<T extends string>(
  value: string | Brand<string, T>,
  toPlain: (branded: Brand<string, T>) => string
): string {
  return typeof value === "string" ? value : toPlain(value);
}

export function normalizeOptionalBrandedIdForWire<T extends string>(
  value: string | Brand<string, T> | null | undefined,
  toPlain: (branded: Brand<string, T>) => string
): string | null {
  if (value == null) {
    return null;
  }

  return normalizeBrandedIdForWire(value, toPlain);
}
