import { describe, expect, it } from "vitest";

import { SYSTEM_ADMIN_NOTIFICATION_SECTIONS } from "@/lib/system-admin/system-admin-settings-blocks.contract";

import {
  buildDefaultUserNotificationsSettings,
  USER_NOTIFICATION_SECTIONS,
} from "../user-settings-blocks.contract";

describe("user-settings-blocks.contract", () => {
  it("uses notification section ids distinct from system admin (AC-U06)", () => {
    const adminSectionIds = SYSTEM_ADMIN_NOTIFICATION_SECTIONS.map(
      (section) => section.id
    );
    const userSectionIds = USER_NOTIFICATION_SECTIONS.map(
      (section) => section.id
    );

    for (const userSectionId of userSectionIds) {
      expect(adminSectionIds).not.toContain(userSectionId);
    }

    expect(userSectionIds).toEqual(["your-activity", "digests"]);
    expect(adminSectionIds).toEqual(["users-team", "api-integrations"]);
  });

  it("buildDefaultUserNotificationsSettings satisfies user notifications shape", () => {
    const defaults = buildDefaultUserNotificationsSettings();

    expect(defaults.sections).toHaveLength(2);
    expect(defaults.inboxItems.length).toBeGreaterThan(0);
    expect(defaults.browserItems.length).toBeGreaterThan(0);
    expect(defaults.dndEnabled).toBe(false);
    expect(defaults.daysOff).toEqual(["saturday", "sunday"]);
  });
});
