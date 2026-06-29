import {
  type DecimalPrecisionVocabulary,
  parseUnknownDecimalPrecisionVocabulary,
  parseUnknownRoundingModeVocabulary,
  type RoundingModeVocabulary,
  type WireDecimalPrecisionVocabulary,
  type WireRoundingModeVocabulary,
} from "@afenda/kernel/context";

import { ApiRouteError } from "@/server/api/runtime/api-validation";

/** Company / workspace settings wire — kernel-aligned nested vocabulary shapes. */
export interface CompanyFormatPrecisionSettingsWire {
  readonly decimalPrecision: WireDecimalPrecisionVocabulary;
  readonly roundingMode: WireRoundingModeVocabulary;
}

export interface FormatPrecisionVocabularyBundle {
  readonly decimalPrecision: DecimalPrecisionVocabulary;
  readonly roundingMode: RoundingModeVocabulary;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function parseRoundingModeAtIngress(value: unknown): RoundingModeVocabulary {
  try {
    return parseUnknownRoundingModeVocabulary(value);
  } catch {
    throw new ApiRouteError("validation_failed", "Invalid rounding mode.", {
      field: "roundingMode",
    });
  }
}

function parseDecimalPrecisionAtIngress(
  value: unknown
): DecimalPrecisionVocabulary {
  try {
    return parseUnknownDecimalPrecisionVocabulary(value);
  } catch {
    throw new ApiRouteError("validation_failed", "Invalid decimal precision.", {
      field: "decimalPrecision",
    });
  }
}

export function parseCompanyFormatPrecisionSettingsAtIngress(
  value: unknown
): FormatPrecisionVocabularyBundle {
  if (!isRecord(value)) {
    throw new ApiRouteError(
      "validation_failed",
      "Invalid company format precision settings.",
      { field: "companyFormatPrecisionSettings" }
    );
  }

  return {
    roundingMode: parseRoundingModeAtIngress(value["roundingMode"]),
    decimalPrecision: parseDecimalPrecisionAtIngress(value["decimalPrecision"]),
  };
}
