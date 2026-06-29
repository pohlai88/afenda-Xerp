import {
  createTestEnterpriseId,
  parseUnknownTenantContext,
} from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import { createMetadataRuntimeContext } from "../metadata-runtime.contract";
import { resolveMetadataUiRenderContextFromTenantContext } from "../resolve-metadata-ui-render-context.server";

const TENANT_ENTERPRISE_ID = createTestEnterpriseId(
  "tenant",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);

describe("metadata-runtime.contract", () => {
  it("carries tenantSaasLifecyclePhase when provided", () => {
    expect(
      createMetadataRuntimeContext({ tenantSaasLifecyclePhase: "active" })
    ).toEqual({ tenantSaasLifecyclePhase: "active" });
  });
});

describe("resolveMetadataUiRenderContextFromTenantContext", () => {
  it("projects tenant SaaS lifecycle phase into metadata runtime", () => {
    const tenant = parseUnknownTenantContext({
      tenantId: TENANT_ENTERPRISE_ID,
      slug: "acme",
      displayName: "Acme",
      status: "active",
      saasLifecyclePhase: "active",
    });

    const runtime = resolveMetadataUiRenderContextFromTenantContext({
      tenant,
      actorId: "user_001",
      correlationId: "corr-b111",
    });

    expect(runtime.tenantId).toBe(TENANT_ENTERPRISE_ID);
    expect(runtime.tenantSaasLifecyclePhase).toBe("active");
    expect(runtime.actorId).toBe("user_001");
    expect(runtime.correlationId).toBe("corr-b111");
  });

  it("omits tenantSaasLifecyclePhase when tenant has no mapped phase", () => {
    const tenant = parseUnknownTenantContext({
      tenantId: TENANT_ENTERPRISE_ID,
      slug: "acme",
      displayName: "Acme",
      status: "active",
    });

    const runtime = resolveMetadataUiRenderContextFromTenantContext({ tenant });

    expect(runtime.tenantSaasLifecyclePhase).toBeUndefined();
  });

  it("carries offboarded phase for archived tenant mapping", () => {
    const tenant = parseUnknownTenantContext({
      tenantId: TENANT_ENTERPRISE_ID,
      slug: "archived",
      displayName: "Archived",
      status: "archived",
      saasLifecyclePhase: "offboarded",
    });

    const runtime = resolveMetadataUiRenderContextFromTenantContext({ tenant });

    expect(runtime.tenantSaasLifecyclePhase).toBe("offboarded");
  });
});
