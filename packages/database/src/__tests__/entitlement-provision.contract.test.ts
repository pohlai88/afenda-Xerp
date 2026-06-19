import { describe, expect, it } from "vitest";
import {
  assertValidPlanTemplateId,
  InvalidPlanTemplateError,
  materializeGrantRows,
} from "../entitlement/entitlement.contract.js";
import { getCommercialPlanTemplate } from "../entitlement/plan-templates.js";

describe("commercial plan templates", () => {
  it("materializes basic plan grants for a tenant", () => {
    const template = getCommercialPlanTemplate("basic");

    expect(template).not.toBeNull();
    if (!template) {
      throw new Error("Expected basic plan template");
    }

    const grants = materializeGrantRows(template, "tenant_basic");

    expect(grants).toEqual([
      expect.objectContaining({
        tenantId: "tenant_basic",
        key: "module.accounting.enabled",
        enabled: true,
      }),
    ]);
  });

  it("rejects unknown plan template ids", () => {
    expect(() => assertValidPlanTemplateId("premium-plus")).toThrow(
      InvalidPlanTemplateError
    );
  });
});
