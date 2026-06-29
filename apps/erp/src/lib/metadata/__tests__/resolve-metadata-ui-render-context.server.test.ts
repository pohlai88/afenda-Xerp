import {
  createTestEnterpriseId,
  DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
  parseUnknownOperatingContext,
  parseUnknownTenantContext,
} from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import { createMetadataRuntimeContext } from "../metadata-runtime.contract";
import {
  resolveMetadataUiRenderContextFromOperatingContext,
  resolveMetadataUiRenderContextFromTenantContext,
} from "../resolve-metadata-ui-render-context.server";

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

describe("resolveMetadataUiRenderContextFromOperatingContext", () => {
  it("delegates to tenant-context projection from operating context", () => {
    const operatingContext = parseUnknownOperatingContext({
      actor: {
        userId: createTestEnterpriseId("user", "01ARZ3NDEKTSV4RRFFQ69G5FAX"),
      },
      correlationId: "corr-operating-context",
      tenant: {
        tenantId: TENANT_ENTERPRISE_ID,
        slug: "acme",
        displayName: "Acme",
        status: "active",
        saasLifecyclePhase: "active",
      },
      entityGroup: null,
      legalEntity: {
        tenantId: TENANT_ENTERPRISE_ID,
        entityGroupId: null,
        companyId: createTestEnterpriseId(
          "company",
          "01ARZ3NDEKTSV4RRFFQ69G5FAW"
        ),
        legalName: "Acme Co",
        displayName: "Acme Co",
        slug: "acme-co",
        companyType: "standalone",
        relationshipToHoldingCompany: null,
        countryCode: "US",
        baseCurrency: "USD",
        reportingCurrency: null,
        fiscalCalendarId: null,
        registrationNumber: null,
        taxRegistrationNumber: null,
        effectiveFrom: "2026-01-01",
        effectiveTo: null,
        status: "active",
      },
      ownershipInterests: [],
      organizationUnit: null,
      team: null,
      project: null,
      workspace: {
        tenantId: TENANT_ENTERPRISE_ID,
        companyId: createTestEnterpriseId(
          "company",
          "01ARZ3NDEKTSV4RRFFQ69G5FAW"
        ),
        organizationId: null,
        projectId: null,
      },
      permissionScope: {
        grantScopeType: "company",
        tenantId: TENANT_ENTERPRISE_ID,
        entityGroupId: null,
        companyId: createTestEnterpriseId(
          "company",
          "01ARZ3NDEKTSV4RRFFQ69G5FAW"
        ),
        organizationId: null,
        teamId: null,
        projectId: null,
        membershipId: createTestEnterpriseId(
          "membership",
          "01ARZ3NDEKTSV4RRFFQ69G5FAY"
        ),
        roleId: createTestEnterpriseId("role", "01ARZ3NDEKTSV4RRFFQ69G5FAZ"),
        elevations: DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
      },
      consolidationScope: null,
      surface: { surfaceId: "surface.metadata-workspace" },
      workflow: null,
    });

    const runtime = resolveMetadataUiRenderContextFromOperatingContext({
      operatingContext,
    });

    expect(runtime.tenantId).toBe(TENANT_ENTERPRISE_ID);
    expect(runtime.actorId).toBe(
      createTestEnterpriseId("user", "01ARZ3NDEKTSV4RRFFQ69G5FAX")
    );
    expect(runtime.correlationId).toBe("corr-operating-context");
  });
});
