import {
  serializeDecimalPrecisionVocabulary,
  serializeRoundingModeVocabulary,
  type WireDecimalPrecisionVocabulary,
  type WireRoundingModeVocabulary,
} from "@afenda/kernel/context";

import { parseCompanyFormatPrecisionSettingsAtIngress } from "./parse-format-precision.server.js";

export { parseCompanyFormatPrecisionSettingsAtIngress };

export interface PersistedCompanyFormatPrecisionSettings {
  readonly companyFormatDefaults: {
    readonly roundingMode: WireRoundingModeVocabulary;
    readonly decimalPrecision: WireDecimalPrecisionVocabulary;
  };
}

/**
 * Parse company/workspace rounding mode and decimal scale at ingress.
 * Rounding execution remains outside kernel — this returns wire-safe codes only.
 */
export function persistCompanyFormatPrecisionSettings(
  value: unknown
): PersistedCompanyFormatPrecisionSettings {
  const vocabulary = parseCompanyFormatPrecisionSettingsAtIngress(value);

  return {
    companyFormatDefaults: {
      roundingMode: serializeRoundingModeVocabulary(vocabulary.roundingMode),
      decimalPrecision: serializeDecimalPrecisionVocabulary(
        vocabulary.decimalPrecision
      ),
    },
  };
}
