import { describe, expect, it } from "vitest";

import {
  assertLocalizationText,
  assertWireLocalizationContext,
} from "../localization-context.assert.js";
import type {
  LocalizationContext,
  WireLocalizationContext,
} from "../localization-context.contract.js";
import {
  parseLocalizationContext,
  parseUnknownLocalizationContext,
  serializeLocalizationContext,
} from "../localization-context.parser.js";

const VALID_WIRE: WireLocalizationContext = {
  localeCode: "en-GB",
  timezoneId: "Europe/London",
  dateFormat: "dd/MM/yyyy",
  numberFormat: "#,##0.##",
};

describe("localization context wire triad (PAS-001 §4.4)", () => {
  it("parses valid wire and round-trips through serialize", () => {
    const context = parseLocalizationContext(VALID_WIRE);

    expect(serializeLocalizationContext(context)).toEqual(VALID_WIRE);
  });

  it("parses unknown JSON ingress via parseUnknownLocalizationContext", () => {
    const context = parseUnknownLocalizationContext(
      structuredClone(VALID_WIRE) as unknown
    );

    expect(context.localeCode).toBe(VALID_WIRE.localeCode);
  });

  it("serializes trusted context to plain strings", () => {
    const context: LocalizationContext = parseLocalizationContext(VALID_WIRE);
    const wire = serializeLocalizationContext(context);

    expect(JSON.parse(JSON.stringify(wire))).toEqual(wire);
  });

  it("rejects non-object wire before branding", () => {
    expect(() => assertWireLocalizationContext(null)).toThrow(
      /must be an object/i
    );
    expect(() => assertWireLocalizationContext("en-GB")).toThrow(
      /must be an object/i
    );
  });

  it("rejects wire with missing string fields before branding", () => {
    expect(() =>
      assertWireLocalizationContext({ ...VALID_WIRE, localeCode: 42 })
    ).toThrow(/localeCode must be a string/i);
  });

  it("rejects whitespace-only wire fields before branding", () => {
    expect(() => assertLocalizationText("   ", "localeCode")).toThrow(
      /localeCode is required/i
    );
    expect(() =>
      assertWireLocalizationContext({ ...VALID_WIRE, dateFormat: "   " })
    ).toThrow(/dateFormat is required/i);
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
    ).toThrow(/localeCode is required/i);
  });
});
