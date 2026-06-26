import { describe, expect, it } from "vitest";

import { companies } from "../schema/company.schema.js";

describe("company schema MFA override", () => {
  it("maps nullable company MFA override column", () => {
    expect(companies.mfaRequiredOverride.name).toBe("mfa_required_override");
  });
});
