import type { ApiRouteContract } from "./api-contract";
import {
  isPublicAuthPolicy,
  requiresSessionAuth,
} from "./auth-policy.contract";
import { assertActiveRouteLifecycle } from "./lifecycle.contract";

export interface ApiRouteCatalogEntry {
  readonly auditAction: string | null;
  readonly authPolicy: ApiRouteContract<unknown, unknown>["authPolicy"];
  readonly cache: ApiRouteContract<unknown, unknown>["cache"];
  readonly contextPolicy: ApiRouteContract<unknown, unknown>["contextPolicy"];
  readonly description: string | null;
  readonly documentationPath: string;
  readonly id: string;
  readonly lifecycle: ApiRouteContract<unknown, unknown>["lifecycle"];
  readonly method: ApiRouteContract<unknown, unknown>["method"];
  readonly owner: ApiRouteContract<unknown, unknown>["owner"];
  readonly path: string;
  readonly permission: string | null;
  readonly rateLimitPolicy: ApiRouteContract<
    unknown,
    unknown
  >["rateLimitPolicy"];
  readonly requestSchemaRef: string;
  readonly responseSchemaRef: string;
  readonly runtime: ApiRouteContract<unknown, unknown>["runtime"];
  readonly stability: ApiRouteContract<unknown, unknown>["stability"];
  readonly summary: string;
  readonly tags: readonly string[];
  readonly testPaths: readonly string[];
  readonly version: ApiRouteContract<unknown, unknown>["version"];
}

export interface ApiRouteCatalogDocument {
  readonly generatedFrom: "api-contract-registry";
  readonly routes: readonly ApiRouteCatalogEntry[];
  readonly schemaVersion: "1.0.0";
}

export function toApiRouteCatalogEntry(
  contract: ApiRouteContract<unknown, unknown>
): ApiRouteCatalogEntry {
  return {
    auditAction: contract.audit?.action ?? null,
    authPolicy: contract.authPolicy,
    cache: contract.cache,
    contextPolicy: contract.contextPolicy,
    documentationPath: contract.documentationPath,
    id: contract.id,
    lifecycle: contract.lifecycle,
    method: contract.method,
    owner: contract.owner,
    path: contract.path,
    permission: contract.permission?.permission ?? null,
    rateLimitPolicy: contract.rateLimitPolicy,
    requestSchemaRef: contract.requestSchemaRef,
    responseSchemaRef: contract.responseSchemaRef,
    runtime: contract.runtime,
    summary: contract.summary,
    description: contract.description ?? null,
    stability: contract.stability,
    tags: contract.tags,
    testPaths: contract.testPaths,
    version: contract.version,
  };
}

export function buildApiRouteCatalog(
  contracts: readonly ApiRouteContract<unknown, unknown>[]
): ApiRouteCatalogDocument {
  return {
    generatedFrom: "api-contract-registry",
    routes: contracts.map(toApiRouteCatalogEntry),
    schemaVersion: "1.0.0",
  };
}

export function assertRouteGovernancePolicy(
  contract: ApiRouteContract<unknown, unknown>
): void {
  assertActiveRouteLifecycle(contract.lifecycle);

  if (contract.owner !== "apps/erp") {
    throw new Error(`Contract ${contract.id} must declare owner apps/erp.`);
  }

  if (contract.documentationPath.length === 0) {
    throw new Error(`Contract ${contract.id} must declare documentationPath.`);
  }

  if (contract.requestSchemaRef.length === 0) {
    throw new Error(`Contract ${contract.id} must declare requestSchemaRef.`);
  }

  if (contract.responseSchemaRef.length === 0) {
    throw new Error(`Contract ${contract.id} must declare responseSchemaRef.`);
  }

  if (contract.testPaths.length === 0) {
    throw new Error(`Contract ${contract.id} must declare testPaths.`);
  }

  if (contract.summary.trim().length === 0) {
    throw new Error(
      `Contract ${contract.id} must declare a non-empty summary.`
    );
  }

  if (isPublicAuthPolicy(contract.authPolicy)) {
    if ("permission" in contract) {
      throw new Error(
        `Public contract ${contract.id} must not declare permission policy.`
      );
    }
    return;
  }

  if (requiresSessionAuth(contract.authPolicy)) {
    if (contract.tags.includes("auth") && !("permission" in contract)) {
      return;
    }

    if (!("permission" in contract)) {
      throw new Error(
        `Protected contract ${contract.id} must declare permission policy.`
      );
    }
  }
}

export function validateApiRouteCatalogCompleteness(
  contracts: readonly ApiRouteContract<unknown, unknown>[]
): string[] {
  const violations: string[] = [];

  for (const contract of contracts) {
    try {
      assertRouteGovernancePolicy(contract);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      violations.push(`${contract.id}: ${message}`);
    }
  }

  return violations;
}
