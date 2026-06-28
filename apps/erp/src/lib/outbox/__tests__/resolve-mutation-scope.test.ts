import { createTestEnterpriseId } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import { createServerExecutionContext } from "@/lib/context/create-server-execution-context.server";
import type { DashboardLayoutPutRequestDto } from "@/server/api/contracts/workspace/dashboard-layout.api-contract";
import { dashboardLayoutPutContract } from "@/server/api/contracts/workspace/dashboard-layout.contract";

const EMPTY_DASHBOARD_LAYOUT_REQUEST = {
  version: 1,
  columns: 12,
  rowHeight: 80,
  items: [],
} as const satisfies DashboardLayoutPutRequestDto;

import { createApiRequestContext } from "@/server/api/runtime/api-request-context";
import { ApiRouteError } from "@/server/api/runtime/api-validation";

import { resolveMutationScopeFromApiContext } from "../resolve-mutation-scope.server.js";

describe("resolveMutationScopeFromApiContext", () => {
  it("returns canonical correlationId for outbox-safe mutation scope", () => {
    const correlationId = createTestEnterpriseId("correlation");
    const tenantId = createTestEnterpriseId("tenant");
    const companyId = createTestEnterpriseId("company");
    const userId = createTestEnterpriseId("user");

    const context = createApiRequestContext({
      contract: dashboardLayoutPutContract,
      correlationId,
      execution: createServerExecutionContext({
        actorId: userId,
        companyId,
        correlationId,
        source: "api",
        tenantId,
      }),
      request: new Request("http://localhost", { method: "PUT" }),
      requestBody: EMPTY_DASHBOARD_LAYOUT_REQUEST,
      requestId: "req-1",
      session: null,
      userId,
    });

    const scope = resolveMutationScopeFromApiContext(context);

    expect(scope.correlationId).toBe(correlationId);
    expect(scope.tenantId).toBe(tenantId);
    expect(scope.companyId).toBe(companyId);
  });

  it("rejects non-canonical correlationId before outbox enqueue", () => {
    const tenantId = createTestEnterpriseId("tenant");
    const companyId = createTestEnterpriseId("company");
    const userId = createTestEnterpriseId("user");

    const context = createApiRequestContext({
      contract: dashboardLayoutPutContract,
      correlationId: "corr-not-canonical",
      execution: createServerExecutionContext({
        actorId: userId,
        companyId,
        correlationId: createTestEnterpriseId("correlation"),
        source: "api",
        tenantId,
      }),
      request: new Request("http://localhost", { method: "PUT" }),
      requestBody: EMPTY_DASHBOARD_LAYOUT_REQUEST,
      requestId: "req-1",
      session: null,
      userId,
    });

    expect(() => resolveMutationScopeFromApiContext(context)).toThrow();
  });

  it("requires authenticated user", () => {
    expect(() =>
      resolveMutationScopeFromApiContext(
        createApiRequestContext({
          contract: dashboardLayoutPutContract,
          correlationId: createTestEnterpriseId("correlation"),
          execution: createServerExecutionContext({
            correlationId: createTestEnterpriseId("correlation"),
            source: "api",
          }),
          request: new Request("http://localhost", { method: "PUT" }),
          requestBody: EMPTY_DASHBOARD_LAYOUT_REQUEST,
          requestId: "req-1",
          session: null,
          userId: null,
        })
      )
    ).toThrow(ApiRouteError);
  });
});
