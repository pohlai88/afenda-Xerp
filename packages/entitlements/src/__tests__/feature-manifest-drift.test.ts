import { assertPermissionKey } from "@afenda/database";
import { describe, expect, it } from "vitest";

import { capabilities } from "../evaluation/capability-registry";
import { featureManifests } from "../evaluation/feature-manifest";
import {
  ERP_MODULE_IDS,
  ERP_MODULE_MANIFEST,
  listErpModuleManifests,
} from "../evaluation/feature-manifest.registry";
import {
  getModuleManifestCapabilityBinding,
  listModuleManifestCapabilityBindings,
} from "../evaluation/module-manifest-capability-registry";
import {
  getModuleRoute,
  isModuleRoutePath,
  listModuleRoutes,
  MODULE_ROUTE_MANIFEST,
} from "../evaluation/module-route-manifest";

describe("feature manifest drift", () => {
  it("uses unique module identifiers across the registry", () => {
    const moduleIds = listErpModuleManifests().map((entry) => entry.moduleId);
    expect(new Set(moduleIds).size).toBe(moduleIds.length);
    expect(ERP_MODULE_IDS).toEqual(moduleIds);
  });

  it("keeps route paths aligned with module identifiers", () => {
    for (const entry of ERP_MODULE_MANIFEST) {
      expect(entry.routePath).toBe(`/modules/${entry.moduleId}`);
      expect(isModuleRoutePath(entry.routePath)).toBe(true);
    }
  });

  it("validates permission key shape for every manifest entry", () => {
    for (const entry of ERP_MODULE_MANIFEST) {
      expect(() => assertPermissionKey(entry.permissionKey)).not.toThrow();
    }
  });

  it("references only registered evaluation capability keys", () => {
    const capabilityKeys = new Set(Object.keys(capabilities));

    for (const entry of ERP_MODULE_MANIFEST) {
      for (const optionalKey of entry.optionalCapabilities) {
        expect(capabilityKeys.has(optionalKey)).toBe(true);
      }
    }
  });

  it("includes HRM with a governed module id and route", () => {
    const hrm = getModuleRoute("hrm");
    expect(hrm).not.toBeNull();
    expect(hrm?.path).toBe("/modules/hrm");
    expect(hrm?.permissionKey).toBe("hr.employee_read");
  });

  it("projects module routes from the manifest without drift", () => {
    expect(MODULE_ROUTE_MANIFEST).toHaveLength(ERP_MODULE_MANIFEST.length);
    expect(listModuleRoutes()).toEqual(MODULE_ROUTE_MANIFEST);

    for (const manifestEntry of ERP_MODULE_MANIFEST) {
      const routeEntry = getModuleRoute(manifestEntry.moduleId);
      expect(routeEntry).toEqual({
        moduleId: manifestEntry.moduleId,
        path: manifestEntry.routePath,
        permissionKey: manifestEntry.permissionKey,
      });
    }
  });

  it("binds every module to a manifest capability record", () => {
    const bindings = listModuleManifestCapabilityBindings();
    expect(bindings).toHaveLength(ERP_MODULE_MANIFEST.length);

    for (const entry of ERP_MODULE_MANIFEST) {
      const binding = getModuleManifestCapabilityBinding(entry.moduleId);
      expect(binding?.permissionKey).toBe(entry.permissionKey);
      expect(binding?.optionalCapabilityKeys).toEqual(
        entry.optionalCapabilities.filter((key) => key in capabilities)
      );
    }
  });

  it("preserves legacy featureManifests projection for entitlement modules", () => {
    expect(featureManifests).toEqual([
      {
        moduleId: "accounting",
        requiredEntitlements: ["module.accounting.enabled"],
        optionalCapabilities: ["eInvoice", "auditExport"],
      },
      {
        moduleId: "mrp",
        requiredEntitlements: ["module.mrp.enabled"],
        optionalCapabilities: ["lotTracking", "forecasting"],
      },
      {
        moduleId: "ai_copilot",
        requiredEntitlements: ["module.ai_copilot.enabled"],
        optionalCapabilities: ["aiRecommendations"],
      },
    ]);
  });
});
