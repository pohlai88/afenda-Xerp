import { z } from "zod";
import type { ApiRouteContract } from "./api-contract";
import {
  API_GOVERNANCE_DOCUMENTATION_PATH,
  API_ROUTE_OWNER,
  DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
} from "./api-governance.constants";

export const triggerProviderStateSchema = z
  .enum(["active", "degraded", "unavailable"])
  .meta({
    id: "TriggerProviderState",
    description: "Operational state of the Trigger.dev provider integration.",
    example: "active",
  });

export const executionSpineOperationalStatusSchema = z
  .enum(["healthy", "degraded", "critical"])
  .meta({
    id: "ExecutionSpineOperationalStatus",
    description:
      "Aggregate health of the execution spine (outbox, scheduler, worker alignment).",
    example: "healthy",
  });

export const executionSpineDiagnosticsSchema = z
  .object({
    allowDegradedExecution: z.boolean().meta({
      description:
        "Whether the ERP may continue processing when the spine is degraded.",
      example: false,
    }),
    appReleaseSha: z.string().nullable().meta({
      description: "Git commit SHA of the deployed ERP application release.",
      example: "a1b2c3d4e5f6789012345678abcdef0123456789",
    }),
    deadLetterCount: z.number().int().nonnegative().nullable().meta({
      description: "Count of outbox messages in the dead-letter queue.",
      example: 0,
    }),
    lastScheduleRegistrationAt: z.string().nullable().meta({
      description:
        "ISO-8601 timestamp of the last successful outbox schedule registration.",
      example: "2026-06-26T12:00:00.000Z",
    }),
    lastScheduleRegistrationError: z.string().nullable().meta({
      description:
        "Last error message from outbox schedule registration, if any.",
      example: null,
    }),
    lastSuccessfulPublishAt: z.string().nullable().meta({
      description:
        "ISO-8601 timestamp of the last successful outbox message publish.",
      example: "2026-06-26T11:58:42.000Z",
    }),
    lastWorkerVersionCheckAt: z.string().nullable().meta({
      description:
        "ISO-8601 timestamp of the last Trigger worker version alignment check.",
      example: "2026-06-26T11:55:00.000Z",
    }),
    lastWorkerVersionCheckError: z.string().nullable().meta({
      description:
        "Last error message from worker version alignment check, if any.",
      example: null,
    }),
    oldestPendingOutboxAgeSeconds: z
      .number()
      .int()
      .nonnegative()
      .nullable()
      .meta({
        description: "Age in seconds of the oldest unpublished outbox message.",
        example: 12,
      }),
    operationalStatus: executionSpineOperationalStatusSchema.meta({
      description: "Derived operational status for the execution spine.",
    }),
    outboxScheduleId: z.string().nullable().meta({
      description: "Trigger.dev schedule identifier for the outbox processor.",
      example: "sched_outbox_01HXYZ",
    }),
    outboxScheduleRegistered: z.boolean().meta({
      description: "Whether the outbox processor schedule is registered.",
      example: true,
    }),
    pendingOutboxCount: z.number().int().nonnegative().nullable().meta({
      description: "Number of outbox messages awaiting publish.",
      example: 3,
    }),
    schedulerRequired: z.boolean().meta({
      description:
        "Whether a scheduler must be running for correct ERP operation.",
      example: true,
    }),
    triggerDeploymentVersion: z.string().nullable().meta({
      description: "Deployed Trigger.dev deployment version string.",
      example: "20260626.1",
    }),
    triggerGitCommitSha: z.string().nullable().meta({
      description: "Git commit SHA reported by the Trigger.dev deployment.",
      example: "a1b2c3d4e5f6789012345678abcdef0123456789",
    }),
    triggerProviderState: triggerProviderStateSchema.meta({
      description: "Live connectivity state of the Trigger.dev provider.",
    }),
    triggerWorkerVersion: z.string().nullable().meta({
      description: "Semantic version of the Trigger worker runtime.",
      example: "3.2.1",
    }),
    workerReleaseAligned: z.boolean().meta({
      description:
        "Whether the Trigger worker release matches the ERP deployment.",
      example: true,
    }),
    workerReleaseCheckRequired: z.boolean().meta({
      description:
        "Whether worker release alignment checks are enforced for this deployment.",
      example: true,
    }),
  })
  .meta({
    id: "ExecutionSpineDiagnostics",
    description:
      "Execution spine diagnostics covering outbox, scheduler, and Trigger worker alignment.",
  });

export type ExecutionSpineDiagnosticsDto = z.infer<
  typeof executionSpineDiagnosticsSchema
>;

export const healthResponseSchema = z
  .object({
    executionSpine: executionSpineDiagnosticsSchema.meta({
      description: "Diagnostics for background job and outbox execution.",
    }),
    service: z.literal("erp").meta({
      description: "Logical service identifier for this health probe.",
      example: "erp",
    }),
    status: z.enum(["ok", "degraded", "critical"]).meta({
      description:
        "Overall ERP health status derived from execution spine diagnostics.",
      example: "ok",
    }),
  })
  .meta({
    id: "HealthResponse",
    description:
      "Health probe payload for load balancers and monitoring integrations.",
  });

export type HealthResponseDto = z.infer<typeof healthResponseSchema>;

export const healthGetContract = {
  authPolicy: "public",
  cache: { kind: "revalidate", seconds: 30 },
  contextPolicy: "none",
  documentationPath: API_GOVERNANCE_DOCUMENTATION_PATH,
  id: "internal.v1.health.get",
  summary: "Get ERP health status",
  description:
    "Returns service health and execution spine diagnostics for load balancers and monitoring probes. Public route; no session required.",
  lifecycle: "active",
  method: "GET",
  owner: API_ROUTE_OWNER,
  path: "/api/internal/v1/health",
  rateLimitPolicy: "anonymous-low",
  requestSchema: z.undefined(),
  requestSchemaRef:
    "apps/erp/src/server/api/contracts/health.api-contract.ts#request:none",
  responseSchema: healthResponseSchema,
  responseSchemaRef:
    "apps/erp/src/server/api/contracts/health.api-contract.ts#healthResponseSchema",
  runtime: "nodejs",
  stability: "internal-stable",
  tags: ["health", "public"],
  testPaths: DEFAULT_GOVERNED_ROUTE_TEST_PATHS,
  version: "v1",
} as const satisfies ApiRouteContract<undefined, HealthResponseDto>;
