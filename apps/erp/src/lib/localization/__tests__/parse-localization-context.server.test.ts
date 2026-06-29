import { describe, expect, it } from "vitest";

import { ApiRouteError } from "@/server/api/runtime/api-validation";

import {
  parseCompanyLocalizationSettingsAtIngress,
  parseUserLocalizationPreferencesAtIngress,
} from "../parse-localization-context.server";

const VALID_USER_WIRE = {
  locale: "en-GB",
  timezone: "Europe/London",
  dateFormat: "dd/MM/yyyy",
  numberFormat: "#,##0.##",
} as const;

const VALID_COMPANY_WIRE = {
  localeCode: "en-GB",
  timezoneId: "Europe/London",
  dateFormat: "dd/MM/yyyy",
  numberFormat: "#,##0.##",
} as const;

describe("parseUserLocalizationPreferencesAtIngress", () => {
  it("accepts user settings wire and brands kernel localization context", () => {
    const context = parseUserLocalizationPreferencesAtIngress(VALID_USER_WIRE);

    expect(context.localeCode).toBe("en-GB");
    expect(context.timezoneId).toBe("Europe/London");
    expect(context.dateFormat).toBe("dd/MM/yyyy");
    expect(context.numberFormat).toBe("#,##0.##");
  });

  it("rejects UTC offset timezone values", () => {
    expect(() =>
      parseUserLocalizationPreferencesAtIngress({
        ...VALID_USER_WIRE,
        timezone: "+07:00",
      })
    ).toThrow(ApiRouteError);
  });

  it("rejects non-object ingress", () => {
    expect(() => parseUserLocalizationPreferencesAtIngress(null)).toThrow(
      ApiRouteError
    );
  });

  it("rejects missing locale field", () => {
    expect(() =>
      parseUserLocalizationPreferencesAtIngress({
        timezone: "UTC",
        dateFormat: "yyyy-MM-dd",
        numberFormat: "#,##0.00",
      })
    ).toThrow(ApiRouteError);
  });
});

describe("parseCompanyLocalizationSettingsAtIngress", () => {
  it("accepts kernel-aligned company settings wire", () => {
    const context =
      parseCompanyLocalizationSettingsAtIngress(VALID_COMPANY_WIRE);

    expect(context.localeCode).toBe("en-GB");
    expect(context.timezoneId).toBe("Europe/London");
  });

  it("rejects canonical enterprise id as localeCode", () => {
    expect(() =>
      parseCompanyLocalizationSettingsAtIngress({
        ...VALID_COMPANY_WIRE,
        localeCode: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(ApiRouteError);
  });
});
