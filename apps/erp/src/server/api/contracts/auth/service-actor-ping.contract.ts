import { z } from "zod";
import type { ApiRouteContract } from "../api-contract";
import {
  API_GOVERNANCE_DOCUMENTATION_PATH,
  API_ROUTE_OWNER,
  DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
} from "../api-governance.constants";

import {
  type ServiceActorPingResponseDto,
  serviceActorPingResponseSchema,
} from "./service-actor-ping.api-contract";

export const SERVICE_ACTOR_PING_OPERATION_ID =
  "internal.v1.auth.service-actor.ping.get" as const;

export const serviceActorPingGetContract = {
  authPolicy: "service-token-required",
  cache: { kind: "no-store" },
  contextPolicy: "none",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: SERVICE_ACTOR_PING_OPERATION_ID,
  summary: "Verify service-actor S2S bearer token",
  description:
    "Returns ok when the caller presents a verified afenda-s2s-v1 bearer token whose claims match service-actor ingress headers.",
  lifecycle: "active",
  method: "GET",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/auth/service-actor/ping",
  rateLimitPolicy: "authenticated-standard",
  requestSchema: z.undefined(),
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/auth/service-actor-ping.api-contract.ts#request:none",
  responseSchema: serviceActorPingResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/auth/service-actor-ping.api-contract.ts#serviceActorPingResponseSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["auth", "service-actor"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<undefined, ServiceActorPingResponseDto>;
