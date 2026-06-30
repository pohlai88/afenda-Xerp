import { z } from "zod";
import type { ApiRouteContract } from "../api-contract";
import {
  API_GOVERNANCE_DOCUMENTATION_PATH,
  API_ROUTE_OWNER,
  DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
} from "../api-governance.constants";
import {
  type OpenApiDocsResponseDto,
  type OpenApiDocumentResponseDto,
  openApiDocsResponseSchema,
  openApiDocumentResponseSchema,
} from "./api-spec.api-contract";

const emptyGetRequestSchema = z.undefined();

export const openApiJsonGetContract = {
  authPolicy: "public",
  cache: { kind: "no-store" },
  contextPolicy: "none",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.openapi.json.get",
  summary: "Get OpenAPI document",
  description:
    "Returns the generated Afenda internal v1 OpenAPI document as raw JSON for tooling and API reference hosts.",
  lifecycle: "active",
  method: "GET",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/openapi.json",
  rateLimitPolicy: "anonymous-low",
  requestSchema: emptyGetRequestSchema,
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/api-docs/api-spec.api-contract.ts#request:none",
  responseSchema: openApiDocumentResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/api-docs/api-spec.api-contract.ts#openApiDocumentResponseSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["public", "docs"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<undefined, OpenApiDocumentResponseDto>;

export const openApiDocsGetContract = {
  authPolicy: "public",
  cache: { kind: "no-store" },
  contextPolicy: "none",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.docs.get",
  summary: "OpenAPI reference UI",
  description:
    "Serves a minimal Scalar API reference page for the internal v1 OpenAPI document.",
  lifecycle: "active",
  method: "GET",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/docs",
  rateLimitPolicy: "anonymous-low",
  requestSchema: emptyGetRequestSchema,
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/api-docs/api-spec.api-contract.ts#request:none",
  responseSchema: openApiDocsResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/api-docs/api-spec.api-contract.ts#openApiDocsResponseSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["public", "docs"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<undefined, OpenApiDocsResponseDto>;
