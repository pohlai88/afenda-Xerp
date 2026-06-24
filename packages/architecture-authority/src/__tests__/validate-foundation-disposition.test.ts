import { describe, expect, it } from "vitest";

import { validateFoundationDisposition } from "../validators/validate-foundation-disposition.js";

describe("validateFoundationDisposition", () => {
  it("passes for the seeded foundation disposition registry", () => {
    const result = validateFoundationDisposition();
    expect(result.ok).toBe(true);
    expect(result.violations).toEqual([]);
  });

  it("passes when an allowed agent is assigned to a red-lane entry", () => {
    const result = validateFoundationDisposition({
      agentId: "erp-app-agent",
      entryId: "PKG007_ADMIN",
    });
    expect(result.ok).toBe(true);
  });

  it("fails when an agent is not listed in allowedAgents", () => {
    const result = validateFoundationDisposition({
      agentId: "unauthorized-agent",
      entryId: "PKG007_ADMIN",
    });
    expect(result.ok).toBe(false);
    expect(
      result.violations.some((v) => v.message.includes("allowedAgents"))
    ).toBe(true);
  });
});
