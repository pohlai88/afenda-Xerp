import { describe, expect, it } from "vitest";

import {
  type AppShellNavGroupWire,
  type AppShellNavItemWire,
  type AppShellOperatingContextWire,
  isAppShellNavGroupWire,
  isAppShellNavItemWire,
  isAppShellOperatingContextWire,
} from "../meta-contracts/app-shell.contract.js";

describe("app shell contract (PAS-006)", () => {
  const navItem: AppShellNavItemWire = {
    href: "/dashboard",
    label: "Dashboard",
    isActive: true,
  };

  const navGroup: AppShellNavGroupWire = {
    label: "Main",
    items: [navItem],
  };

  const operatingContext: AppShellOperatingContextWire = {
    tenantLabel: "Acme Corp",
    legalEntityLabel: "Acme US LLC",
    workspaceLabel: "Default Workspace",
  };

  it("nav wire shapes are JSON-serializable", () => {
    for (const sample of [navItem, navGroup, operatingContext]) {
      expect(() => JSON.stringify(sample)).not.toThrow();
      const parsed: unknown = JSON.parse(JSON.stringify(sample));
      if ("items" in sample) {
        expect(isAppShellNavGroupWire(parsed)).toBe(true);
      } else if ("tenantLabel" in sample) {
        expect(isAppShellOperatingContextWire(parsed)).toBe(true);
      } else {
        expect(isAppShellNavItemWire(parsed)).toBe(true);
      }
    }
  });

  it("rejects top-level arrays and whitespace-only labels", () => {
    expect(isAppShellNavItemWire([])).toBe(false);
    expect(
      isAppShellNavItemWire({
        ...navItem,
        label: "   ",
      })
    ).toBe(false);
    expect(
      isAppShellOperatingContextWire({
        ...operatingContext,
        tenantLabel: "",
      })
    ).toBe(false);
  });
});
