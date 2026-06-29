import { z } from "zod";
import type { ApiRouteContract } from "../api-contract";
import {
  API_GOVERNANCE_DOCUMENTATION_PATH,
  API_ROUTE_OWNER,
  DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
} from "../api-governance.constants";

import {
  type AuthMembershipsGetResponseDto,
  authMembershipsGetResponseSchema,
} from "./auth-memberships.api-contract";

export const authMembershipsGetContract = {
  authPolicy: "session-required",
  cache: { kind: "no-store" },
  contextPolicy: "tenant-required",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.auth.memberships.get",
  summary: "List session memberships",
  description:
    "Returns tenant memberships available to the authenticated user for workspace and organization selection after sign-in.",
  lifecycle: "active",
  method: "GET",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/auth/memberships",
  rateLimitPolicy: "authenticated-standard",
  requestSchema: z.undefined(),
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/auth/auth-memberships.api-contract.ts#authMembershipsGetResponseSchema",
  responseSchema: authMembershipsGetResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/auth/auth-memberships.api-contract.ts#authMembershipsGetResponseSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["auth", "memberships", "public"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<undefined, AuthMembershipsGetResponseDto>;
