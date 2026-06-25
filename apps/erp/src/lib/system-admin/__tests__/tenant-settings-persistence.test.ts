import {
  tenantBillingSettingsSchema,
  tenantIntegrationsSettingsSchema,
  tenantNotificationsSettingsSchema,
  tenantWorkspaceSettingsSchema,
} from "@afenda/database";
import { describe, expect, it } from "vitest";

import {
  buildDefaultBillingSettings,
  buildDefaultIntegrationsSettings,
} from "../resolve-tenant-settings.server";

describe("tenant settings contracts", () => {
  it("accepts default notifications payload shape", () => {
    const defaults = tenantNotificationsSettingsSchema.parse({
      sections: [],
      inboxItems: [],
      browserItems: [],
      playSoundOnBlink: false,
      dndEnabled: false,
      fromTime: "01:30",
      toTime: "02:30",
      daysOff: ["saturday"],
    });

    expect(defaults.daysOff).toEqual(["saturday"]);
  });

  it("accepts default workspace payload shape", () => {
    const defaults = tenantWorkspaceSettingsSchema.parse({
      workspaceName: "Acme",
      timezone: "UTC",
      slug: "",
      description: "",
      urlSuffix: "",
    });

    expect(defaults.workspaceName).toBe("Acme");
  });

  it("accepts default billing payload from ERP builder", () => {
    const defaults = tenantBillingSettingsSchema.parse(
      buildDefaultBillingSettings()
    );

    expect(defaults.spendEnabled).toBe(true);
    expect(defaults.addOns.length).toBeGreaterThan(0);
  });

  it("accepts default integrations payload from ERP builder", () => {
    const defaults = tenantIntegrationsSettingsSchema.parse(
      buildDefaultIntegrationsSettings()
    );

    expect(defaults.communication.apps.length).toBeGreaterThan(0);
    expect(defaults.planning.apps.length).toBeGreaterThan(0);
    expect(defaults.tools.apps.length).toBeGreaterThan(0);
  });
});
