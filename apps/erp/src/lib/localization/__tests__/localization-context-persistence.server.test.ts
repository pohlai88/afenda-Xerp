import { describe, expect, it } from "vitest";

import { ApiRouteError } from "@/server/api/runtime/api-validation";

import { persistCompanyLocalizationSettings } from "../persist-company-localization-settings.server";
import { persistUserLocalizationPreferences } from "../persist-user-localization-preferences.server";

describe("persistUserLocalizationPreferences", () => {
  it("returns wire-safe localization payload for persistence", () => {
    const result = persistUserLocalizationPreferences({
      locale: "de",
      timezone: "Europe/Berlin",
      dateFormat: "dd.MM.yyyy",
      numberFormat: "#,##0.00",
    });

    expect(result.localization).toEqual({
      localeCode: "de",
      timezoneId: "Europe/Berlin",
      dateFormat: "dd.MM.yyyy",
      numberFormat: "#,##0.00",
    });
    expect(JSON.parse(JSON.stringify(result.localization))).toEqual(
      result.localization
    );
  });

  it("fails closed on invalid user preferences", () => {
    expect(() =>
      persistUserLocalizationPreferences({
        locale: "de",
        timezone: "invalid-zone",
        dateFormat: "dd.MM.yyyy",
        numberFormat: "#,##0.00",
      })
    ).toThrow(ApiRouteError);
  });
});

describe("persistCompanyLocalizationSettings", () => {
  it("returns wire-safe company defaults for persistence", () => {
    const result = persistCompanyLocalizationSettings({
      localeCode: "en-US",
      timezoneId: "America/New_York",
      dateFormat: "MM/dd/yyyy",
      numberFormat: "#,##0.00",
    });

    expect(result.companyDefaults).toEqual({
      localeCode: "en-US",
      timezoneId: "America/New_York",
      dateFormat: "MM/dd/yyyy",
      numberFormat: "#,##0.00",
    });
  });
});
