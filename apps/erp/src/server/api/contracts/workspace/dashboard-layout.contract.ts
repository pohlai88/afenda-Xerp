import { z } from "zod";

import { PERMISSION_REGISTRY } from "@afenda/permissions";

import type { ApiRouteContract } from "../api-contract";
import {
  dashboardLayoutDeleteResponseSchema,
  dashboardLayoutPutRequestSchema,
  dashboardLayoutResponseSchema,
  type DashboardLayoutDeleteResponseDto,
  type DashboardLayoutPutRequestDto,
  type DashboardLayoutResponseDto,
} from "./dashboard-layout.api-contract";

const emptyRequestSchema = z.undefined();

export const dashboardLayoutGetContract = {
  cache: { kind: "no-store" },
  id: "internal.v1.workspace.dashboard-layout.get",
  method: "GET",
  path: "/api/internal/v1/workspace/dashboard-layout",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.workspace.dashboard.read,
  },
  requestSchema: emptyRequestSchema,
  responseSchema: dashboardLayoutResponseSchema,
  runtime: "nodejs",
  tags: ["workspace", "dashboard"],
  version: "v1",
} as const satisfies ApiRouteContract<undefined, DashboardLayoutResponseDto>;

export const dashboardLayoutPutContract = {
  audit: {
    action: "workspace.dashboard.layout.updated",
    enabled: true,
    targetType: "dashboard_layout",
  },
  cache: { kind: "no-store" },
  id: "internal.v1.workspace.dashboard-layout.put",
  method: "PUT",
  path: "/api/internal/v1/workspace/dashboard-layout",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.workspace.dashboard.write,
  },
  requestSchema: dashboardLayoutPutRequestSchema,
  responseSchema: dashboardLayoutResponseSchema,
  runtime: "nodejs",
  tags: ["workspace", "dashboard"],
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
  cache: { kind: "no-store" },
  id: "internal.v1.workspace.dashboard-layout.delete",
  method: "DELETE",
  path: "/api/internal/v1/workspace/dashboard-layout",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.workspace.dashboard.write,
  },
  requestSchema: emptyRequestSchema,
  responseSchema: dashboardLayoutDeleteResponseSchema,
  runtime: "nodejs",
  tags: ["workspace", "dashboard"],
  version: "v1",
} as const satisfies ApiRouteContract<
  undefined,
  DashboardLayoutDeleteResponseDto
>;
