import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY } from "@/lib/context/operating-context-protected-surface.registry";
import {
  USER_SETTINGS_MUTATION_AUDIT_COVERAGE_TEST,
  USER_SETTINGS_SERVER_ACTION_MUTATION_AUDIT_ENTRIES,
} from "@/lib/user-settings/user-settings-audit.registry";
import { USER_SETTINGS_TABS } from "@/lib/user-settings/user-settings-tabs.contract";

const appSrcRoot = join(import.meta.dirname, "..");

const USER_SETTINGS_TAB_PAGES = [
  {
    tab: "profile",
    route: "/settings/profile",
    pagePath: "app/(protected)/settings/profile/page.tsx",
  },
  {
    tab: "security",
    route: "/settings/security",
    pagePath: "app/(protected)/settings/security/page.tsx",
  },
  {
    tab: "notifications",
    route: "/settings/notifications",
    pagePath: "app/(protected)/settings/notifications/page.tsx",
  },
  {
    tab: "preferences",
    route: "/settings/preferences",
    pagePath: "app/(protected)/settings/preferences/page.tsx",
  },
] as const;

function readAppSource(relativePath: string): string {
  return readFileSync(join(appSrcRoot, relativePath), "utf8");
}

describe("ARCH-USER-001 user settings integration", () => {
  describe("AC-U01 — four v1 tab routes exist", () => {
    it("USER_SETTINGS_TABS contract lists profile, security, notifications, preferences", () => {
      expect(USER_SETTINGS_TABS).toHaveLength(4);
      expect(USER_SETTINGS_TABS.map((tab) => tab.href)).toEqual([
        "/settings/profile",
        "/settings/security",
        "/settings/notifications",
        "/settings/preferences",
      ]);
    });

    for (const { tab, route, pagePath } of USER_SETTINGS_TAB_PAGES) {
      it(`${tab} tab page exists at ${route}`, () => {
        const source = readAppSource(pagePath);

        expect(source).toContain("export default");
        expect(source).toMatch(/async function|function UserSettings/);
      });
    }

    it("settings index redirects to profile tab", () => {
      const source = readAppSource("app/(protected)/settings/page.tsx");

      expect(source).toContain('redirect("/settings/profile")');
    });
  });

  describe("AC-U02 — linked session required via layout guard", () => {
    it("settings layout calls resolveUserSettingsOperatingContext", () => {
      const source = readAppSource("app/(protected)/settings/layout.tsx");

      expect(source).toContain("resolveUserSettingsOperatingContext");
      expect(source).toContain('contextResult.kind === "redirect"');
      expect(source).toContain("redirect(contextResult.href)");
      expect(source).toContain('contextResult.kind === "forbidden"');
    });

    it("unlinked session redirect contract lives in resolve-user-settings-context.server.ts", () => {
      const source = readAppSource(
        "lib/user-settings/resolve-user-settings-context.server.ts"
      );

      expect(source).toContain("isAfendaAuthSessionLinked");
      expect(source).toContain('href: "/sign-in?error=unlinked"');
      expect(source).toContain('href: "/sign-in"');
    });
  });

  describe("AC-U03 — self-only mutation scope via operating context", () => {
    it("mutation audit coverage test path is declared in registry", () => {
      expect(USER_SETTINGS_MUTATION_AUDIT_COVERAGE_TEST).toBe(
        "apps/erp/src/lib/user-settings/__tests__/user-settings-mutation-audit-coverage.test.ts"
      );
    });

    for (const entry of USER_SETTINGS_SERVER_ACTION_MUTATION_AUDIT_ENTRIES) {
      it(`${entry.id} resolves operating context and scopes actorUserId from operatingContext.actor.userId`, () => {
        const relativePath = entry.actionModule.replace("apps/erp/src/", "");
        const source = readAppSource(relativePath);

        expect(source).toContain("resolveActionOperatingContext");
        expect(source).toContain("operatingContext.actor.userId");
        expect(source).not.toMatch(/session\.user\.id/);
        expect(source).not.toMatch(/session\.user\.userId/);
      });
    }
  });

  describe("operating-context protected surface registry — user settings", () => {
    it("includes user-settings-context and user-settings-layout entries", () => {
      const surfaceIds = OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY.map(
        (entry) => entry.id
      );

      expect(surfaceIds).toEqual(
        expect.arrayContaining([
          "user-settings-context",
          "user-settings-layout",
        ])
      );
    });

    it("user-settings-context delegates to resolveOperatingContextFromHeaders", () => {
      const contextSurface = OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY.find(
        (entry) => entry.id === "user-settings-context"
      );

      expect(contextSurface?.module).toBe(
        "lib/user-settings/resolve-user-settings-context.server.ts"
      );
      expect(contextSurface?.delegate).toBe(
        "resolveOperatingContextFromHeaders"
      );
    });

    it("user-settings-layout delegates to resolveUserSettingsOperatingContext", () => {
      const layoutSurface = OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY.find(
        (entry) => entry.id === "user-settings-layout"
      );

      expect(layoutSurface?.module).toBe("app/(protected)/settings/layout.tsx");
      expect(layoutSurface?.delegate).toBe(
        "resolveUserSettingsOperatingContext"
      );

      const layoutSource = readAppSource("app/(protected)/settings/layout.tsx");
      expect(layoutSource).toContain("resolveUserSettingsOperatingContext");
    });
  });
});
