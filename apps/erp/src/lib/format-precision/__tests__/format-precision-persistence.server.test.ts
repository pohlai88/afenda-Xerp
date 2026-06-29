import { describe, expect, it } from "vitest";

import { ApiRouteError } from "@/server/api/runtime/api-validation";

import { persistCompanyFormatPrecisionSettings } from "../persist-company-format-precision-settings.server";

describe("persistCompanyFormatPrecisionSettings", () => {
  it("returns wire-safe company format defaults for persistence", () => {
    const result = persistCompanyFormatPrecisionSettings({
      roundingMode: { mode: "half_even" },
      decimalPrecision: { scale: 4 },
    });

    expect(result.companyFormatDefaults).toEqual({
      roundingMode: { mode: "half_even" },
      decimalPrecision: { scale: 4 },
    });
    expect(JSON.parse(JSON.stringify(result.companyFormatDefaults))).toEqual(
      result.companyFormatDefaults
    );
  });

  it("fails closed on invalid company format settings", () => {
    expect(() =>
      persistCompanyFormatPrecisionSettings({
        roundingMode: { mode: "half_up" },
        decimalPrecision: { scale: 2.5 },
      })
    ).toThrow(ApiRouteError);
  });
});
