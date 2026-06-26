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
  summary: "Get dashboard layout",
  description:
    "Returns the persisted dashboard widget layout for the active tenant, company, and organization context.",
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
  summary: "Update dashboard layout",
  description:
    "Persists dashboard widget layout changes. Requires idempotency key and workspace dashboard write permission.",
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
  summary: "Reset dashboard layout",
  description:
    "Resets the dashboard layout to the default configuration for the active operating context.",
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
