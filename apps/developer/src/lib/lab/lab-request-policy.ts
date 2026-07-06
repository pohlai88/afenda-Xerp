export const LAB_CORRELATION_ID_HEADER = "x-correlation-id" as const;

/**
 * Client-supplied tenant / operating-context headers must never influence
 * route-lab rendering before P5 authority exists.
 */
export const LAB_FORBIDDEN_SPOOF_HEADERS = [
  "x-tenant-slug",
  "x-tenant-id",
  "x-operating-context",
] as const;

export type LabRequestPolicyBehavior =
  | "correlation-id-pass-through"
  | "strip-spoof-tenant-headers";

export type LabRequestPolicyForbid =
  | "auth-redirect"
  | "session-gate"
  | "tenant-injection";

export interface LabRequestPolicyRule {
  behaviors: readonly LabRequestPolicyBehavior[];
  description: string;
  forbids: readonly LabRequestPolicyForbid[];
}

export const labRequestPolicyRule = {
  behaviors: [
    "correlation-id-pass-through",
    "strip-spoof-tenant-headers",
  ] as const,
  description:
    "Route-lab edge proxy mirrors ERP correlation-id pass-through only — no auth redirect or tenant routing.",
  forbids: ["auth-redirect", "session-gate", "tenant-injection"] as const,
} satisfies LabRequestPolicyRule;

export function resolveLabCorrelationId(incoming: string | null): string {
  const trimmed = incoming?.trim();

  if (trimmed) {
    return trimmed;
  }

  return crypto.randomUUID();
}

export function stripForbiddenSpoofHeaders(headers: Headers): Headers {
  const sanitized = new Headers(headers);

  for (const headerName of LAB_FORBIDDEN_SPOOF_HEADERS) {
    sanitized.delete(headerName);
  }

  return sanitized;
}
