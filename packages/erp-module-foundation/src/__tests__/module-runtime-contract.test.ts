import { describe, expect, it } from "vitest";
import { defineModulePolicy, defineModuleRuntimeContract } from "../index.js";

describe("defineModuleRuntimeContract", () => {
  it("defines a runtime contract with required fields", () => {
    const contract = defineModuleRuntimeContract({
      module: "procurement",
      kvId: "KV-PROC",
      lifecycle: "foundation",
      documentFamilies: ["requisition", "purchase_order"],
      operationSummary: ["procurement.requisition.submit"],
      nonGoals: ["No kernel mutations"],
      requiredGates: ["pnpm check:erp-module-foundation"],
    });

    expect(contract.module).toBe("procurement");
    expect(contract.documentFamilies).toHaveLength(2);
  });

  it("rejects empty documentFamilies", () => {
    expect(() =>
      defineModuleRuntimeContract({
        module: "procurement",
        kvId: "KV-PROC",
        lifecycle: "foundation",
        documentFamilies: [],
        operationSummary: ["op"],
        nonGoals: ["goal"],
        requiredGates: ["gate"],
      })
    ).toThrow(/documentFamilies/);
  });

  it("rejects empty requiredGates", () => {
    expect(() =>
      defineModuleRuntimeContract({
        module: "procurement",
        kvId: "KV-PROC",
        lifecycle: "foundation",
        documentFamilies: ["requisition"],
        operationSummary: ["op"],
        nonGoals: ["goal"],
        requiredGates: [],
      })
    ).toThrow(/requiredGates/);
  });
});

describe("defineModulePolicy", () => {
  it("defines policy with module-prefixed actions", () => {
    const policy = defineModulePolicy({
      module: "procurement",
      kvId: "KV-PROC",
      createRules: [
        {
          action: "procurement.requisition.create",
          permissionKey: "procurement.requisition_create",
        },
      ],
    });

    expect(policy.createRules).toHaveLength(1);
  });

  it("rejects non-prefixed policy actions", () => {
    expect(() =>
      defineModulePolicy({
        module: "procurement",
        kvId: "KV-PROC",
        createRules: [
          {
            action: "requisition.create",
            permissionKey: "procurement.requisition_create",
          },
        ],
      })
    ).toThrow(/must be prefixed/);
  });

  it("rejects empty createRules", () => {
    expect(() =>
      defineModulePolicy({
        module: "procurement",
        kvId: "KV-PROC",
        createRules: [],
      })
    ).toThrow(/createRules/);
  });
});
