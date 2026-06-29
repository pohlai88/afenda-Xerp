/**
 * PAS-API-001 API-014 — consumer impact classification.
 * Style-agnostic — migration notices project affected classes per binding.
 */

import type { ApiRouteContract } from "../api-contract";
import { isPublicAuthPolicy } from "../auth-policy.contract";
import { isMutationMethod } from "../method-policy.contract";
import type { ApiStabilityClassification } from "../stability.contract";
import { isDeprecatedStabilityClassification } from "../stability.contract";
import type { ApiBreakingChangeClass } from "./api-lifecycle.contract";
import { resolveBreakingChangeClass } from "./api-lifecycle.contract";

/** Consumer impact classes (North Star §8.5). */
export const API_CONSUMER_IMPACT_CLASSES = [
  "agent",
  "internal-service",
  "internal-ui",
  "partner",
  "public-client",
] as const;

export type ApiConsumerImpactClass =
  (typeof API_CONSUMER_IMPACT_CLASSES)[number];

export interface ApiConsumerImpactDeclaration {
  readonly affected: readonly ApiConsumerImpactClass[];
}

export interface ApiOperationConsumerImpactDeclaration {
  readonly consumerImpact: ApiConsumerImpactDeclaration;
  readonly explicit: boolean;
}

function isConsumerImpactClass(value: string): value is ApiConsumerImpactClass {
  return (API_CONSUMER_IMPACT_CLASSES as readonly string[]).includes(value);
}

function assertValidConsumerImpactClasses(
  classes: readonly string[],
  operationId: string
): readonly ApiConsumerImpactClass[] {
  const normalized = classes.filter(isConsumerImpactClass);

  if (normalized.length === 0) {
    throw new Error(
      `Operation ${operationId} must declare at least one consumer impact class.`
    );
  }

  return normalized;
}

function requiresExplicitConsumerImpact(input: {
  readonly breakingChange: ApiBreakingChangeClass;
  readonly lifecycle: ApiRouteContract<unknown, unknown>["lifecycle"];
  readonly stability: ApiStabilityClassification;
}): boolean {
  return (
    input.lifecycle === "deprecated" ||
    input.breakingChange === "breaking" ||
    input.breakingChange === "deprecated" ||
    isDeprecatedStabilityClassification(input.stability)
  );
}

function inferDefaultConsumerImpactClasses(
  contract: Pick<
    ApiRouteContract<unknown, unknown>,
    "authPolicy" | "method" | "tags"
  >
): readonly ApiConsumerImpactClass[] {
  const classes = new Set<ApiConsumerImpactClass>([
    "internal-ui",
    "internal-service",
  ]);

  if (isPublicAuthPolicy(contract.authPolicy)) {
    classes.add("public-client");
    classes.add("agent");
  }

  if (contract.authPolicy === "service-token-required") {
    classes.delete("internal-ui");
    classes.add("internal-service");
  }

  if (isMutationMethod(contract.method)) {
    classes.add("agent");
  }

  if (contract.tags.includes("public")) {
    classes.add("public-client");
  }

  return [...classes];
}

export function resolveConsumerImpactDeclaration(
  contract: Pick<
    ApiRouteContract<unknown, unknown>,
    "authPolicy" | "id" | "lifecycle" | "method" | "stability" | "tags"
  > & {
    readonly consumerImpact?: ApiConsumerImpactDeclaration;
  }
): ApiOperationConsumerImpactDeclaration {
  const breakingChange = resolveBreakingChangeClass(contract);
  const explicitRequired = requiresExplicitConsumerImpact({
    breakingChange,
    lifecycle: contract.lifecycle,
    stability: contract.stability,
  });

  if (contract.consumerImpact !== undefined) {
    return {
      consumerImpact: {
        affected: assertValidConsumerImpactClasses(
          [...contract.consumerImpact.affected],
          contract.id
        ),
      },
      explicit: true,
    };
  }

  if (explicitRequired) {
    throw new Error(
      `Deprecated or breaking operation ${contract.id} must declare consumer impact classes.`
    );
  }

  if (contract.lifecycle !== "active" && contract.lifecycle !== "planned") {
    throw new Error(
      `Operation ${contract.id} with lifecycle ${contract.lifecycle} requires explicit consumer impact.`
    );
  }

  return {
    consumerImpact: {
      affected: inferDefaultConsumerImpactClasses(contract),
    },
    explicit: false,
  };
}

export function assertRegistryConsumerImpactPolicy<
  TContract extends ApiRouteContract<unknown, unknown>,
>(
  contracts: readonly TContract[]
): readonly ApiOperationConsumerImpactDeclaration[] {
  return contracts.map((contract) => {
    if (contract.lifecycle === "removed") {
      throw new Error(
        `Removed operation ${contract.id} must not remain in registry consumer impact policy.`
      );
    }

    return resolveConsumerImpactDeclaration(contract);
  });
}

export function buildOperationConsumerImpactRegistry<
  TContract extends ApiRouteContract<unknown, unknown>,
>(
  contracts: readonly TContract[]
): ReadonlyMap<string, ApiOperationConsumerImpactDeclaration> {
  const declarations = assertRegistryConsumerImpactPolicy(contracts);
  const registry = new Map<string, ApiOperationConsumerImpactDeclaration>();

  for (const [index, contract] of contracts.entries()) {
    const declaration = declarations[index];
    if (declaration === undefined) {
      throw new Error(
        `Missing consumer impact declaration for contract index ${index}.`
      );
    }
    registry.set(contract.id, declaration);
  }

  return registry;
}
