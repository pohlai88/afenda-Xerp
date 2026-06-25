import { describe, expect, it } from "vitest";

import {
  defaultUserDisplayPreferences,
  parseUserDisplayPreferences,
  parseUserNotificationsPreferences,
  userDisplayPreferencesSchema,
  userNotificationsPreferencesSchema,
} from "../user-preferences.contract.js";

describe("user-preferences contract", () => {
  it("parses valid display preferences", () => {
    const parsed = parseUserDisplayPreferences({
      density: "compact",
      locale: "de",
      theme: "dark",
      timezone: "Europe/Berlin",
    });

    expect(parsed).toEqual({
      density: "compact",
      locale: "de",
      theme: "dark",
      timezone: "Europe/Berlin",
    });
  });

  it("returns null for invalid display preferences", () => {
    expect(parseUserDisplayPreferences({ theme: "invalid" })).toBeNull();
  });

  it("parses valid notifications preferences", () => {
    const payload = {
      browserItems: [],
      daysOff: [],
      dndEnabled: false,
      fromTime: "22:00",
      inboxItems: [],
      playSoundOnBlink: true,
      sections: [],
      toTime: "07:00",
    };

    expect(parseUserNotificationsPreferences(payload)).toEqual(payload);
    expect(userNotificationsPreferencesSchema.safeParse(payload).success).toBe(
      true
    );
  });

  it("exposes serializable default display preferences", () => {
    expect(
      userDisplayPreferencesSchema.safeParse(defaultUserDisplayPreferences)
        .success
    ).toBe(true);
    expect(defaultUserDisplayPreferences.locale).toBe("en");
  });
});
