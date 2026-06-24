/**
 * TIP-008B Slice 5 — shared reserved-package ownership policy.
 * @afenda/inventory may own Product + Warehouse; all other PKG-R02–R05 packages are exclusive.
 */
import {
  BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY,
  type BusinessMasterDataEntityId,
} from "./business-master-data-authority.contract.js";

export const INVENTORY_SHARED_PACKAGE_ID = "@afenda/inventory" as const;

export const INVENTORY_SHARED_ENTITY_IDS = [
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
  const inventoryEntities = getEntitiesForReservedPackage(
    INVENTORY_SHARED_PACKAGE_ID
  );

  if (inventoryEntities.length !== INVENTORY_SHARED_ENTITY_IDS.length) {
    throw new Error(
      `@afenda/inventory must own exactly ${INVENTORY_SHARED_ENTITY_IDS.length} entities.`
    );
  }

  for (const entityId of INVENTORY_SHARED_ENTITY_IDS) {
    if (!inventoryEntities.includes(entityId)) {
      throw new Error(
        `@afenda/inventory shared ownership missing entity: ${entityId}`
      );
    }
  }

  const exclusiveOwners = new Map<string, BusinessMasterDataEntityId>();

  for (const entry of BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY) {
    if (entry.reservedPackageId === INVENTORY_SHARED_PACKAGE_ID) {
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
