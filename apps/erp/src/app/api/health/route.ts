/**
 * Infrastructure liveness probe — NOT part of the governed Afenda internal v1 API.
 *
 * - Purpose: load balancer / platform health checks only.
 * - Contract: bare `{ status: "ok" }` with no governed envelope, auth, or rate-limit policy.
 * - Governed ERP health diagnostics: GET `/api/internal/v1/health` (see health.api-contract.ts).
 */
export const runtime = "nodejs";
export const dynamic = "auto";
export const revalidate = 30;

export function GET() {
  return Response.json({ status: "ok" }, { status: 200 });
}
