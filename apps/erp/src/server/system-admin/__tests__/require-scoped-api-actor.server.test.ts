import { brandCompanyId, brandTenantId, brandUserId } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import { ApiRouteError } from "@/server/api/runtime/api-validation";
import { requireCompanyScopedApiActor } from "@/server/system-admin/require-company-scoped-api-actor.server";
import { requireTenantScopedApiActor } from "@/server/system-admin/require-tenant-scoped-api-actor.server";

describe("requireCompanyScopedApiActor", () => {
  it("returns unbranded tenant and company scope for authenticated actors", () => {
    const actor = requireCompanyScopedApiActor({
      correlationId: "corr-api-actor",
      execution: {
        companyId: brandCompanyId("company-a"),
        tenantId: brandTenantId("tenant-001"),
      },
      userId: brandUserId("user-001"),
    });

    expect(actor).toEqual({
      actorUserId: "user-001",
      companyId: "company-a",
      correlationId: "corr-api-actor",
      tenantId: "tenant-001",
    });
  });

  it("throws unauthenticated when userId is null", () => {
    expect(() =>
      requireCompanyScopedApiActor({
        correlationId: "corr-api-actor",
        execution: {
          companyId: brandCompanyId("company-a"),
          tenantId: brandTenantId("tenant-001"),
        },
        userId: null,
      })
    ).toThrow(ApiRouteError);
  });

  it("throws forbidden when company scope is missing", () => {
    expect(() =>
      requireCompanyScopedApiActor({
        correlationId: "corr-api-actor",
        execution: {
          companyId: null,
          tenantId: brandTenantId("tenant-001"),
        },
        userId: brandUserId("user-001"),
      })
    ).toThrow(ApiRouteError);
  });
});

describe("requireTenantScopedApiActor", () => {
  it("returns unbranded tenant scope for authenticated actors", () => {
    const actor = requireTenantScopedApiActor({
      execution: { tenantId: brandTenantId("tenant-001") },
      userId: brandUserId("user-001"),
    });

    expect(actor).toEqual({ tenantId: "tenant-001" });
  });
});
