import { describe, expect, it } from "vitest";

import { findResendEmailAdvisories } from "../../env-utils.mjs";

describe("findResendEmailAdvisories", () => {
  it("warns when API key is set without from-address", () => {
    const advisories = findResendEmailAdvisories(
      new Map([["AFENDA_AUTH_EMAIL_API_KEY", "re_test_key"]])
    );

    expect(
      advisories.some((entry) => entry.includes("AFENDA_AUTH_EMAIL_FROM"))
    ).toBe(true);
  });

  it("warns when webhook secret is missing for configured email", () => {
    const advisories = findResendEmailAdvisories(
      new Map([
        ["AFENDA_AUTH_EMAIL_API_KEY", "re_test_key"],
        ["AFENDA_AUTH_EMAIL_FROM", "Afenda ERP <auth@example.com>"],
        ["BETTER_AUTH_URL", "https://erp.example.com"],
      ])
    );

    expect(
      advisories.some((entry) => entry.includes("AFENDA_RESEND_WEBHOOK_SECRET"))
    ).toBe(true);
    expect(
      advisories.some((entry) =>
        entry.includes("https://erp.example.com/api/webhooks/resend")
      )
    ).toBe(true);
    expect(advisories.some((entry) => entry.includes("Vercel"))).toBe(true);
  });

  it("returns a local-dev advisory when auth email env is unset", () => {
    const advisories = findResendEmailAdvisories(new Map());

    expect(advisories).toEqual([
      "P2: AFENDA_AUTH_EMAIL_API_KEY and AFENDA_AUTH_EMAIL_FROM unset — verify, reset, invite, and 2FA OTP emails no-op in local dev (ARCH-EMAIL-001)",
    ]);
  });

  it("warns when RESEND_API_KEY is missing for dev MCP", () => {
    const advisories = findResendEmailAdvisories(
      new Map([["AFENDA_AUTH_EMAIL_API_KEY", "re_test_key"]])
    );

    expect(advisories.some((entry) => entry.includes("RESEND_API_KEY"))).toBe(
      true
    );
  });
});
