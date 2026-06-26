import { describe, expect, it } from "vitest";

import {
  buildDefaultTenantAppearanceSettings,
  parseTenantAppearanceSettings,
  tenantAppearanceSettingsSchema,
} from "../tenant-settings/tenant-settings.contract.js";

describe("tenantAppearanceSettingsSchema", () => {
  it("accepts a valid appearance payload", () => {
    const parsed = tenantAppearanceSettingsSchema.safeParse({
      enabled: true,
      headline: "Welcome back",
      logoObjectId: "550e8400-e29b-41d4-a716-446655440000",
      primaryColor: "#324038",
      productLabel: "Acme ERP",
      supportingText: "Secure access for your team.",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid primary color", () => {
    const parsed = tenantAppearanceSettingsSchema.safeParse({
      enabled: true,
      headline: "Welcome back",
      logoObjectId: null,
      primaryColor: "red",
      productLabel: "Acme ERP",
      supportingText: "",
    });

    expect(parsed.success).toBe(false);
  });
});

describe("parseTenantAppearanceSettings", () => {
  it("returns null for invalid stored json", () => {
    expect(parseTenantAppearanceSettings({ enabled: "yes" })).toBeNull();
  });
});

describe("buildDefaultTenantAppearanceSettings", () => {
  it("seeds disabled defaults from tenant name", () => {
    const defaults = buildDefaultTenantAppearanceSettings({
      productLabel: "Northwind",
    });

    expect(defaults.enabled).toBe(false);
    expect(defaults.productLabel).toBe("Northwind");
    expect(defaults.logoObjectId).toBeNull();
  });
});
