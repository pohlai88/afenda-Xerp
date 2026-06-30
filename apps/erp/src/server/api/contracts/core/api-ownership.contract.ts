/**
 * PAS-API-001 API-016 — operation contract ownership accountability.
 * Governance identifiers only — not org-chart HR data.
 */

import type { ApiRouteContract } from "../api-contract";
import {
  API_CONTRACT_DEFAULT_OWNERSHIP,
  API_GOVERNANCE_DOMAIN_OWNER,
} from "../api-governance.constants";

/** Four ownership dimensions (North Star §14.6). */
export interface ApiOperationOwnershipMetadata {
  readonly consumerImpactOwner: string;
  readonly domainOwner: string;
  readonly lifecycleOwner: string;
  readonly technicalOwner: string;
}

export type ApiOperationOwnershipOverride = Partial<
  Pick<
    ApiOperationOwnershipMetadata,
    "consumerImpactOwner" | "domainOwner" | "lifecycleOwner" | "technicalOwner"
  >
>;

function resolveDomainOwnerFromTags(tags: readonly string[]): string {
  const domainTag = tags.find((tag) => tag !== "public" && tag !== "telemetry");
  return domainTag ?? API_GOVERNANCE_DOMAIN_OWNER;
}

export function resolveOperationOwnership(
  contract: Pick<
    ApiRouteContract<unknown, unknown>,
    "id" | "owner" | "tags"
  > & {
    readonly ownership?: ApiOperationOwnershipOverride;
  }
): ApiOperationOwnershipMetadata {
  const override = contract.ownership;
  const domainOwner =
    override?.domainOwner ?? resolveDomainOwnerFromTags(contract.tags);

  return {
    consumerImpactOwner:
      override?.consumerImpactOwner ??
      API_CONTRACT_DEFAULT_OWNERSHIP.consumerImpactOwner,
    domainOwner,
    lifecycleOwner:
      override?.lifecycleOwner ?? API_CONTRACT_DEFAULT_OWNERSHIP.lifecycleOwner,
    technicalOwner: override?.technicalOwner ?? contract.owner,
  };
}

export function assertActiveOperationOwnership(
  contract: Pick<
    ApiRouteContract<unknown, unknown>,
    "id" | "lifecycle" | "owner" | "tags"
  > & {
    readonly ownership?: ApiOperationOwnershipOverride;
  }
): ApiOperationOwnershipMetadata {
  if (contract.lifecycle !== "active" && contract.lifecycle !== "planned") {
    throw new Error(
      `Ownership assertion applies to active or planned operations; got ${contract.lifecycle} for ${contract.id}.`
    );
  }

  const ownership = resolveOperationOwnership(contract);

  for (const [dimension, value] of Object.entries(ownership)) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(
        `Operation ${contract.id} missing ownership dimension: ${dimension}.`
      );
    }
  }

  return ownership;
}

export function buildOperationOwnershipRegistry<
  TContract extends ApiRouteContract<unknown, unknown>,
>(
  contracts: readonly TContract[]
): ReadonlyMap<string, ApiOperationOwnershipMetadata> {
  const registry = new Map<string, ApiOperationOwnershipMetadata>();

  for (const contract of contracts) {
    if (contract.lifecycle === "removed") {
      continue;
    }

    registry.set(contract.id, resolveOperationOwnership(contract));
  }

  return registry;
}
