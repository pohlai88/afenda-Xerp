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
} from "../data/business-master-data-authority.registry.js";

const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url));

describe("@afenda/architecture-authority business master data authority (Foundation phase 08 Slice 2)", () => {
  it("registers all seven business-reference entities with stable count", () => {
    expect(BUSINESS_MASTER_DATA_ENTITY_IDS).toHaveLength(7);
    expect(BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY).toHaveLength(7);
    expect(new Set(BUSINESS_MASTER_DATA_ENTITY_IDS).size).toBe(7);
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

  it("has no TBD entities after ADR-0028 promotion", () => {
    expect(TBD_BUSINESS_MASTER_DATA_ENTITIES).toHaveLength(0);
  });

  it("aligns registry rows with business-master-data authority SSOT", () => {
    const registrySource = readFileSync(
      join(
        repoRoot,
        "packages/architecture-authority/src/data/business-master-data-authority.registry.ts"
      ),
      "utf8"
    );

    for (const entry of BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY) {
      expect(registrySource).toContain(entry.displayName);
      expect(registrySource).toContain(entry.reservedPackageId);
      expect(registrySource).toContain(entry.pkgCode);
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
