import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  type AccountingReadinessContext,
  type ConsolidationScopeContext,
  DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
  deriveConsolidationScopeContext,
  type EntityGroupContext,
  isOwnershipInterestEffectiveAt,
  KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES,
  KERNEL_OPERATING_CONTEXT_SUPPORT_MODULES,
  type LegalEntityContext,
  OPERATING_CONTEXT_ERROR_CODES,
  type OperatingContext,
  type OrganizationUnitContext,
  type OwnershipInterestContext,
  type PermissionScopeContext,
  type ProjectContext,
  type TeamContext,
  type TenantContext,
} from "../context/index.js";

const contextRoot = join(dirname(fileURLToPath(import.meta.url)), "../context");

describe("@afenda/kernel context registry", () => {
  it("includes every required module from multi-tenancy.md", () => {
    for (const module of KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES) {
      expect(
        existsSync(join(contextRoot, module.file)),
        `missing ${module.file}`
      ).toBe(true);
    }

    expect(existsSync(join(contextRoot, "index.ts"))).toBe(true);
  });

  it("includes every supporting module on disk", () => {
    for (const file of KERNEL_OPERATING_CONTEXT_SUPPORT_MODULES) {
      expect(existsSync(join(contextRoot, file)), `missing ${file}`).toBe(true);
    }
  });

  it("re-exports primary types from context/index.ts", () => {
    const indexSource = readFileSync(join(contextRoot, "index.ts"), "utf8");

    for (const module of KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES) {
      expect(
        indexSource.includes(`type ${module.primaryType}`),
        `${module.primaryType} not exported from index`
      ).toBe(true);
    }
  });

  it("does not create circular imports through accounting-readiness", () => {
    const accountingSource = readFileSync(
      join(contextRoot, "accounting-readiness.contract.ts"),
      "utf8"
    );

    expect(accountingSource).not.toContain('from "./index.js"');
    expect(accountingSource).not.toContain("from './index.js'");
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

type _TenantContextSerializable = AssertSerializable<TenantContext>;
type _EntityGroupContextSerializable = AssertSerializable<EntityGroupContext>;
type _LegalEntityContextSerializable = AssertSerializable<LegalEntityContext>;
type _OwnershipInterestContextSerializable =
  AssertSerializable<OwnershipInterestContext>;
type _OrganizationUnitContextSerializable =
  AssertSerializable<OrganizationUnitContext>;
type _TeamContextSerializable = AssertSerializable<TeamContext>;
type _ProjectContextSerializable = AssertSerializable<ProjectContext>;
type _PermissionScopeContextSerializable =
  AssertSerializable<PermissionScopeContext>;
type _ConsolidationScopeContextSerializable =
  AssertSerializable<ConsolidationScopeContext>;
type _OperatingContextSerializable = AssertSerializable<OperatingContext>;
type _AccountingReadinessContextSerializable =
  AssertSerializable<AccountingReadinessContext>;

type AssertOperatingContextComposition = OperatingContext extends {
  readonly tenant: TenantContext;
  readonly entityGroup: EntityGroupContext | null;
  readonly legalEntity: LegalEntityContext;
  readonly ownershipInterests: readonly OwnershipInterestContext[];
  readonly organizationUnit: OrganizationUnitContext | null;
  readonly team: TeamContext | null;
  readonly project: ProjectContext | null;
  readonly permissionScope: PermissionScopeContext;
  readonly consolidationScope: ConsolidationScopeContext | null;
}
  ? true
  : false;

type _OperatingContextComposition = AssertOperatingContextComposition;

describe("operating context contract surface", () => {
  it("exports stable lifecycle and scope vocabularies", () => {
    expect(OPERATING_CONTEXT_ERROR_CODES).toContain("MEMBERSHIP_DENIED");
    expect(OPERATING_CONTEXT_ERROR_CODES).toContain(
      "MISSING_LEGAL_ENTITY_SELECTION"
    );
    expect(OPERATING_CONTEXT_ERROR_CODES).toContain("ENTITY_GROUP_NOT_FOUND");
    expect(OPERATING_CONTEXT_ERROR_CODES).toContain("PROJECT_SCOPE_MISMATCH");
  });

  it("evaluates ownership interest effective dates from the domain contract", () => {
    expect(
      isOwnershipInterestEffectiveAt(
        {
          status: "active",
          effectiveFrom: "2026-01-01",
          effectiveTo: null,
        },
        "2026-06-01"
      )
    ).toBe(true);
  });

  it("derives consolidation scope without arithmetic", () => {
    const scope = deriveConsolidationScopeContext({
      tenantId: "tenant-1",
      entityGroupId: "group-1",
      reportingDate: "2026-06-01",
      ownershipInterests: [
        {
          ownershipInterestId: "oi-1",
          tenantId: "tenant-1",
          entityGroupId: "group-1",
          parentLegalEntityId: "parent-1",
          childLegalEntityId: "child-1",
          ownershipPercentage: 100,
          votingPercentage: 100,
          controlType: "control",
          consolidationTreatment: "full_consolidation",
          nonControllingInterestApplicable: false,
          effectiveFrom: "2026-01-01",
          effectiveTo: null,
          status: "active",
        },
      ],
    });

    expect(scope.legalEntities).toHaveLength(1);
    expect(scope.legalEntities[0]?.consolidationTreatment).toBe(
      "full_consolidation"
    );
  });

  it("keeps permission elevation flags serializable", () => {
    expect(DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS).toEqual({
      consolidationView: false,
      crossCompany: false,
      minorityInterestCompany: false,
      platformAdmin: false,
    });
  });
});
