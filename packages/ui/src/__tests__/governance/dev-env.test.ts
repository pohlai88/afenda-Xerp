import { afterEach, describe, expect, it, vi } from "vitest";

describe("governance runtime mode (dev-env)", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  it("defaults to strict in unit-test context", async () => {
    delete process.env["AFENDA_GOVERNANCE_RUNTIME"];
    delete process.env["VITEST_STORYBOOK"];
    process.env["NODE_ENV"] = "test";

    const { getGovernanceRuntimeMode, shouldEnforceGovernanceRuntime } =
      await import("../../governance/dev-env");

    expect(getGovernanceRuntimeMode()).toBe("strict");
    expect(shouldEnforceGovernanceRuntime()).toBe(true);
  });

  it("honours AFENDA_GOVERNANCE_RUNTIME=off", async () => {
    process.env["AFENDA_GOVERNANCE_RUNTIME"] = "off";
    process.env["NODE_ENV"] = "test";

    const { getGovernanceRuntimeMode, shouldEnforceGovernanceRuntime } =
      await import("../../governance/dev-env");

    expect(getGovernanceRuntimeMode()).toBe("off");
    expect(shouldEnforceGovernanceRuntime()).toBe(false);
  });

  it("honours VITEST_STORYBOOK without explicit runtime override", async () => {
    delete process.env["AFENDA_GOVERNANCE_RUNTIME"];
    process.env["VITEST_STORYBOOK"] = "true";
    process.env["NODE_ENV"] = "test";

    const { getGovernanceRuntimeMode, shouldEnforceGovernanceRuntime } =
      await import("../../governance/dev-env");

    expect(getGovernanceRuntimeMode()).toBe("off");
    expect(shouldEnforceGovernanceRuntime()).toBe(false);
  });
});
