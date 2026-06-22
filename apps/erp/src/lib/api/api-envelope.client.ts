import type {
  ApiEnvelope,
  ApiErrorEnvelope,
  ApiSuccessEnvelope,
} from "@/server/api/contracts/api-envelope.contract";

export type { ApiEnvelope, ApiErrorEnvelope, ApiSuccessEnvelope };

export type { ApiClientErrorBody } from "@/server/api/contracts/api-envelope.contract";

export {
  isApiErrorEnvelope,
  isApiSuccessEnvelope,
} from "@/server/api/contracts/api-envelope.contract";

const POLICY_GATE_DECISIONS = [
  "require_approval",
  "require_evidence",
  "require_step_up",
  "readonly",
] as const;

export type ApiPolicyGateDecision = (typeof POLICY_GATE_DECISIONS)[number];

function isApiPolicyGateDecision(
  value: unknown
): value is ApiPolicyGateDecision {
  return (
    typeof value === "string" &&
    (POLICY_GATE_DECISIONS as readonly string[]).includes(value)
  );
}

export interface ApiPolicyGateErrorDetails {
  readonly gateDecision: ApiPolicyGateDecision;
}

export function readApiPolicyGateDecision(
  envelope: ApiEnvelope<unknown>
): ApiPolicyGateDecision | null {
  if (envelope.ok !== false || envelope.error.code !== "forbidden") {
    return null;
  }

  const details = envelope.error.details;

  if (typeof details !== "object" || details === null) {
    return null;
  }

  if (!("gateDecision" in details)) {
    return null;
  }

  const gateDecision = details.gateDecision;
  return isApiPolicyGateDecision(gateDecision) ? gateDecision : null;
}

export function isApiPolicyGatedEnvelope(
  envelope: ApiEnvelope<unknown>
): envelope is ApiErrorEnvelope {
  return readApiPolicyGateDecision(envelope) !== null;
}

export async function readApiEnvelope<TData>(
  response: Response
): Promise<ApiEnvelope<TData>> {
  const payload: unknown = await response.json();

  if (typeof payload !== "object" || payload === null || !("ok" in payload)) {
    throw new Error("Invalid API response envelope.");
  }

  if (typeof payload.ok !== "boolean") {
    throw new Error("Invalid API response envelope.");
  }

  return payload as ApiEnvelope<TData>;
}

export function resolveApiEnvelopeErrorMessage(
  envelope: ApiEnvelope<unknown>,
  fallback: string
): string {
  if (envelope.ok === false) {
    return envelope.error.message;
  }

  return fallback;
}
