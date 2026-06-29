import type { ExecutionSpineOperationalStatus } from "@/lib/outbox/execution-spine-diagnostics.server";
import { collectExecutionSpineDiagnostics } from "@/lib/outbox/execution-spine-diagnostics.server";
import { healthGetContract } from "@/server/api/contracts/health.api-contract";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";

export const runtime = "nodejs";
export const dynamic = "auto";
export const revalidate = 30;

function mapHealthStatus(
  operationalStatus: ExecutionSpineOperationalStatus
): "ok" | "degraded" | "critical" {
  if (operationalStatus === "critical") {
    return "critical";
  }

  if (operationalStatus === "degraded") {
    return "degraded";
  }

  return "ok";
}

export const GET = createApiHandler({
  contract: healthGetContract,
  resolveSuccessStatus(data) {
    return data.status === "critical" ? 503 : 200;
  },
  async handler() {
    const executionSpine = await collectExecutionSpineDiagnostics();

    return {
      executionSpine,
      service: "erp",
      status: mapHealthStatus(executionSpine.operationalStatus),
    } as const;
  },
});
