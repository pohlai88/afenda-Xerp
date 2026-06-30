/**
 * PAS-API-001 API-010 / API-011 — correlation identity and audit replay minimum.
 * Style-agnostic — REST/ProblemDetail and other bindings project wire formats.
 */

import type { ApiRouteContract } from "../api-contract";
import type { ApiContextPolicy } from "../context-policy.contract";
import type { ApiRouteLifecycleStatus } from "../lifecycle.contract";
import type { Brand } from "./api-operation-id.contract";
import { extractOperationPolicyDeclaration } from "./api-policy.contract";

/** Branded trace identity — aligns with kernel correlation vocabulary at wire boundary. */
export type ApiCorrelationId = Brand<string, "ApiCorrelationId">;

export type ApiRequestId = Brand<string, "ApiRequestId">;

export interface ApiCorrelationIdentity {
  readonly correlationId: ApiCorrelationId;
  readonly requestId: ApiRequestId;
}

export type ApiCorrelationPolicy =
  | { readonly kind: "optional" }
  | { readonly kind: "required-for-governed-operation" };

export function parseApiCorrelationId(value: string): ApiCorrelationId {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error("ApiCorrelationId is required.");
  }
  return trimmed as ApiCorrelationId;
}

export function parseApiRequestId(value: string): ApiRequestId {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error("ApiRequestId is required.");
  }
  return trimmed as ApiRequestId;
}

export function unbrandApiCorrelationId(value: ApiCorrelationId): string {
  return value;
}

export function unbrandApiRequestId(value: ApiRequestId): string {
  return value;
}

export function parseApiCorrelationIdentity(input: {
  readonly correlationId: string;
  readonly requestId: string;
}): ApiCorrelationIdentity {
  return {
    correlationId: parseApiCorrelationId(input.correlationId),
    requestId: parseApiRequestId(input.requestId),
  };
}

export function resolveCorrelationPolicy(
  contract: Pick<ApiRouteContract<unknown, unknown>, "id" | "lifecycle">
): ApiCorrelationPolicy {
  if (contract.lifecycle === "active") {
    return { kind: "required-for-governed-operation" };
  }

  return { kind: "optional" };
}

/** API-011 — minimum readonly facts required for audit replay attribution. */
export interface ApiAuditReplayMinimumRecord {
  readonly actorKind: "anonymous" | "human-session" | "service-actor";
  readonly contextPolicy: ApiContextPolicy;
  readonly correlation: ApiCorrelationIdentity;
  readonly lifecycle: ApiRouteLifecycleStatus;
  readonly operationId: string;
  readonly recordedAt: string;
}

export function buildAuditReplayMinimumRecord(input: {
  readonly contract: Pick<
    ApiRouteContract<unknown, unknown>,
    "authPolicy" | "contextPolicy" | "id" | "lifecycle" | "permission"
  >;
  readonly correlation: ApiCorrelationIdentity;
  readonly recordedAt: string;
}): ApiAuditReplayMinimumRecord {
  const policy = extractOperationPolicyDeclaration(input.contract);

  return {
    actorKind: policy.actor.kind,
    contextPolicy: input.contract.contextPolicy,
    correlation: input.correlation,
    lifecycle: input.contract.lifecycle,
    operationId: input.contract.id,
    recordedAt: input.recordedAt,
  };
}

export function assertRegistryCorrelationPolicy<
  TContract extends ApiRouteContract<unknown, unknown>,
>(contracts: readonly TContract[]): void {
  for (const contract of contracts) {
    const policy = resolveCorrelationPolicy(contract);
    if (
      contract.lifecycle === "active" &&
      policy.kind !== "required-for-governed-operation"
    ) {
      throw new Error(
        `Active governed operation ${contract.id} must require correlation identity.`
      );
    }
  }
}
