import { assertWireDecimalPrecisionVocabulary } from "./decimal-precision.assert.js";
import type {
  DecimalPrecisionVocabulary,
  WireDecimalPrecisionVocabulary,
} from "./decimal-precision.contract.js";

function parseValidatedDecimalPrecisionVocabulary(
  value: WireDecimalPrecisionVocabulary
): DecimalPrecisionVocabulary {
  return { scale: value.scale };
}

export function parseDecimalPrecisionVocabulary(
  value: WireDecimalPrecisionVocabulary
): DecimalPrecisionVocabulary {
  assertWireDecimalPrecisionVocabulary(value);
  return parseValidatedDecimalPrecisionVocabulary(value);
}

export function parseUnknownDecimalPrecisionVocabulary(
  value: unknown
): DecimalPrecisionVocabulary {
  assertWireDecimalPrecisionVocabulary(value);
  return parseValidatedDecimalPrecisionVocabulary(value);
}

export function serializeDecimalPrecisionVocabulary(
  value: DecimalPrecisionVocabulary
): WireDecimalPrecisionVocabulary {
  return { scale: value.scale };
}
