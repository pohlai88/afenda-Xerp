import { listModuleRoutes } from "@afenda/entitlements";
import { describe, expect, it } from "vitest";

import {
  generateModuleRoutes,
  getGeneratedModuleRoute,
  isKnownModuleRouteSegment,
} from "../generate-module-routes";

describe("generateModuleRoutes", () => {
  it("materializes every manifest module route without ad-hoc paths", () => {
    const routes = generateModuleRoutes();

    expect(routes).toHaveLength(listModuleRoutes().length);
    expect(
      routes.every((route) => route.path === `/modules/${route.moduleId}`)
    ).toBe(true);
  });

  it("includes HRM with governed path and permission key", () => {
    const hrm = getGeneratedModuleRoute("hrm");

    expect(hrm).toEqual({
      moduleId: "hrm",
      segment: "hrm",
      path: "/modules/hrm",
      permissionKey: "hr.employee_read",
      label: "HRM",
    });
  });

  it("rejects unknown module segments", () => {
    expect(getGeneratedModuleRoute("unknown-module")).toBeNull();
    expect(isKnownModuleRouteSegment("unknown-module")).toBe(false);
    expect(isKnownModuleRouteSegment("hrm")).toBe(true);
  });
});
