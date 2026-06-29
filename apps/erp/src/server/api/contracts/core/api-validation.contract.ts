/**
 * PAS-API-001 API-003 — cross-style schema authority (family layer).
 * PAS-API-001 API-004 / API-005 — validation direction policy (family layer).
 * Shapes are declared before runtime bindings (REST/OpenAPI, RPC, etc.) serialize them.
 */

import type { ApiRouteContract } from "../api-contract";
import { isPublicAuthPolicy } from "../auth-policy.contract";
import { isMutationMethod } from "../method-policy.contract";
import type { Brand } from "./api-operation-id.contract";

export type ApiSchemaAuthorityRef = Brand<string, "ApiSchemaAuthorityRef">;

/**
 * Style-agnostic authority pointer: `{repo-relative-module}.ts#{export}`.
 * Must not use OpenAPI paths, URLs, or binding-specific locators.
 */
const SCHEMA_AUTHORITY_REF_PATTERN =
  /^apps\/erp\/src\/server\/api\/contracts\/[\w./-]+\.ts#[\w:-]+$/;

export type ApiSchemaKind = "event" | "message" | "request" | "response";

export interface ApiSchemaAuthority {
  readonly kind: ApiSchemaKind;
  readonly ref: ApiSchemaAuthorityRef;
}

/** Operation-level schema authority — invariant API-003 declared-before-runtime. */
export interface ApiOperationSchemaAuthority {
  readonly authorityKind: "declared-before-runtime";
  readonly request: ApiSchemaAuthorityRef;
  readonly response: ApiSchemaAuthorityRef;
}

export function isValidSchemaAuthorityRefFormat(value: string): boolean {
  if (value.includes("openapi") || value.includes("://")) {
    return false;
  }
  return SCHEMA_AUTHORITY_REF_PATTERN.test(value);
}

/** Trust boundary — brand validated schema authority pointers. */
export function parseApiSchemaAuthorityRef(value: string): ApiSchemaAuthorityRef {
  if (!isValidSchemaAuthorityRefFormat(value)) {
    throw new Error(`Invalid ApiSchemaAuthorityRef format: ${value}`);
  }
  return value as ApiSchemaAuthorityRef;
}

export function unbrandApiSchemaAuthorityRef(
  value: ApiSchemaAuthorityRef
): string {
  return value;
}

export function extractOperationSchemaAuthority(
  contract: Pick<
    ApiRouteContract<unknown, unknown>,
    "requestSchemaRef" | "responseSchemaRef"
  >
): ApiOperationSchemaAuthority {
  return {
    authorityKind: "declared-before-runtime",
    request: parseApiSchemaAuthorityRef(contract.requestSchemaRef),
    response: parseApiSchemaAuthorityRef(contract.responseSchemaRef),
  };
}

export function assertRegistrySchemaAuthority<
  TContract extends ApiRouteContract<unknown, unknown>,
>(contracts: readonly TContract[]): readonly ApiOperationSchemaAuthority[] {
  return contracts.map((contract) => extractOperationSchemaAuthority(contract));
}

export function buildOperationSchemaAuthorityRegistry<
  TContract extends ApiRouteContract<unknown, unknown>,
>(
  contracts: readonly TContract[]
): ReadonlyMap<string, ApiOperationSchemaAuthority> {
  const authorities = assertRegistrySchemaAuthority(contracts);
  const registry = new Map<string, ApiOperationSchemaAuthority>();

  for (const [index, contract] of contracts.entries()) {
    const authority = authorities[index];
    if (authority === undefined) {
      throw new Error(`Missing schema authority for contract index ${index}.`);
    }
    registry.set(contract.id, authority);
  }

  return registry;
}

/** API-004 — caller input validated before business execution. */
export type ApiIngressValidationPolicy =
  | { readonly phase: "before-business-execution"; readonly required: true }
  | { readonly phase: "before-business-execution"; readonly required: false };

/** API-005 — runtime output validated before serialization or dispatch. */
export type ApiEgressValidationPolicy =
  | { readonly phase: "before-serialization"; readonly required: true }
  | { readonly phase: "before-serialization"; readonly required: false };

/** Style-agnostic bidirectional validation policy for a governed operation. */
export interface ApiValidationDirectionPolicy {
  readonly egress: ApiEgressValidationPolicy;
  readonly ingress: ApiIngressValidationPolicy;
}

export type ApiOperationExposureClass = "protected" | "public";

export type ApiOperationInteractionClass = "mutation" | "read";

export function classifyOperationExposure(
  authPolicy: ApiRouteContract<unknown, unknown>["authPolicy"]
): ApiOperationExposureClass {
  return isPublicAuthPolicy(authPolicy) ? "public" : "protected";
}

export function classifyOperationInteraction(
  method: ApiRouteContract<unknown, unknown>["method"]
): ApiOperationInteractionClass {
  return isMutationMethod(method) ? "mutation" : "read";
}

/**
 * Resolve family validation direction from registry contract metadata.
 * REST binding maps method/body to wire ingress/egress execution (R3a+).
 */
export function resolveValidationDirectionPolicy(
  contract: Pick<ApiRouteContract<unknown, unknown>, "authPolicy" | "method">
): ApiValidationDirectionPolicy {
  const exposure = classifyOperationExposure(contract.authPolicy);
  const interaction = classifyOperationInteraction(contract.method);

  const ingressRequired =
    exposure === "protected" || interaction === "mutation";

  const egressRequired = interaction === "mutation" || exposure === "protected";

  return {
    egress: {
      phase: "before-serialization",
      required: egressRequired,
    },
    ingress: {
      phase: "before-business-execution",
      required: ingressRequired,
    },
  };
}

export function extractOperationValidationDirection(
  contract: Pick<ApiRouteContract<unknown, unknown>, "authPolicy" | "method">
): ApiValidationDirectionPolicy {
  return resolveValidationDirectionPolicy(contract);
}

export function assertRegistryValidationDirection<
  TContract extends ApiRouteContract<unknown, unknown>,
>(
  contracts: readonly TContract[]
): readonly ApiValidationDirectionPolicy[] {
  return contracts.map((contract) => {
    const policy = resolveValidationDirectionPolicy(contract);
    const exposure = classifyOperationExposure(contract.authPolicy);
    const interaction = classifyOperationInteraction(contract.method);

    if (exposure === "protected" && policy.ingress.required !== true) {
      throw new Error(
        `Protected operation ${contract.id} must require ingress validation.`
      );
    }

    if (interaction === "mutation" && policy.egress.required !== true) {
      throw new Error(
        `Mutation operation ${contract.id} must require egress validation.`
      );
    }

    return policy;
  });
}

export function buildOperationValidationDirectionRegistry<
  TContract extends ApiRouteContract<unknown, unknown>,
>(
  contracts: readonly TContract[]
): ReadonlyMap<string, ApiValidationDirectionPolicy> {
  const policies = assertRegistryValidationDirection(contracts);
  const registry = new Map<string, ApiValidationDirectionPolicy>();

  for (const [index, contract] of contracts.entries()) {
    const policy = policies[index];
    if (policy === undefined) {
      throw new Error(
        `Missing validation direction policy for contract index ${index}.`
      );
    }
    registry.set(contract.id, policy);
  }

  return registry;
}
