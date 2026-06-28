import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { IDENTITY_MODULE_PRIMITIVE_FILES } from "../../governance/identity-module-layout.contract.js";
import {
  PRIMITIVE_REFERENCE_COUNT,
  PRIMITIVE_REFERENCE_KEYS,
  PRIMITIVE_REFERENCE_TYPE_NAMES,
  PRIMITIVE_REFERENCES,
  parseCountryCode,
  parseCurrencyCode,
  parseDateFormat,
  parseLocaleCode,
  parseNumberFormat,
  parseTimezoneId,
  parseUomCode,
} from "../index.js";
import {
  TENANT_HUMAN_REFERENCE_PATTERN,
  TENANT_HUMAN_REFERENCE_PATTERN_SOURCE,
} from "../primitive-brand.helpers.js";

const primitiveDir = fileURLToPath(new URL("../", import.meta.url));

const PRIMITIVE_CONTRACT_FILES = IDENTITY_MODULE_PRIMITIVE_FILES.filter(
  (fileName) =>
    fileName.endsWith(".contract.ts") &&
    fileName !== "primitive-brand.contract.ts"
);

describe("primitive references (PAS-001 §4.1.5 / Slice B4–B5)", () => {
  it("registers seven primitive references outside ID_FAMILIES", () => {
    expect(PRIMITIVE_REFERENCE_COUNT).toBe(7);
    expect(PRIMITIVE_REFERENCE_KEYS).toHaveLength(7);
    expect(PRIMITIVE_REFERENCE_TYPE_NAMES).toEqual([
      "LocaleCode",
      "TimezoneId",
      "DateFormat",
      "NumberFormat",
      "CurrencyCode",
      "CountryCode",
      "UomCode",
    ]);
    expect(Object.keys(PRIMITIVE_REFERENCES)).toHaveLength(7);
  });

  it("accepts uppercase currency code", () => {
    expect(() => parseCurrencyCode("MYR")).not.toThrow();
    expect(parseCurrencyCode("MYR")).toBe("MYR");
  });

  it("normalizes lowercase currency code", () => {
    expect(parseCurrencyCode("myr")).toBe("MYR");
  });

  it("rejects canonical enterprise ID as currency code", () => {
    expect(() => parseCurrencyCode("cus_01ARZ3NDEKTSV4RRFFQ69G5FAV")).toThrow(
      /canonical enterprise ID/i
    );
  });

  it("accepts country code", () => {
    expect(parseCountryCode("my")).toBe("MY");
  });

  it("rejects tenant human reference as country code", () => {
    expect(() => parseCountryCode("EMP-000123")).toThrow(
      /tenant human reference/i
    );
  });

  it("accepts IANA-style timezone ID", () => {
    expect(() => parseTimezoneId("Asia/Ho_Chi_Minh")).not.toThrow();
    expect(parseTimezoneId("UTC")).toBe("UTC");
  });

  it("rejects non-IANA-style timezone without slash", () => {
    expect(() => parseTimezoneId("KualaLumpur")).toThrow(
      /IANA-style timezone ID/i
    );
  });

  it("rejects UTC offset as timezoneId", () => {
    expect(() => parseTimezoneId("+07:00")).toThrow(/UTC offset/i);
    expect(() => parseTimezoneId("-05:00")).toThrow(/UTC offset/i);
  });

  it("registers brandOptionalFunction for nullable primitive ingress", () => {
    expect(PRIMITIVE_REFERENCES.currencyCode.brandOptionalFunction).toBe(
      "brandCurrencyCode"
    );
    expect(PRIMITIVE_REFERENCES.countryCode.brandOptionalFunction).toBe(
      "brandCountryCode"
    );
    expect(PRIMITIVE_REFERENCES.uomCode.brandOptionalFunction).toBe(
      "brandUomCode"
    );
    expect(PRIMITIVE_REFERENCES.localeCode.brandOptionalFunction).toBeNull();
  });

  it("accepts BCP47-style locale code", () => {
    expect(parseLocaleCode("en-US")).toBe("en-US");
    expect(parseLocaleCode("zh-Hans")).toBe("zh-Hans");
  });

  it("accepts approved date and number format patterns", () => {
    expect(parseDateFormat("yyyy-MM-dd")).toBe("yyyy-MM-dd");
    expect(parseNumberFormat("#,##0.00")).toBe("#,##0.00");
  });

  it("accepts uppercase UOM code", () => {
    expect(parseUomCode("kg")).toBe("KG");
    expect(parseUomCode("PCS")).toBe("PCS");
  });

  it("serializes all seven primitive types as JSON strings", () => {
    const samples = [
      { branded: parseLocaleCode("en-US"), wire: "en-US" },
      { branded: parseTimezoneId("UTC"), wire: "UTC" },
      { branded: parseDateFormat("yyyy-MM-dd"), wire: "yyyy-MM-dd" },
      { branded: parseNumberFormat("#,##0.00"), wire: "#,##0.00" },
      { branded: parseCurrencyCode("MYR"), wire: "MYR" },
      { branded: parseCountryCode("my"), wire: "MY" },
      { branded: parseUomCode("kg"), wire: "KG" },
    ];

    for (const { branded, wire } of samples) {
      expect(JSON.stringify(branded)).toBe(JSON.stringify(wire));
      expect(JSON.parse(JSON.stringify(branded))).toBe(wire);
    }
  });

  it("does not import parseCanonicalId or ID_FAMILIES in primitive contracts", () => {
    for (const fileName of PRIMITIVE_CONTRACT_FILES) {
      const source = readFileSync(join(primitiveDir, fileName), "utf8");
      expect(source).not.toMatch(/\bparseCanonicalId\b/);
      expect(source).not.toMatch(/\bID_FAMILIES\b/);
    }
  });

  it("freezes tenant human reference pattern source for governance parity", () => {
    expect(TENANT_HUMAN_REFERENCE_PATTERN.source).toBe(
      TENANT_HUMAN_REFERENCE_PATTERN_SOURCE
    );
    expect(TENANT_HUMAN_REFERENCE_PATTERN.test("EMP-000123")).toBe(true);
  });
});
