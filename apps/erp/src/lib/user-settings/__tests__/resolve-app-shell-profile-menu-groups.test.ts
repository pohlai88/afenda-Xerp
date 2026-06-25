import { describe, expect, it } from "vitest";

import { resolveAppShellProfileMenuGroups } from "../resolve-app-shell-profile-menu-groups";

describe("resolveAppShellProfileMenuGroups", () => {
  it("wires self-service routes for profile and preferences", () => {
    const groups = resolveAppShellProfileMenuGroups();
    const accountItems = groups.find((group) => group.id === "account")?.items;

    expect(accountItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "profile-my-profile",
          href: "/settings/profile",
        }),
        expect.objectContaining({
          id: "profile-preferences",
          href: "/settings/preferences",
        }),
      ])
    );
  });

  it("maps appearance to user preferences rather than admin appearance", () => {
    const groups = resolveAppShellProfileMenuGroups();
    const adminItems = groups.find((group) => group.id === "admin")?.items;
    const appearance = adminItems?.find(
      (item) => item.id === "profile-appearance"
    );

    expect(appearance?.href).toBe("/settings/preferences");
  });
});
