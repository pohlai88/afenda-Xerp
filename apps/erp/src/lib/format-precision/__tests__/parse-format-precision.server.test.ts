import { describe, expect, it } from "vitest";

import { ApiRouteError } from "@/server/api/runtime/api-validation";

import { parseCompanyFormatPrecisionSettingsAtIngress } from "../parse-format-precision.server";

const VALID_COMPANY_WIRE = {
  roundingMode: { mode: "half_up" },
  decimalPrecision: { scale: 2 },
} as const;

describe("parseCompanyFormatPrecisionSettingsAtIngress", () => {
  it("accepts kernel-aligned company format settings wire", () => {
    const vocabulary =
      parseCompanyFormatPrecisionSettingsAtIngress(VALID_COMPANY_WIRE);

    expect(vocabulary.roundingMode.mode).toBe("half_up");
    expect(vocabulary.decimalPrecision.scale).toBe(2);
  });

  it("rejects invalid rounding mode codes", () => {
    expect(() =>
      parseCompanyFormatPrecisionSettingsAtIngress({
        ...VALID_COMPANY_WIRE,
        roundingMode: { mode: "bankers" },
      })
    ).toThrow(ApiRouteError);
  });

  it("rejects decimal scale outside 0–18", () => {
    expect(() =>
      parseCompanyFormatPrecisionSettingsAtIngress({
        ...VALID_COMPANY_WIRE,
        decimalPrecision: { scale: 19 },
      })
    ).toThrow(ApiRouteError);
  });

  it("rejects non-object ingress", () => {
    expect(() => parseCompanyFormatPrecisionSettingsAtIngress(null)).toThrow(
      ApiRouteError
    );
  });

  it("rejects missing roundingMode field", () => {
    expect(() =>
      parseCompanyFormatPrecisionSettingsAtIngress({
        decimalPrecision: { scale: 2 },
      })
    ).toThrow(ApiRouteError);
  });
});
