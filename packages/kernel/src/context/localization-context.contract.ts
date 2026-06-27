import {
  type DateFormat,
  type LocaleCode,
  type NumberFormat,
  parseDateFormat,
  parseLocaleCode,
  parseNumberFormat,
  parseTimezoneId,
  type TimezoneId,
  toDateFormat,
  toLocaleCode,
  toNumberFormat,
  toTimezoneId,
} from "../identity/primitives/index.js";

/** Serializable localization vocabulary — shape only; no resolver or formatting runtime. */
export interface LocalizationContext {
  readonly dateFormat: DateFormat;
  readonly localeCode: LocaleCode;
  readonly numberFormat: NumberFormat;
  readonly timezoneId: TimezoneId;
}

/** Wire-format alias — plain string fields, JSON-serializable at rest. */
export interface WireLocalizationContext {
  readonly dateFormat: string;
  readonly localeCode: string;
  readonly numberFormat: string;
  readonly timezoneId: string;
}

type JsonPrimitive = string | number | boolean | null;

type AssertJsonSerializable<T> = T extends JsonPrimitive
  ? true
  : T extends readonly (infer U)[]
    ? AssertJsonSerializable<U>
    : T extends object
      ? {
          [K in keyof T]: AssertJsonSerializable<T[K]>;
        } extends Record<keyof T, true>
        ? true
        : false
      : false;

type _LocalizationWireSerializable =
  AssertJsonSerializable<WireLocalizationContext>;

/** Compile-time guard — localization wire context must remain JSON-serializable. */
export type assertLocalizationContextWireSerializable =
  _LocalizationWireSerializable extends true ? true : never;

export function parseLocalizationContext(
  wire: WireLocalizationContext
): LocalizationContext {
  return {
    localeCode: parseLocaleCode(wire.localeCode),
    timezoneId: parseTimezoneId(wire.timezoneId),
    dateFormat: parseDateFormat(wire.dateFormat),
    numberFormat: parseNumberFormat(wire.numberFormat),
  };
}

export function serializeLocalizationContext(
  context: LocalizationContext
): WireLocalizationContext {
  return {
    localeCode: toLocaleCode(context.localeCode),
    timezoneId: toTimezoneId(context.timezoneId),
    dateFormat: toDateFormat(context.dateFormat),
    numberFormat: toNumberFormat(context.numberFormat),
  };
}
