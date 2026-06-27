import { describe, expect, it } from "vitest";

import {
  type LocalizationContext,
  parseLocalizationContext,
  serializeLocalizationContext,
  type WireLocalizationContext,
} from "../localization-context.contract.js";

const VALID_WIRE: WireLocalizationContext = {
  localeCode: "en-GB",
  timezoneId: "Europe/London",
  dateFormat: "dd/MM/yyyy",
  numberFormat: "#,##0.##",
};

describe("localization context (PAS-001 §4.5)", () => {
  it("parses valid wire localization context", () => {
    const context = parseLocalizationContext(VALID_WIRE);

    expect(serializeLocalizationContext(context)).toEqual(VALID_WIRE);
  });

  it("serializes trusted context to plain strings", () => {
    const context: LocalizationContext = parseLocalizationContext(VALID_WIRE);
    const wire = serializeLocalizationContext(context);

    expect(JSON.parse(JSON.stringify(wire))).toEqual(wire);
  });

  it("rejects UTC offset as timezoneId", () => {
    expect(() =>
      parseLocalizationContext({ ...VALID_WIRE, timezoneId: "+07:00" })
    ).toThrow(/UTC offset/i);
  });

  it("rejects canonical enterprise ID as localeCode", () => {
    expect(() =>
      parseLocalizationContext({
        ...VALID_WIRE,
        localeCode: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/canonical enterprise ID/i);
  });

  it("rejects tenant human reference as numberFormat", () => {
    expect(() =>
      parseLocalizationContext({
        ...VALID_WIRE,
        numberFormat: "EMP-000123",
      })
    ).toThrow(/tenant human reference/i);
  });

  it("rejects empty localeCode", () => {
    expect(() =>
      parseLocalizationContext({ ...VALID_WIRE, localeCode: "" })
    ).toThrow(/LocaleCode is required/i);
  });
});
