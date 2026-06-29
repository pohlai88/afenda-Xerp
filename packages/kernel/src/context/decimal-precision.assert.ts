import {
  DECIMAL_PRECISION_MAX,
  DECIMAL_PRECISION_MIN,
  isDecimalPrecisionScale,
  type WireDecimalPrecisionVocabulary,
} from "./decimal-precision.contract.js";

export function assertDecimalPrecisionScale(
  value: number,
  label = "scale"
): void {
  if (!isDecimalPrecisionScale(value)) {
    throw new Error(
      `${label} must be an integer between ${DECIMAL_PRECISION_MIN} and ${DECIMAL_PRECISION_MAX}.`
    );
  }
}

/** JSON ingress guard — fail closed before branding. */
export function assertWireDecimalPrecisionVocabulary(
  value: unknown
): asserts value is WireDecimalPrecisionVocabulary {
  if (value === null || typeof value !== "object") {
    throw new Error("WireDecimalPrecisionVocabulary must be an object.");
  }

  const record = value as Record<string, unknown>;

  if (typeof record["scale"] !== "number") {
    throw new Error("scale must be a number.");
  }

  assertDecimalPrecisionScale(record["scale"]);
}
