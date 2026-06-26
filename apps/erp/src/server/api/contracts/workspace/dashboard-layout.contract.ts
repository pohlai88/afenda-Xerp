import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { z } from "zod";
import type { ApiRouteContract } from "../api-contract";
import {
  API_GOVERNANCE_DOCUMENTATION_PATH,
  API_ROUTE_OWNER,
  DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
} from "../api-governance.constants";
import {
  type DashboardLayoutDeleteResponseDto,
  type DashboardLayoutPutRequestDto,
  type DashboardLayoutResponseDto,
  dashboardLayoutDeleteResponseSchema,
  dashboardLayoutPutRequestSchema,
  dashboardLayoutResponseSchema,
} from "./dashboard-layout.api-contract";

const emptyRequestSchema = z.undefined();

export const dashboardLayoutGetContract = {
  authPolicy: "session-required",
  cache: { kind: "no-store" },
  contextPolicy: "tenant-company-org-required",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.workspace.dashboard-layout.get",
  lifecycle: "active",
  method: "GET",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/workspace/dashboard-layout",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.workspace.dashboard.read,
  },
  rateLimitPolicy: "authenticated-standard",
  requestSchema: emptyRequestSchema,
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/workspace/dashboard-layout.api-contract.ts#request:none",
  responseSchema: dashboardLayoutResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/workspace/dashboard-layout.api-contract.ts#dashboardLayoutResponseSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["workspace", "dashboard"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<undefined, DashboardLayoutResponseDto>;

export const dashboardLayoutPutContract = {
  audit: {
    action: "workspace.dashboard.layout.updated",
    enabled: true,
    targetType: "dashboard_layout",
  },
  authPolicy: "session-required",
  cache: { kind: "no-store" },
  contextPolicy: "tenant-company-org-required",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.workspace.dashboard-layout.put",
  idempotency: { mode: "required" },
  lifecycle: "active",
  method: "PUT",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/workspace/dashboard-layout",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.workspace.dashboard.write,
  },
  rateLimitPolicy: "authenticated-sensitive",
  requestSchema: dashboardLayoutPutRequestSchema,
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/workspace/dashboard-layout.api-contract.ts#dashboardLayoutPutRequestSchema",
  responseSchema: dashboardLayoutResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/workspace/dashboard-layout.api-contract.ts#dashboardLayoutResponseSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["workspace", "dashboard"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<
  DashboardLayoutPutRequestDto,
  DashboardLayoutResponseDto
>;

export const dashboardLayoutDeleteContract = {
  audit: {
    action: "workspace.dashboard.layout.reset",
    enabled: true,
    targetType: "dashboard_layout",
  },
  authPolicy: "session-required",
  cache: { kind: "no-store" },
  contextPolicy: "tenant-company-org-required",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.workspace.dashboard-layout.delete",
  lifecycle: "active",
  method: "DELETE",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/workspace/dashboard-layout",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.workspace.dashboard.write,
  },
  rateLimitPolicy: "authenticated-sensitive",
  requestSchema: emptyRequestSchema,
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/workspace/dashboard-layout.api-contract.ts#request:none",
  responseSchema: dashboardLayoutDeleteResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/workspace/dashboard-layout.api-contract.ts#dashboardLayoutDeleteResponseSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["workspace", "dashboard"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<
  undefined,
  DashboardLayoutDeleteResponseDto
>;
