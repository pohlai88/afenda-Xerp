/**
 * PAS-API-001 API-012 / API-013 — lifecycle and breaking-change classification.
 * Style-agnostic — REST/OpenAPI and other bindings project publication artifacts.
 */

import type { ApiRouteContract } from "../api-contract";
import type { ApiRouteLifecycleStatus } from "../lifecycle.contract";
import { isMutationMethod } from "../method-policy.contract";
import type { ApiStabilityClassification } from "../stability.contract";
import { isDeprecatedStabilityClassification } from "../stability.contract";

/** Family lifecycle vocabulary (North Star / PAS-API-001 API-012). */
export const API_FAMILY_LIFECYCLE_STATUSES = [
  "active",
  "deprecated",
  "proposed",
  "retired",
] as const;

export type ApiFamilyLifecycleStatus =
  (typeof API_FAMILY_LIFECYCLE_STATUSES)[number];

export const API_BREAKING_CHANGE_CLASSES = [
  "additive",
  "breaking",
  "compatible",
  "deprecated",
] as const;

export type ApiBreakingChangeClass =
  (typeof API_BREAKING_CHANGE_CLASSES)[number];

export interface ApiLifecycleMigrationMetadata {
  readonly replacementOperationId?: string;
  readonly sunsetAt?: string;
}

export interface ApiOperationLifecycleDeclaration {
  readonly breakingChange: ApiBreakingChangeClass;
  readonly familyLifecycle: ApiFamilyLifecycleStatus;
  readonly migration?: ApiLifecycleMigrationMetadata;
  readonly routeLifecycle: ApiRouteLifecycleStatus;
  readonly stability: ApiStabilityClassification;
}

export function mapRouteLifecycleToFamily(
  lifecycle: ApiRouteLifecycleStatus
): ApiFamilyLifecycleStatus {
  switch (lifecycle) {
    case "planned":
      return "proposed";
    case "active":
      return "active";
    case "deprecated":
      return "deprecated";
    case "removed":
      return "retired";
    default: {
      const exhaustive: never = lifecycle;
      throw new Error(`Unsupported route lifecycle: ${exhaustive}`);
    }
  }
}

export function resolveBreakingChangeClass(
  contract: Pick<
    ApiRouteContract<unknown, unknown>,
    "lifecycle" | "method" | "stability"
  >
): ApiBreakingChangeClass {
  if (
    contract.lifecycle === "deprecated" ||
    isDeprecatedStabilityClassification(contract.stability)
  ) {
    return "deprecated";
  }

  if (contract.lifecycle === "planned") {
    return "additive";
  }

  if (isMutationMethod(contract.method)) {
    return "compatible";
  }

  return "compatible";
}

export function extractOperationLifecycleDeclaration(
  contract: Pick<
    ApiRouteContract<unknown, unknown>,
    "lifecycle" | "method" | "stability"
  > & {
    readonly lifecycleMigration?: ApiLifecycleMigrationMetadata;
  }
): ApiOperationLifecycleDeclaration {
  const base = {
    breakingChange: resolveBreakingChangeClass(contract),
    familyLifecycle: mapRouteLifecycleToFamily(contract.lifecycle),
    routeLifecycle: contract.lifecycle,
    stability: contract.stability,
  };

  if (contract.lifecycleMigration === undefined) {
    return base;
  }

  return {
    ...base,
    migration: contract.lifecycleMigration,
  };
}

export function assertLifecycleMigrationRule(
  contract: Pick<
    ApiRouteContract<unknown, unknown>,
    "id" | "lifecycle" | "stability"
  > & {
    readonly lifecycleMigration?: ApiLifecycleMigrationMetadata;
  }
): void {
  const deprecatedSignal =
    contract.lifecycle === "deprecated" ||
    isDeprecatedStabilityClassification(contract.stability);

  if (!deprecatedSignal || contract.lifecycle !== "active") {
    return;
  }

  const migration = contract.lifecycleMigration;
  const hasMigrationMetadata =
    migration !== undefined &&
    (migration.replacementOperationId !== undefined ||
      migration.sunsetAt !== undefined);

  if (!hasMigrationMetadata) {
    throw new Error(
      `Deprecated active operation ${contract.id} requires lifecycle migration metadata.`
    );
  }
}

export function assertRegistryLifecyclePolicy<
  TContract extends ApiRouteContract<unknown, unknown>,
>(
  contracts: readonly TContract[]
): readonly ApiOperationLifecycleDeclaration[] {
  return contracts.map((contract) => {
    assertActiveRouteLifecycleEnforced(contract.lifecycle);
    assertLifecycleMigrationRule(contract);

    return extractOperationLifecycleDeclaration(contract);
  });
}

export function buildOperationLifecycleRegistry<
  TContract extends ApiRouteContract<unknown, unknown>,
>(
  contracts: readonly TContract[]
): ReadonlyMap<string, ApiOperationLifecycleDeclaration> {
  const declarations = assertRegistryLifecyclePolicy(contracts);
  const registry = new Map<string, ApiOperationLifecycleDeclaration>();

  for (const [index, contract] of contracts.entries()) {
    const declaration = declarations[index];
    if (declaration === undefined) {
      throw new Error(
        `Missing lifecycle declaration for contract index ${index}.`
      );
    }
    registry.set(contract.id, declaration);
  }

  return registry;
}

function assertActiveRouteLifecycleEnforced(
  lifecycle: ApiRouteLifecycleStatus
): void {
  if (lifecycle === "removed") {
    throw new Error(
      "Removed API routes must not remain registered in the operation registry."
    );
  }
}
