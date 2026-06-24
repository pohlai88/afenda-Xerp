import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  getPlatformEntityAuthority,
  isPlatformEntityId,
  type LegalEntityContext,
  type OrganizationUnitContext,
  type PermissionScopeContext,
  PLATFORM_ENTITY_AUTHORITY_REGISTRY,
  PLATFORM_ENTITY_IDS,
  type PlatformEntityAuthorityEntry,
  type PlatformEntityId,
  type TenantContext,
  type WorkspaceContext,
} from "../contracts/platform/index.js";
import type {
  AuditEventId,
  CorrelationId,
  PermissionId,
  UserId,
} from "../contracts/platform-id.contract.js";

const repoRoot = fileURLToPath(new URL("../../../../", import.meta.url));
const platformBarrelPath = join(
  repoRoot,
  "packages/kernel/src/contracts/platform/index.ts"
);

describe("@afenda/kernel platform entity authority", () => {
  it("registers every ADR-0001 platform entity with stable count", () => {
    expect(PLATFORM_ENTITY_IDS).toHaveLength(11);
    expect(PLATFORM_ENTITY_AUTHORITY_REGISTRY).toHaveLength(11);
    expect(new Set(PLATFORM_ENTITY_IDS).size).toBe(11);
  });

  it("maps entity ids to registry entries without duplication", () => {
    for (const entityId of PLATFORM_ENTITY_IDS) {
      expect(isPlatformEntityId(entityId)).toBe(true);
      expect(getPlatformEntityAuthority(entityId).entityId).toBe(entityId);
    }

    expect(isPlatformEntityId("not-a-platform-entity")).toBe(false);
  });

  it("points every registry path at an on-disk artifact", () => {
    for (const entry of PLATFORM_ENTITY_AUTHORITY_REGISTRY) {
      if (entry.kernelContractPath) {
        expect(
          existsSync(join(repoRoot, entry.kernelContractPath)),
          `missing ${entry.kernelContractPath}`
        ).toBe(true);
      }

      for (const schemaPath of entry.schemaPaths) {
        expect(
          existsSync(join(repoRoot, schemaPath)),
          `missing ${schemaPath}`
        ).toBe(true);
      }

      for (const consumerPath of entry.authorizationConsumerPaths) {
        expect(
          existsSync(join(repoRoot, consumerPath)),
          `missing ${consumerPath}`
        ).toBe(true);
      }
    }
  });

  it("documents workspace and approval as derived entities without schema tables", () => {
    const workspace = getPlatformEntityAuthority("workspace");
    const approval = getPlatformEntityAuthority("approval");

    expect(workspace.schemaPaths).toEqual([]);
    expect(approval.schemaPaths).toEqual([]);
    expect(workspace.kernelContractExport).toBe("WorkspaceContext");
  });

  it("re-exports canonical kernel contract exports from the platform barrel", () => {
    const barrelSource = readFileSync(platformBarrelPath, "utf8");

    for (const entry of PLATFORM_ENTITY_AUTHORITY_REGISTRY) {
      if (!entry.kernelContractExport) {
        continue;
      }

      expect(
        barrelSource.includes(entry.kernelContractExport),
        `${entry.kernelContractExport} missing from platform barrel`
      ).toBe(true);
    }
  });

  it("aligns registry kernel paths with exported primary types in context contracts", () => {
    for (const entry of PLATFORM_ENTITY_AUTHORITY_REGISTRY) {
      if (!(entry.kernelContractPath && entry.kernelContractExport)) {
        continue;
      }

      const contractSource = readFileSync(
        join(repoRoot, entry.kernelContractPath),
        "utf8"
      );

      expect(
        contractSource.includes(entry.kernelContractExport),
        `${entry.kernelContractExport} not found in ${entry.kernelContractPath}`
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

type _RegistrySerializable = AssertSerializable<PlatformEntityAuthorityEntry>;
type _TenantContextSerializable = AssertSerializable<TenantContext>;
type _LegalEntityContextSerializable = AssertSerializable<LegalEntityContext>;
type _OrganizationUnitContextSerializable =
  AssertSerializable<OrganizationUnitContext>;
type _WorkspaceContextSerializable = AssertSerializable<WorkspaceContext>;
type _PermissionScopeContextSerializable =
  AssertSerializable<PermissionScopeContext>;
type _BrandedIdsSerializable = AssertSerializable<
  UserId | PermissionId | AuditEventId | CorrelationId
>;
type _EntityIdExhaustive = PlatformEntityId;
