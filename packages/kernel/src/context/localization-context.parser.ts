import {
  parseDateFormat,
  parseLocaleCode,
  parseNumberFormat,
  parseTimezoneId,
  toDateFormat,
  toLocaleCode,
  toNumberFormat,
  toTimezoneId,
} from "../identity/primitives/index.js";
import { assertWireLocalizationContext } from "./localization-context.assert.js";
import type {
  LocalizationContext,
  WireLocalizationContext,
} from "./localization-context.contract.js";

function parseValidatedLocalizationContext(
  wire: WireLocalizationContext
): LocalizationContext {
  return {
    localeCode: parseLocaleCode(wire.localeCode),
    timezoneId: parseTimezoneId(wire.timezoneId),
    dateFormat: parseDateFormat(wire.dateFormat),
    numberFormat: parseNumberFormat(wire.numberFormat),
  };
}

export function parseLocalizationContext(
  wire: WireLocalizationContext
): LocalizationContext {
  assertWireLocalizationContext(wire);
  return parseValidatedLocalizationContext(wire);
}

/** JSON/API ingress — assert unknown wire, then brand primitives. */
export function parseUnknownLocalizationContext(
  value: unknown
): LocalizationContext {
  assertWireLocalizationContext(value);
  return parseValidatedLocalizationContext(value);
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
