/**
 * PAS-001A-API-BINDING-S6 — ERP consumer impact sync.
 *
 * Classifies ERP UI and internal-service consumer impact on REST operations
 * per PAS-API-001 API-014 — governance metadata only, not marketing copy.
 */

import type { ApiRouteContract } from "./api-contract";
import { API_CONTRACT_DEFAULT_OWNERSHIP } from "./api-governance.constants";
import {
  type ApiConsumerImpactClass,
  type ApiOperationConsumerImpactDeclaration,
  assertRegistryConsumerImpactPolicy,
  resolveConsumerImpactDeclaration,
} from "./core/api-consumer-impact.contract";
import {
  type ApiOperationOwnershipMetadata,
  assertActiveOperationOwnership,
} from "./core/api-ownership.contract";
import type { ErpApiRuntimeEvidenceAttestation } from "./erp-api-runtime-evidence.contract";

/** ERP spine consumer surfaces affected by internal v1 REST operations. */
export const ERP_API_CONSUMER_IMPACT_SURFACES = [
  "internal-ui",
  "internal-service",
] as const;

export type ErpApiConsumerImpactSurface =
  (typeof ERP_API_CONSUMER_IMPACT_SURFACES)[number];

export const ERP_API_CONSUMER_IMPACT_FAMILY_INVARIANT = "API-014" as const;

export const ERP_API_CONSUMER_IMPACT_OWNER =
  API_CONTRACT_DEFAULT_OWNERSHIP.consumerImpactOwner;

export interface ErpApiConsumerImpactSyncAttestation {
  readonly activeOperationCount: number;
  readonly bindingKind: "erp-api-consumer-impact-sync";
  readonly consumerImpactOwner: typeof ERP_API_CONSUMER_IMPACT_OWNER;
  readonly consumesFamilyInvariant: typeof ERP_API_CONSUMER_IMPACT_FAMILY_INVARIANT;
  readonly erpConsumerSurfaceCount: number;
  readonly explicitImpactOperationCount: number;
  readonly integrationSurfaceId: "IS-004";
  readonly operationCount: number;
}

export function buildErpApiConsumerImpactSyncAttestation(input: {
  readonly contracts: readonly ApiRouteContract<unknown, unknown>[];
}): ErpApiConsumerImpactSyncAttestation {
  let activeOperationCount = 0;
  let explicitImpactOperationCount = 0;

  for (const contract of input.contracts) {
    if (contract.lifecycle === "active") {
      activeOperationCount += 1;
    }

    const impact = resolveConsumerImpactDeclaration(contract);
    if (impact.explicit) {
      explicitImpactOperationCount += 1;
    }
  }

  return {
    activeOperationCount,
    bindingKind: "erp-api-consumer-impact-sync",
    consumesFamilyInvariant: ERP_API_CONSUMER_IMPACT_FAMILY_INVARIANT,
    consumerImpactOwner: ERP_API_CONSUMER_IMPACT_OWNER,
    erpConsumerSurfaceCount: ERP_API_CONSUMER_IMPACT_SURFACES.length,
    explicitImpactOperationCount,
    integrationSurfaceId: "IS-004",
    operationCount: input.contracts.length,
  };
}

export function assertErpConsumerSurfacesRepresented(
  contract: Pick<ApiRouteContract<unknown, unknown>, "id" | "lifecycle">,
  impact: ApiOperationConsumerImpactDeclaration
): void {
  if (contract.lifecycle !== "active") {
    return;
  }

  const affectsErpConsumer = ERP_API_CONSUMER_IMPACT_SURFACES.some((surface) =>
    impact.consumerImpact.affected.includes(surface)
  );

  if (!affectsErpConsumer) {
    throw new Error(
      `Active operation ${contract.id} must classify impact on ERP consumer surfaces (internal-ui or internal-service).`
    );
  }
}

export function assertConsumerImpactOwnerAligned(
  contract: Pick<ApiRouteContract<unknown, unknown>, "id" | "lifecycle">,
  ownership: ApiOperationOwnershipMetadata
): void {
  if (contract.lifecycle !== "active") {
    return;
  }

  if (ownership.consumerImpactOwner !== ERP_API_CONSUMER_IMPACT_OWNER) {
    throw new Error(
      `Active operation ${contract.id} consumerImpactOwner must remain ${ERP_API_CONSUMER_IMPACT_OWNER}.`
    );
  }
}

export function collectErpApiConsumerImpactSyncViolations(input: {
  readonly contracts: readonly ApiRouteContract<unknown, unknown>[];
}): readonly string[] {
  const violations: string[] = [];

  try {
    assertRegistryConsumerImpactPolicy(input.contracts);
  } catch (error) {
    violations.push(
      error instanceof Error
        ? error.message
        : "Family consumer impact registry assertion failed."
    );
  }

  for (const contract of input.contracts) {
    try {
      const impact = resolveConsumerImpactDeclaration(contract);
      assertErpConsumerSurfacesRepresented(contract, impact);
    } catch (error) {
      violations.push(
        error instanceof Error
          ? error.message
          : "ERP consumer surface assertion failed."
      );
    }

    try {
      const ownership = assertActiveOperationOwnership(contract);
      assertConsumerImpactOwnerAligned(contract, ownership);
    } catch (error) {
      violations.push(
        error instanceof Error
          ? error.message
          : "Consumer impact ownership assertion failed."
      );
    }
  }

  return violations;
}

/** Lineage helper for nested attestation tests (S5 → S6). */
export function summarizeRuntimeEvidenceForConsumerImpactSync(
  runtimeAttestation: ErpApiRuntimeEvidenceAttestation
): {
  readonly maturity: ErpApiRuntimeEvidenceAttestation["maturity"];
  readonly operationCount: number;
} {
  return {
    maturity: runtimeAttestation.maturity,
    operationCount: runtimeAttestation.operationCount,
  };
}

/** Re-export for tests validating impact class vocabulary. */
export type { ApiConsumerImpactClass };
