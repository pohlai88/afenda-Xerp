import { z } from "zod";

import type { ApiRouteContract } from "./api-contract";

export const triggerProviderStateSchema = z.enum([
  "active",
  "degraded",
  "unavailable",
]);

export const executionSpineOperationalStatusSchema = z.enum([
  "healthy",
  "degraded",
  "critical",
]);

export const executionSpineDiagnosticsSchema = z.object({
  allowDegradedExecution: z.boolean(),
  appReleaseSha: z.string().nullable(),
  deadLetterCount: z.number().int().nonnegative().nullable(),
  lastScheduleRegistrationAt: z.string().nullable(),
  lastScheduleRegistrationError: z.string().nullable(),
  lastSuccessfulPublishAt: z.string().nullable(),
  lastWorkerVersionCheckAt: z.string().nullable(),
  lastWorkerVersionCheckError: z.string().nullable(),
  oldestPendingOutboxAgeSeconds: z.number().int().nonnegative().nullable(),
  operationalStatus: executionSpineOperationalStatusSchema,
  outboxScheduleId: z.string().nullable(),
  outboxScheduleRegistered: z.boolean(),
  pendingOutboxCount: z.number().int().nonnegative().nullable(),
  schedulerRequired: z.boolean(),
  triggerDeploymentVersion: z.string().nullable(),
  triggerGitCommitSha: z.string().nullable(),
  triggerProviderState: triggerProviderStateSchema,
  triggerWorkerVersion: z.string().nullable(),
  workerReleaseAligned: z.boolean(),
  workerReleaseCheckRequired: z.boolean(),
});

export type ExecutionSpineDiagnosticsDto = z.infer<
  typeof executionSpineDiagnosticsSchema
>;

export const healthResponseSchema = z.object({
  executionSpine: executionSpineDiagnosticsSchema,
  service: z.literal("erp"),
  status: z.enum(["ok", "degraded", "critical"]),
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
