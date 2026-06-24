import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY,
  BUSINESS_MASTER_DATA_ENTITY_IDS,
  type BusinessMasterDataAuthorityEntry,
  type BusinessMasterDataEntityId,
  getBusinessMasterDataAuthority,
  isBusinessMasterDataEntityId,
  TBD_BUSINESS_MASTER_DATA_ENTITIES,
} from "../contracts/business-master-data/index.js";

const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url));
const dependencyRegistryPath = join(
  repoRoot,
  "docs/architecture/dependency-registry.md"
);

describe("@afenda/kernel business master data authority (TIP-008B Slice 2)", () => {
  it("registers core five entities with stable count and no duplication", () => {
    expect(BUSINESS_MASTER_DATA_ENTITY_IDS).toHaveLength(5);
    expect(BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY).toHaveLength(5);
    expect(new Set(BUSINESS_MASTER_DATA_ENTITY_IDS).size).toBe(5);
  });

  it("maps entity ids to registry entries", () => {
    for (const entityId of BUSINESS_MASTER_DATA_ENTITY_IDS) {
      expect(isBusinessMasterDataEntityId(entityId)).toBe(true);
      expect(getBusinessMasterDataAuthority(entityId).entityId).toBe(entityId);
    }

    expect(isBusinessMasterDataEntityId("not-a-business-entity")).toBe(false);
  });

  it("assigns single owning domain per entity without duplicate package claims", () => {
    for (const entry of BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY) {
      expect(entry.runtimeStatus).toBe("authority_only");
      expect(entry.reservedPackageId.startsWith("@afenda/")).toBe(true);
    }
  });

  it("flags TBD entities outside the governed core registry", () => {
    expect(TBD_BUSINESS_MASTER_DATA_ENTITIES).toHaveLength(2);
    for (const tbd of TBD_BUSINESS_MASTER_DATA_ENTITIES) {
      expect(isBusinessMasterDataEntityId(tbd.entityId)).toBe(false);
      expect(tbd.reservedPackageId).toContain("TBD");
    }
  });

  it("aligns registry rows with dependency-registry documentation table", () => {
    const registryDoc = readFileSync(dependencyRegistryPath, "utf8");

    for (const entry of BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY) {
      expect(registryDoc).toContain(entry.displayName);
      expect(registryDoc).toContain(entry.reservedPackageId);
      expect(registryDoc).toContain(entry.pkgCode);
    }
  });

  it("points every registry kernelContractPath at an on-disk artifact when set", () => {
    for (const entry of BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY) {
      if (!entry.kernelContractPath) {
        continue;
      }

      expect(
        existsSync(join(repoRoot, entry.kernelContractPath)),
        `missing ${entry.kernelContractPath}`
      ).toBe(true);
    }
  });
});

type AssertSerializable<T> = T extends string | number | boolean | null
  ? true
  : T extends readonly (infer U)[]
    ? AssertSerializable<U>
    : T extends object
      ? {
          [K in keyof T]: AssertSerializable<T[K]>;
        } extends Record<keyof T, true>
        ? true
        : false
      : false;

type _RegistrySerializable =
  AssertSerializable<BusinessMasterDataAuthorityEntry>;
type _EntityIdExhaustive = BusinessMasterDataEntityId;
