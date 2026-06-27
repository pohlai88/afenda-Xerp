import type {
  DateFormat,
  LocaleCode,
  NumberFormat,
  TimezoneId,
} from "../identity/index.js";

/** Serializable localization vocabulary — shape only; no resolver or formatting runtime. */
export interface LocalizationContext {
  readonly dateFormat: DateFormat;
  readonly localeCode: LocaleCode;
  readonly numberFormat: NumberFormat;
  readonly timezoneId: TimezoneId;
}
