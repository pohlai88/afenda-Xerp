import type { ApiRouteContract } from "../api-contract";
import {
  clientErrorPostRequestSchema,
  clientErrorPostResponseSchema,
  type ClientErrorPostRequestDto,
  type ClientErrorPostResponseDto,
} from "./client-error.api-contract";

export const clientErrorPostContract = {
  cache: { kind: "no-store" },
  id: "internal.v1.client-error.post",
  method: "POST",
  path: "/api/internal/v1/client-error",
  requestSchema: clientErrorPostRequestSchema,
  responseSchema: clientErrorPostResponseSchema,
  runtime: "nodejs",
  tags: ["observability", "public", "telemetry"],
  version: "v1",
} as const satisfies ApiRouteContract<
  ClientErrorPostRequestDto,
  ClientErrorPostResponseDto
>;
