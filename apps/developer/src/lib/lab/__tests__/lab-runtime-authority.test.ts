import { describe, expect, it } from "vitest";
import { labBffRouteRegistry } from "@/lib/lab/lab-bff-route-registry";
import {
  LAB_RUNTIME_AUTHORITY_ADR_ID,
  LAB_RUNTIME_FORBIDDEN_PACKAGES,
  labRuntimeAuthorityPolicyRule,
} from "@/lib/lab/lab-runtime-authority-policy";
import { labRuntimeAuthorityRegistry } from "@/lib/lab/lab-runtime-authority-registry";

describe("lab runtime authority policy", () => {
  it("registers the demo operating-context resolver", () => {
    expect(labRuntimeAuthorityRegistry).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          authorityId: "lab.runtime-authority.demo-operating-context",
          authorityKind: "demo-fixture",
        }),
      ])
    );
  });

  it("forbids live auth, kernel, tenant, and BFF authority", () => {
    expect(labRuntimeAuthorityPolicyRule.forbids).toEqual(
      expect.arrayContaining([
        "better-auth-session",
        "kernel-operating-context",
        "erp-bff-routes",
        "live-tenant-resolution",
      ])
    );
  });

  it("documents the ERP promotion path for operating context", () => {
    expect(labRuntimeAuthorityPolicyRule.erpPromotionPath).toBe(
      "apps/erp/src/lib/context/to-shell-operating-context-wire.ts"
    );
  });

  it("keeps the BFF allowlist empty by design", () => {
    expect(labBffRouteRegistry).toEqual([]);
  });

  it("lists guarded runtime packages that remain prohibited", () => {
    expect(LAB_RUNTIME_FORBIDDEN_PACKAGES).toEqual(
      expect.arrayContaining([
        "@afenda/auth",
        "@afenda/kernel",
        "@afenda/database",
        "@afenda/server",
      ])
    );
  });

  it("binds terminal authority posture to ADR-0044", () => {
    expect(LAB_RUNTIME_AUTHORITY_ADR_ID).toBe(
      "ADR-0044-developer-route-lab-runtime-authority-boundary"
    );
    expect(labRuntimeAuthorityPolicyRule.authorityKind).toBe("demo-fixture");
  });
});
