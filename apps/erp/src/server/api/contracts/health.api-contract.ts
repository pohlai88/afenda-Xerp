import { z } from "zod";

import type { ApiRouteContract } from "./api-contract";

export const healthResponseSchema = z.object({
  service: z.literal("erp"),
  status: z.literal("ok"),
});

export type HealthResponseDto = z.infer<typeof healthResponseSchema>;

export const healthGetContract = {
  cache: { kind: "revalidate", seconds: 30 },
  id: "internal.v1.health.get",
  method: "GET",
  path: "/api/internal/v1/health",
  requestSchema: z.undefined(),
  responseSchema: healthResponseSchema,
  runtime: "nodejs",
  tags: ["health", "public"],
  version: "v1",
} as const satisfies ApiRouteContract<undefined, HealthResponseDto>;
