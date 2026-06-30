import type { ApiRouteContract } from "../api-contract";
import {
  API_GOVERNANCE_DOCUMENTATION_PATH,
  API_ROUTE_OWNER,
  DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
} from "../api-governance.constants";
import {
  type ClientErrorPostRequestDto,
  type ClientErrorPostResponseDto,
  clientErrorPostRequestSchema,
  clientErrorPostResponseSchema,
} from "./client-error.api-contract";

export const clientErrorPostContract = {
  authPolicy: "public",
  cache: { kind: "no-store" },
  consumerImpact: {
    affected: ["internal-ui"],
  },
  contextPolicy: "none",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.client-error.post",
  summary: "Report client-side error",
  description:
    "Ingests client-side JavaScript errors and telemetry from the ERP shell. Public route for pre-auth error reporting.",
  idempotency: { mode: "optional" },
  lifecycle: "deprecated",
  lifecycleMigration: {
    replacementOperationId: "internal.v1.observability.client-errors.post",
    sunsetAt: "2027-06-30",
  },
  method: "POST",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/client-error",
  rateLimitPolicy: "anonymous-low",
  requestSchema: clientErrorPostRequestSchema,
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/observability/client-error.api-contract.ts#clientErrorPostRequestSchema",
  responseSchema: clientErrorPostResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/observability/client-error.api-contract.ts#clientErrorPostResponseSchema",
  runtime: "nodejs",
  stability: "deprecated",
  tags: ["observability", "public", "telemetry"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<
  ClientErrorPostRequestDto,
  ClientErrorPostResponseDto
>;
