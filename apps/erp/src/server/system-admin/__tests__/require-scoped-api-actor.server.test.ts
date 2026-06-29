import {
  createTestEnterpriseId,
  parseCompanyId,
  parseTenantId,
  parseUserId,
} from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import { ApiRouteError } from "@/server/api/runtime/api-validation";
import { requireCompanyScopedApiActor } from "@/server/system-admin/require-company-scoped-api-actor.server";
import { requireTenantScopedApiActor } from "@/server/system-admin/require-tenant-scoped-api-actor.server";

const TENANT = createTestEnterpriseId("tenant");
const COMPANY = createTestEnterpriseId("company");
const USER = createTestEnterpriseId("user");

describe("requireCompanyScopedApiActor", () => {
  it("returns unbranded tenant and company scope for authenticated actors", () => {
    const actor = requireCompanyScopedApiActor({
      correlationId: "corr-api-actor",
      execution: {
        companyId: parseCompanyId(COMPANY),
        tenantId: parseTenantId(TENANT),
      },
      userId: parseUserId(USER),
    });

    expect(actor).toEqual({
      actorUserId: USER,
      companyId: COMPANY,
      correlationId: "corr-api-actor",
      tenantId: TENANT,
    });
  });

  it("throws unauthenticated when userId is null", () => {
    expect(() =>
      requireCompanyScopedApiActor({
        correlationId: "corr-api-actor",
        execution: {
          companyId: parseCompanyId(COMPANY),
          tenantId: parseTenantId(TENANT),
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
          tenantId: parseTenantId(TENANT),
        },
        userId: parseUserId(USER),
      })
    ).toThrow(ApiRouteError);
  });
});

describe("requireTenantScopedApiActor", () => {
  it("returns unbranded tenant scope for authenticated actors", () => {
    const actor = requireTenantScopedApiActor({
      execution: { tenantId: parseTenantId(TENANT) },
      userId: parseUserId(USER),
    });

    expect(actor).toEqual({ tenantId: TENANT });
  });
});
