import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { resolveAppShellProfileMenuGroups } from "@/lib/user-settings/resolve-app-shell-profile-menu-groups";
import { USER_SETTINGS_SERVER_ACTION_MUTATION_AUDIT_ENTRIES } from "@/lib/user-settings/user-settings-audit.registry";

const appSrcRoot = join(import.meta.dirname, "..");

const USER_SETTINGS_ROUTE_SOURCES = [
  "app/(protected)/settings/layout.tsx",
  "app/(protected)/settings/page.tsx",
  "app/(protected)/settings/profile/page.tsx",
  "app/(protected)/settings/security/page.tsx",
  "app/(protected)/settings/notifications/page.tsx",
  "app/(protected)/settings/preferences/page.tsx",
] as const;

const PROFILE_MENU_HREF_EXPECTATIONS = {
  "profile-my-profile": "/settings/profile",
  "profile-preferences": "/settings/preferences",
  "profile-company-plan": "/system-admin/settings/billing",
  "profile-erp-users": "/system-admin/settings/members",
  "profile-appearance": "/settings/preferences",
  "profile-add-user": "/system-admin/settings/members",
} as const satisfies Record<string, string>;

const TENANT_SETTINGS_MUTATION_PATTERN =
  /tenant_settings|tenantSettings|updateTenant|executeTenantSettings|tenants\./;

function readAppSource(relativePath: string): string {
  return readFileSync(join(appSrcRoot, relativePath), "utf8");
}

describe("ARCH-USER-001 acceptance criteria", () => {
  describe("GIVEN profile dropdown WHEN resolveAppShellProfileMenuGroups THEN ARCH §5.7 href map (AC-U08, AC-U14)", () => {
    it("PROFILE_MENU_HREFS source matches the canonical entry map", () => {
      const source = readAppSource(
        "lib/user-settings/resolve-app-shell-profile-menu-groups.ts"
      );

      expect(source).toContain("PROFILE_MENU_HREFS");

      for (const [itemId, href] of Object.entries(
        PROFILE_MENU_HREF_EXPECTATIONS
      )) {
        expect(source).toContain(`"${itemId}": "${href}"`);
      }
    });

    it("resolved menu groups wire self-service and admin routes scope-correctly", () => {
      const groups = resolveAppShellProfileMenuGroups();
      const items = groups.flatMap((group) => group.items);

      for (const [itemId, href] of Object.entries(
        PROFILE_MENU_HREF_EXPECTATIONS
      )) {
        const item = items.find((entry) => entry.id === itemId);
        expect(item?.href).toBe(href);
      }
    });

    it("appearance routes to user preferences rather than admin appearance", () => {
      const groups = resolveAppShellProfileMenuGroups();
      const adminItems = groups.find((group) => group.id === "admin")?.items;
      const appearance = adminItems?.find(
        (item) => item.id === "profile-appearance"
      );

      expect(appearance?.href).toBe("/settings/preferences");
      expect(appearance?.href).not.toBe("/system-admin/settings/appearance");
    });
  });

  describe("GIVEN user settings routes WHEN static source audit THEN no admin permission gates (AC-U11)", () => {
    for (const relativePath of USER_SETTINGS_ROUTE_SOURCES) {
      it(`${relativePath} never imports guardSystemAdminSection or system_admin permissions`, () => {
        const source = readAppSource(relativePath);

        expect(source).not.toContain("guardSystemAdminSection");
        expect(source).not.toMatch(/system_admin\./);
        expect(source).not.toMatch(/PERMISSION_REGISTRY\.systemAdmin/);
      });
    }
  });

  describe("GIVEN user-settings mutation actions WHEN static source audit THEN no tenant settings writes (AC-U12)", () => {
    for (const entry of USER_SETTINGS_SERVER_ACTION_MUTATION_AUDIT_ENTRIES) {
      it(`${entry.actionModule} never imports tenant_settings or tenant table mutations`, () => {
        const relativePath = entry.actionModule.replace("apps/erp/src/", "");
        const source = readAppSource(relativePath);

        expect(source).not.toMatch(TENANT_SETTINGS_MUTATION_PATTERN);
        expect(source).not.toContain("guardSystemAdminSection");
      });
    }
  });
});
