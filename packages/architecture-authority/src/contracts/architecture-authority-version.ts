import { parseIso8601UtcTimestamp } from "./iso8601-utc-timestamp.js";

export const ARCHITECTURE_AUTHORITY_VERSION = "1.0.0" as const;

export const ARCHITECTURE_BASELINE_FINGERPRINT =
  "ARCH-BASELINE-2026-06-29-v5" as const;

/** Deterministic lifecycle/exception validation reference for CI gates (matches baseline date). */
export const ARCHITECTURE_VALIDATION_REFERENCE_ISO =
  "2026-07-06T00:00:00.000Z" as const;

export function resolveArchitectureValidationReferenceMs(
  options: { referenceDateMs?: number; referenceIso?: string } = {}
): number {
  if (options.referenceDateMs !== undefined) {
    return options.referenceDateMs;
  }

  if (options.referenceIso !== undefined) {
    const parsed = parseIso8601UtcTimestamp(options.referenceIso);
    if (parsed !== undefined) {
      return parsed;
    }
  }

  const envReference =
    process.env["AFENDA_ARCHITECTURE_VALIDATION_REFERENCE_ISO"];
  if (envReference) {
    const parsed = parseIso8601UtcTimestamp(envReference);
    if (parsed !== undefined) {
      return parsed;
    }
  }

  return Date.parse(ARCHITECTURE_VALIDATION_REFERENCE_ISO);
}
