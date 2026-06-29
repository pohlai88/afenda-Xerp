import { assertWireRoundingModeVocabulary } from "./rounding-mode.assert.js";
import type {
  RoundingModeVocabulary,
  WireRoundingModeVocabulary,
} from "./rounding-mode.contract.js";

function parseValidatedRoundingModeVocabulary(
  value: WireRoundingModeVocabulary
): RoundingModeVocabulary {
  return { mode: value.mode as RoundingModeVocabulary["mode"] };
}

export function parseRoundingModeVocabulary(
  value: WireRoundingModeVocabulary
): RoundingModeVocabulary {
  assertWireRoundingModeVocabulary(value);
  return parseValidatedRoundingModeVocabulary(value);
}

export function parseUnknownRoundingModeVocabulary(
  value: unknown
): RoundingModeVocabulary {
  assertWireRoundingModeVocabulary(value);
  return parseValidatedRoundingModeVocabulary(value);
}

export function serializeRoundingModeVocabulary(
  value: RoundingModeVocabulary
): WireRoundingModeVocabulary {
  return { mode: value.mode };
}
