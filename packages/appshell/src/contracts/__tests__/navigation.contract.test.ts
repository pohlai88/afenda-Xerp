import { describe, expect, it } from "vitest";
import type { ManifestModuleId as RuntimeManifestModuleId } from "../../navigation/build-nav-from-manifest.js";
import {
  MANIFEST_MODULE_IDS as RUNTIME_MANIFEST_MODULE_IDS,
  resolveManifestModuleNavIcon,
} from "../../navigation/build-nav-from-manifest.js";
import {
  APPSHELL_NAV_ICON_IDS,
  isAppShellNavIconId,
  isManifestModuleId,
  MANIFEST_MODULE_IDS,
  MANIFEST_MODULE_NAV_ICON_MAP,
  type ManifestModuleId,
} from "../navigation.contract.js";
import type {
  AssertAssignableToContract,
  AssertMutuallyAssignable,
} from "./type-assignability.js";

/**
 * Frozen fixture aligned with `@afenda/entitlements` `ErpModuleId` —
 * no runtime entitlements import in `@afenda/appshell`.
 */
const ENTITLEMENTS_ERP_MODULE_ID_FIXTURE = [
  "accounting",
  "ai_copilot",
  "hrm",
  "inventory",
  "manufacturing",
  "mrp",
  "sales",
  "workspace",
] as const satisfies readonly ManifestModuleId[];

type _RuntimeManifestModuleIdMatchesContract = AssertMutuallyAssignable<
  RuntimeManifestModuleId,
  ManifestModuleId
>;

type _ContractManifestModuleIdAssignableToRuntime = AssertAssignableToContract<
  ManifestModuleId,
  RuntimeManifestModuleId
>;

describe("navigation.contract", () => {
  it("aligns ManifestModuleId with entitlements fixture union", () => {
    expect([...MANIFEST_MODULE_IDS].sort()).toEqual(
      [...ENTITLEMENTS_ERP_MODULE_ID_FIXTURE].sort()
    );
    expect([...RUNTIME_MANIFEST_MODULE_IDS].sort()).toEqual(
      [...MANIFEST_MODULE_IDS].sort()
    );
  });

  it("registers nav icon ids without duplicates", () => {
    expect(APPSHELL_NAV_ICON_IDS.length).toBeGreaterThan(0);
    expect(new Set(APPSHELL_NAV_ICON_IDS).size).toBe(
      APPSHELL_NAV_ICON_IDS.length
    );
  });

  it("maps every manifest module to a governed nav icon", () => {
    for (const moduleId of MANIFEST_MODULE_IDS) {
      expect(MANIFEST_MODULE_NAV_ICON_MAP[moduleId]).toBeDefined();
      expect(isAppShellNavIconId(MANIFEST_MODULE_NAV_ICON_MAP[moduleId])).toBe(
        true
      );
      expect(resolveManifestModuleNavIcon(moduleId)).toBe(
        MANIFEST_MODULE_NAV_ICON_MAP[moduleId]
      );
    }
  });

  it("narrows manifest module and icon ids via type guards", () => {
    expect(isManifestModuleId("workspace")).toBe(true);
    expect(isManifestModuleId("unknown-module")).toBe(false);
    expect(isAppShellNavIconId("dashboard")).toBe(true);
    expect(isAppShellNavIconId("not-an-icon")).toBe(false);
  });

  it("accepts serializable nav item discriminated union shapes", () => {
    const leafItem = {
      icon: "dashboard" as const,
      label: "Workspace",
      href: "/modules/workspace",
    };
    const groupItem = {
      icon: "settings" as const,
      label: "Settings",
      items: [{ href: "/settings/profile", label: "Profile" }],
    };

    expect(isAppShellNavIconId(leafItem.icon)).toBe(true);
    expect(isAppShellNavIconId(groupItem.icon)).toBe(true);
    expect(groupItem.items).toHaveLength(1);
  });
});
