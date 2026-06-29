import {
  isRoundingMode,
  ROUNDING_MODES,
  type WireRoundingModeVocabulary,
} from "./rounding-mode.contract.js";

export function assertRoundingMode(value: string, label = "mode"): void {
  if (!isRoundingMode(value)) {
    throw new Error(
      `${label} must be one of: ${ROUNDING_MODES.join(", ")} — received "${value}".`
    );
  }
}

/** JSON ingress guard — fail closed before branding. */
export function assertWireRoundingModeVocabulary(
  value: unknown
): asserts value is WireRoundingModeVocabulary {
  if (value === null || typeof value !== "object") {
    throw new Error("WireRoundingModeVocabulary must be an object.");
  }

  const record = value as Record<string, unknown>;

  if (typeof record["mode"] !== "string") {
    throw new Error("mode must be a string.");
  }

  assertRoundingMode(record["mode"]);
}
