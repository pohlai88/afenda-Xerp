/**
 * TIP-008B Slice 5 + ADR-0020 — persistence ownership policy.
 * @afenda/database owns Product + Warehouse physical persistence; CRM/HRM/procurement remain exclusive.
 */
import {
  BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY,
  type BusinessMasterDataEntityId,
} from "./business-master-data-authority.contract.js";

export const INVENTORY_PERSISTENCE_PACKAGE_ID = "@afenda/database" as const;

export const INVENTORY_PERSISTENCE_ENTITY_IDS = [
  "product",
  "warehouse",
] as const satisfies readonly BusinessMasterDataEntityId[];

export interface BusinessMasterDataPackageOwnershipSummary {
  readonly entityIds: readonly BusinessMasterDataEntityId[];
  readonly reservedPackageId: string;
}

export function getEntitiesForReservedPackage(
  reservedPackageId: string
): readonly BusinessMasterDataEntityId[] {
  return BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY.filter(
    (entry) => entry.reservedPackageId === reservedPackageId
  ).map((entry) => entry.entityId);
}

export function assertSharedPackageOwnershipPolicy(): void {
  const persistenceEntities = getEntitiesForReservedPackage(
    INVENTORY_PERSISTENCE_PACKAGE_ID
  );

  if (persistenceEntities.length !== INVENTORY_PERSISTENCE_ENTITY_IDS.length) {
    throw new Error(
      `@afenda/database must own exactly ${INVENTORY_PERSISTENCE_ENTITY_IDS.length} inventory master data entities.`
    );
  }

  for (const entityId of INVENTORY_PERSISTENCE_ENTITY_IDS) {
    if (!persistenceEntities.includes(entityId)) {
      throw new Error(
        `@afenda/database persistence ownership missing entity: ${entityId}`
      );
    }
  }

  const exclusiveOwners = new Map<string, BusinessMasterDataEntityId>();

  for (const entry of BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY) {
    if (entry.reservedPackageId === INVENTORY_PERSISTENCE_PACKAGE_ID) {
      continue;
    }

    const priorOwner = exclusiveOwners.get(entry.reservedPackageId);
    if (priorOwner) {
      throw new Error(
        `Duplicate exclusive package claim on ${entry.reservedPackageId}: ${priorOwner} and ${entry.entityId}`
      );
    }

    exclusiveOwners.set(entry.reservedPackageId, entry.entityId);
  }
}

export function summarizePackageOwnership(): readonly BusinessMasterDataPackageOwnershipSummary[] {
  const byPackage = new Map<string, BusinessMasterDataEntityId[]>();

  for (const entry of BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY) {
    const current = byPackage.get(entry.reservedPackageId) ?? [];
    current.push(entry.entityId);
    byPackage.set(entry.reservedPackageId, current);
  }

  return [...byPackage.entries()].map(([reservedPackageId, entityIds]) => ({
    reservedPackageId,
    entityIds,
  }));
}
