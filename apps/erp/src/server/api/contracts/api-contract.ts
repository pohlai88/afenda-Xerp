import type { ZodType } from "zod";

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

export interface ApiRouteContract<TRequest, TResponse> {
  readonly audit?: ApiAuditPolicy;
  readonly cache: ApiCachePolicy;
  readonly id: string;
  readonly method: ApiHttpMethod;
  readonly path: string;
  readonly permission?: ApiRoutePermissionPolicy;
  readonly requestSchema: ZodType<TRequest>;
  readonly responseSchema: ZodType<TResponse>;
  readonly runtime: ApiRuntime;
  readonly tags: readonly string[];
  readonly version: "v1";
}
