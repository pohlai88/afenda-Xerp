import type {
  DateFormat,
  LocaleCode,
  NumberFormat,
  TimezoneId,
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
