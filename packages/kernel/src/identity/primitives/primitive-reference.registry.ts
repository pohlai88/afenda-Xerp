/**
 * PAS-001 §4.1.5 — primitive reference registry (separate from ID_FAMILIES).
 *
 * Primitive references are globally shared codes — not canonical enterprise IDs.
 */

export const PRIMITIVE_REFERENCE_COUNT = 7 as const;

export interface PrimitiveReferenceDefinition {
  readonly brandOptionalFunction: string | null;
  readonly normalizeForWireFunction: string;
  readonly owner: "kernel";
  readonly parseFunction: string;
  readonly toFunction: string;
  readonly typeName: string;
}

export const PRIMITIVE_REFERENCES = {
  localeCode: {
    typeName: "LocaleCode",
    owner: "kernel",
    parseFunction: "parseLocaleCode",
    brandOptionalFunction: null,
    toFunction: "toLocaleCode",
    normalizeForWireFunction: "normalizeLocaleCodeForWire",
  },
  timezoneId: {
    typeName: "TimezoneId",
    owner: "kernel",
    parseFunction: "parseTimezoneId",
    brandOptionalFunction: null,
    toFunction: "toTimezoneId",
    normalizeForWireFunction: "normalizeTimezoneIdForWire",
  },
  dateFormat: {
    typeName: "DateFormat",
    owner: "kernel",
    parseFunction: "parseDateFormat",
    brandOptionalFunction: null,
    toFunction: "toDateFormat",
    normalizeForWireFunction: "normalizeDateFormatForWire",
  },
  numberFormat: {
    typeName: "NumberFormat",
    owner: "kernel",
    parseFunction: "parseNumberFormat",
    brandOptionalFunction: null,
    toFunction: "toNumberFormat",
    normalizeForWireFunction: "normalizeNumberFormatForWire",
  },
  currencyCode: {
    typeName: "CurrencyCode",
    owner: "kernel",
    parseFunction: "parseCurrencyCode",
    brandOptionalFunction: "brandCurrencyCode",
    toFunction: "toCurrencyCode",
    normalizeForWireFunction: "normalizeCurrencyCodeForWire",
  },
  countryCode: {
    typeName: "CountryCode",
    owner: "kernel",
    parseFunction: "parseCountryCode",
    brandOptionalFunction: "brandCountryCode",
    toFunction: "toCountryCode",
    normalizeForWireFunction: "normalizeCountryCodeForWire",
  },
  uomCode: {
    typeName: "UomCode",
    owner: "kernel",
    parseFunction: "parseUomCode",
    brandOptionalFunction: "brandUomCode",
    toFunction: "toUomCode",
    normalizeForWireFunction: "normalizeUomCodeForWire",
  },
} as const satisfies Record<string, PrimitiveReferenceDefinition>;

export const PRIMITIVE_REFERENCE_KEYS = [
  "localeCode",
  "timezoneId",
  "dateFormat",
  "numberFormat",
  "currencyCode",
  "countryCode",
  "uomCode",
] as const satisfies readonly (keyof typeof PRIMITIVE_REFERENCES)[];

export type PrimitiveReferenceKey = (typeof PRIMITIVE_REFERENCE_KEYS)[number];

export const PRIMITIVE_REFERENCE_TYPE_NAMES = PRIMITIVE_REFERENCE_KEYS.map(
  (key) => PRIMITIVE_REFERENCES[key].typeName
) as readonly PrimitiveReferenceDefinition["typeName"][];

type _AssertPrimitiveCount =
  (typeof PRIMITIVE_REFERENCE_KEYS)["length"] extends typeof PRIMITIVE_REFERENCE_COUNT
    ? true
    : never;

export function getPrimitiveReferenceDefinition(
  key: PrimitiveReferenceKey
): PrimitiveReferenceDefinition {
  return PRIMITIVE_REFERENCES[key];
}

export function getPrimitiveReferenceDefinitionByTypeName(
  typeName: PrimitiveReferenceDefinition["typeName"]
): PrimitiveReferenceDefinition {
  const entry = PRIMITIVE_REFERENCE_KEYS.find(
    (key) => PRIMITIVE_REFERENCES[key].typeName === typeName
  );

  if (entry === undefined) {
    throw new Error(`Unknown primitive reference type: ${typeName}`);
  }

  return PRIMITIVE_REFERENCES[entry];
}
