import { labHealthResponseSchema } from "@/lib/lab/lab-api-contracts";

/**
 * Route-lab infrastructure liveness probe — NOT an ERP internal v1 API.
 *
 * - Purpose: green-light smoke and platform health checks for the sandbox only.
 * - Contract: typed lab health payload with no auth, tenant, or BFF behavior.
 * - Governed ERP health diagnostics remain in apps/erp at `/api/internal/v1/health`.
 */
export const runtime = "nodejs";
export const dynamic = "auto";
export const revalidate = 30;

export function GET() {
  return Response.json(labHealthResponseSchema, { status: 200 });
}
