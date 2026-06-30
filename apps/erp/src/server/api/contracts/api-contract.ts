import type { ZodType } from "zod";

import type { ApiAuthPolicy } from "./auth-policy.contract";
import type { ApiContextPolicy } from "./context-policy.contract";
import type { ApiConsumerImpactDeclaration } from "./core/api-consumer-impact.contract";
import type { ApiLifecycleMigrationMetadata } from "./core/api-lifecycle.contract";
import type { ApiOperationOwnershipOverride } from "./core/api-ownership.contract";
import type { ApiRouteLifecycleStatus } from "./lifecycle.contract";
import type { ApiRateLimitPolicy } from "./rate-limit.contract";
import type { ApiStabilityClassification } from "./stability.contract";

export type ApiHttpMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";

export type ApiRuntime = "edge" | "nodejs";

export type ApiCachePolicy =
  | { readonly kind: "no-store" }
  | { readonly kind: "revalidate"; readonly seconds: number }
  | { readonly kind: "static" };

export interface ApiRoutePermissionPolicy {
  readonly mode: "required";
  readonly permission: string;
}

export interface ApiAuditPolicy {
  readonly action: string;
  readonly enabled: boolean;
  readonly targetType: string;
}

export interface ApiIdempotencyPolicy {
  readonly mode: "optional" | "required";
}

export interface ApiPaginationPolicy {
  readonly mode: "cursor";
}

export interface ApiListQueryPolicy {
  readonly allowedFilterFields: readonly string[];
  readonly allowedSortFields: readonly string[];
}

export interface ApiRouteContract<TRequest, TResponse> {
  readonly audit?: ApiAuditPolicy;
  /**
   * Actor policy source (PAS-API-001 API-006).
   * Resolved via {@link resolveActorPolicy} — declaration only, not evaluation.
   */
  readonly authPolicy: ApiAuthPolicy;
  readonly cache: ApiCachePolicy;
  /**
   * Consumer impact classes (PAS-API-001 API-014).
   * Required on deprecated/breaking transitions; inferred for active internal v1 when omitted.
   */
  readonly consumerImpact?: ApiConsumerImpactDeclaration;
  /**
   * Operating context policy (PAS-API-001 API-007).
   * Resolved via {@link resolveOperatingContextPolicyDeclaration}.
   */
  readonly contextPolicy: ApiContextPolicy;
  /** Optional route narrative; generator falls back to a stability formula when omitted. */
  readonly description?: string;
  readonly documentationPath: string;
  /**
   * Stable cross-style operation identity (PAS-API-001 API-001).
   * Branded as {@link ApiOperationId} in {@link API_OPERATION_REGISTRY}.
   */
  readonly id: string;
  readonly idempotency?: ApiIdempotencyPolicy;
  readonly lifecycle: ApiRouteLifecycleStatus;
  readonly lifecycleMigration?: ApiLifecycleMigrationMetadata;
  readonly listQuery?: ApiListQueryPolicy;
  readonly method: ApiHttpMethod;
  readonly owner: "apps/erp";
  /**
   * Governance ownership dimensions (PAS-API-001 API-016).
   * Partial override; {@link resolveOperationOwnership} fills defaults.
   */
  readonly ownership?: ApiOperationOwnershipOverride;
  readonly pagination?: ApiPaginationPolicy;
  readonly path: string;
  /**
   * Permission capability intent (PAS-API-001 API-008).
   * Resolved via {@link resolvePermissionDeclaration} — not authorization evaluation.
   */
  readonly permission?: ApiRoutePermissionPolicy;
  readonly rateLimitPolicy: ApiRateLimitPolicy;
  readonly requestSchema: ZodType<TRequest>;
  /**
   * Canonical request schema authority pointer (PAS-API-001 API-003).
   * Branded via {@link parseApiSchemaAuthorityRef} at validation boundary.
   * Ingress validation (API-004) applies per {@link resolveValidationDirectionPolicy}.
   */
  readonly requestSchemaRef: string;
  readonly responseSchema: ZodType<TResponse>;
  /**
   * Canonical response schema authority pointer (PAS-API-001 API-003).
   * Branded via {@link parseApiSchemaAuthorityRef} at validation boundary.
   * Egress validation (API-005) applies per {@link resolveValidationDirectionPolicy}.
   */
  readonly responseSchemaRef: string;
  readonly runtime: ApiRuntime;
  readonly stability: ApiStabilityClassification;
  /** Human-readable short title projected to OpenAPI operation summary. */
  readonly summary: string;
  readonly tags: readonly string[];
  readonly testPaths: readonly string[];
  readonly version: "v1";
}

/** PAS-API-001 family layer — single barrel; prefer over deep `core/*` paths. */
export * from "./core/index";
