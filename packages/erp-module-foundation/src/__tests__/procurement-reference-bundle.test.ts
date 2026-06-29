import { describe, expect, it } from "vitest";
import {
  REFERENCE_ERP_RUNTIME_MODULE,
  REFERENCE_ERP_RUNTIME_MODULE_REGISTRY,
  REFERENCE_PROCUREMENT_FOUNDATION_BUNDLE,
} from "../index.js";

describe("procurement production foundation bundle", () => {
  it("production module is foundation_authorized with foundation lifecycle", () => {
    expect(REFERENCE_ERP_RUNTIME_MODULE.runtimeStatus).toBe(
      "foundation_authorized"
    );
    expect(REFERENCE_ERP_RUNTIME_MODULE.lifecycle).toBe("foundation");
    expect(REFERENCE_ERP_RUNTIME_MODULE.permissionNamespace).toBe(
      "procurement"
    );
    expect(REFERENCE_ERP_RUNTIME_MODULE.wirePackage).toBe(
      "@afenda/kernel/erp-domain/procurement"
    );
  });

  it("production registry contains foundation_authorized procurement module", () => {
    expect(REFERENCE_ERP_RUNTIME_MODULE_REGISTRY.modules).toHaveLength(1);
    const registered = REFERENCE_ERP_RUNTIME_MODULE_REGISTRY.modules[0];
    expect(registered?.slug).toBe("procurement");
    expect(registered?.runtimeStatus).toBe("foundation_authorized");
  });

  it("foundation bundle matches production identity", () => {
    expect(REFERENCE_PROCUREMENT_FOUNDATION_BUNDLE.module.runtimeStatus).toBe(
      "foundation_authorized"
    );
    expect(REFERENCE_PROCUREMENT_FOUNDATION_BUNDLE.module.lifecycle).toBe(
      "foundation"
    );
    expect(
      REFERENCE_PROCUREMENT_FOUNDATION_BUNDLE.permissionBinding.permissionParity
    ).toBe("deferred");
  });
});
