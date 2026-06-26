import type { ZodType } from "zod";

import type { ApiAuthPolicy } from "./auth-policy.contract";
import type { ApiContextPolicy } from "./context-policy.contract";
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

export interface ApiRouteContract<TRequest, TResponse> {
  readonly audit?: ApiAuditPolicy;
  readonly authPolicy: ApiAuthPolicy;
  readonly cache: ApiCachePolicy;
  readonly contextPolicy: ApiContextPolicy;
  /** Optional route narrative; generator falls back to a stability formula when omitted. */
  readonly description?: string;
  readonly documentationPath: string;
  readonly id: string;
  readonly idempotency?: ApiIdempotencyPolicy;
  readonly lifecycle: ApiRouteLifecycleStatus;
  readonly method: ApiHttpMethod;
  readonly owner: "apps/erp";
  readonly pagination?: ApiPaginationPolicy;
  readonly path: string;
  readonly permission?: ApiRoutePermissionPolicy;
  readonly rateLimitPolicy: ApiRateLimitPolicy;
  readonly requestSchema: ZodType<TRequest>;
  readonly requestSchemaRef: string;
  readonly responseSchema: ZodType<TResponse>;
  readonly responseSchemaRef: string;
  readonly runtime: ApiRuntime;
  readonly stability: ApiStabilityClassification;
  /** Human-readable short title projected to OpenAPI operation summary. */
  readonly summary: string;
  readonly tags: readonly string[];
  readonly testPaths: readonly string[];
  readonly version: "v1";
}
