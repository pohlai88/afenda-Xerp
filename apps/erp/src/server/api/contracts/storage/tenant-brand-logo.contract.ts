import { PERMISSION_REGISTRY } from "@afenda/permissions";
import type { ApiRouteContract } from "../api-contract";
import {
  API_GOVERNANCE_DOCUMENTATION_PATH,
  API_ROUTE_OWNER,
  DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
} from "../api-governance.constants";
import {
  type TenantBrandLogoUploadRequestDto,
  type TenantBrandLogoUploadResponseDto,
  tenantBrandLogoUploadRequestSchema,
  tenantBrandLogoUploadResponseSchema,
} from "./tenant-brand-logo.api-contract";

export const tenantBrandLogoUploadPostContract = {
  audit: {
    action: "system_admin.appearance.logo.upload_initiated",
    enabled: true,
    targetType: "storage_object",
  },
  authPolicy: "session-required",
  cache: { kind: "no-store" },
  contextPolicy: "tenant-required",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.storage.tenant-brand-logo.post",
  idempotency: { mode: "optional" },
  lifecycle: "active",
  method: "POST",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/storage/tenant-brand-logo",
  permission: {
    mode: "required",
    permission: PERMISSION_REGISTRY.systemAdmin.modules.manage,
  },
  rateLimitPolicy: "authenticated-sensitive",
  requestSchema: tenantBrandLogoUploadRequestSchema,
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/storage/tenant-brand-logo.api-contract.ts#tenantBrandLogoUploadRequestSchema",
  responseSchema: tenantBrandLogoUploadResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/storage/tenant-brand-logo.api-contract.ts#tenantBrandLogoUploadResponseSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["storage", "system-admin", "appearance"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<
  TenantBrandLogoUploadRequestDto,
  TenantBrandLogoUploadResponseDto
>;
