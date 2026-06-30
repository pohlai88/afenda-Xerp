import { describe, expect, it } from "vitest";

import {
  type ErpNavGroupWire,
  type ErpNavItemWire,
  type ErpShellOperatingContextWire,
  isErpNavGroupWire,
  isErpNavItemWire,
  isErpShellOperatingContextWire,
} from "../contracts/erp-shell.contract.js";

describe("erp shell contract (PAS-006)", () => {
  const navItem: ErpNavItemWire = {
    href: "/dashboard",
    label: "Dashboard",
    isActive: true,
  };

  const navGroup: ErpNavGroupWire = {
    label: "Main",
    items: [navItem],
  };

  const operatingContext: ErpShellOperatingContextWire = {
    tenantLabel: "Acme Corp",
    legalEntityLabel: "Acme US LLC",
    workspaceLabel: "Default Workspace",
  };

  it("nav wire shapes are JSON-serializable", () => {
    for (const sample of [navItem, navGroup, operatingContext]) {
      expect(() => JSON.stringify(sample)).not.toThrow();
      const parsed: unknown = JSON.parse(JSON.stringify(sample));
      if ("items" in sample) {
        expect(isErpNavGroupWire(parsed)).toBe(true);
      } else if ("tenantLabel" in sample) {
        expect(isErpShellOperatingContextWire(parsed)).toBe(true);
      } else {
        expect(isErpNavItemWire(parsed)).toBe(true);
      }
    }
  });

  it("rejects top-level arrays and whitespace-only labels", () => {
    expect(isErpNavItemWire([])).toBe(false);
    expect(
      isErpNavItemWire({
        ...navItem,
        label: "   ",
      })
    ).toBe(false);
    expect(
      isErpShellOperatingContextWire({
        ...operatingContext,
        tenantLabel: "",
      })
    ).toBe(false);
  });
});
