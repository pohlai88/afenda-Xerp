import { isManifestModuleId, MANIFEST_MODULE_IDS } from "@afenda/appshell";
import { ERP_MODULE_IDS, listErpModuleManifests } from "@afenda/entitlements";
import { describe, expect, it } from "vitest";

function sortedModuleIds(ids: readonly string[]): string[] {
  return [...ids].sort();
}

describe("module id parity", () => {
  it("maps every entitlements ErpModuleId to appshell ManifestModuleId", () => {
    for (const entry of listErpModuleManifests()) {
      expect(isManifestModuleId(entry.moduleId)).toBe(true);
    }
  });

  it("keeps ERP_MODULE_IDS aligned with the manifest registry", () => {
    expect(ERP_MODULE_IDS).toEqual(
      listErpModuleManifests().map((entry) => entry.moduleId)
    );
  });

  it("keeps appshell MANIFEST_MODULE_IDS aligned with entitlements ErpModuleId", () => {
    expect(sortedModuleIds(MANIFEST_MODULE_IDS)).toEqual(
      sortedModuleIds(ERP_MODULE_IDS)
    );
  });

  it("rejects module ids that are not governed by the entitlements manifest", () => {
    expect(isManifestModuleId("unknown-module")).toBe(false);
    expect(isManifestModuleId("hrm")).toBe(true);
  });
});
