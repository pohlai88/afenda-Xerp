import { describe, expect, it } from "vitest";
import type { assertPlatformIdBoundaryRegistryCoverage } from "../identity/index.js";
import {
  ENTERPRISE_ID_FAMILIES,
  ENTERPRISE_ID_FAMILY_KEYS,
  FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS,
  getEnterpriseIdFamiliesByCategory,
  getIdFamilyDefinition,
  getPlatformIdFamilyDefinition,
  ID_FAMILIES,
  ID_FAMILY_CATEGORIES,
  ID_FAMILY_COUNT,
  IDENTITY_AUTHORITY_ADR,
  IDENTITY_AUTHORITY_PAS,
  IDENTITY_AUTHORITY_SECTION,
  isEnterpriseIdFamily,
  PLATFORM_ID_FAMILY_REGISTRY,
  PLATFORM_ID_FAMILY_TYPE_NAMES,
  PRIMITIVE_ID_FAMILY_COUNT,
  REGISTRY_FAMILY_COUNT,
} from "../identity/registry/id-family.registry.js";

type AssertEqual<T, U> = [T] extends [U]
  ? [U] extends [T]
    ? true
    : false
  : false;

type _BoundaryRegistryCoverage = assertPlatformIdBoundaryRegistryCoverage;
type _AssertBoundaryRegistryCoverage = AssertEqual<
  _BoundaryRegistryCoverage,
  true
>;

describe("@afenda/kernel identity family registry (PAS-001 §4.1 / ADR-0021)", () => {
  it("documents PAS and ADR authority and forbidden fiscal platform ids", () => {
    expect(IDENTITY_AUTHORITY_PAS).toBe("PAS-001");
    expect(IDENTITY_AUTHORITY_SECTION).toBe("4.1");
    expect(IDENTITY_AUTHORITY_ADR).toBe("ADR-0021");
    expect(FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS).toEqual([
      "FiscalCalendarId",
      "FiscalPeriodId",
    ]);
  });

  it("registers 22 enterprise id families and 7 primitive references", () => {
    expect(ID_FAMILY_COUNT).toBe(22);
    expect(PRIMITIVE_ID_FAMILY_COUNT).toBe(7);
    expect(REGISTRY_FAMILY_COUNT).toBe(29);
    expect(ENTERPRISE_ID_FAMILY_KEYS).toHaveLength(ID_FAMILY_COUNT);
    expect(ENTERPRISE_ID_FAMILIES).toHaveLength(ID_FAMILY_COUNT);
    expect(ENTERPRISE_ID_FAMILIES).toEqual([...ENTERPRISE_ID_FAMILY_KEYS]);
    expect(PLATFORM_ID_FAMILY_REGISTRY).toHaveLength(REGISTRY_FAMILY_COUNT);
    expect(new Set(PLATFORM_ID_FAMILY_TYPE_NAMES).size).toBe(
      REGISTRY_FAMILY_COUNT
    );
    expect(
      getPlatformIdFamilyDefinition("TenantId").parseOptionalFunction
    ).toBe("parseOptionalTenantId");
    expect(getIdFamilyDefinition("tenant").generates).toBe(true);
  });

  it("uses kebab-case ID_FAMILY_CATEGORIES across registry rows", () => {
    expect(ID_FAMILY_CATEGORIES).toEqual({
      tenantHierarchy: "tenant-hierarchy",
      identityAccess: "identity-access",
      auditExecution: "audit-execution",
      enterpriseHierarchy: "enterprise-hierarchy",
      businessReference: "business-reference",
      globalPrimitive: "global-primitive",
    });

    const categories = new Set(
      PLATFORM_ID_FAMILY_REGISTRY.map((entry) => entry.category)
    );

    expect(categories).toEqual(new Set(Object.values(ID_FAMILY_CATEGORIES)));

    expect(getEnterpriseIdFamiliesByCategory("tenant-hierarchy")).toHaveLength(
      6
    );
    expect(
      getEnterpriseIdFamiliesByCategory("business-reference")
    ).toHaveLength(7);
  });

  it("classifies enterprise vs primitive families deterministically", () => {
    for (const familyKey of ENTERPRISE_ID_FAMILY_KEYS) {
      expect(isEnterpriseIdFamily(familyKey)).toBe(true);
      expect(ID_FAMILIES[familyKey].prefix).toMatch(/^[a-z]{3}$/);
    }

    expect(isEnterpriseIdFamily("localeCode")).toBe(false);
    expect(ID_FAMILIES.localeCode.category).toBe(
      ID_FAMILY_CATEGORIES.globalPrimitive
    );
  });

  it("requires parser and generator metadata for every generating enterprise family", () => {
    for (const familyKey of ENTERPRISE_ID_FAMILIES) {
      const family = ID_FAMILIES[familyKey];
      expect(family.generates).toBe(true);
      expect(family.parseFunction).toMatch(/^parse/);
      expect(family.createFunction).toMatch(/^create/);
      expect(family.prefix).toMatch(/^[a-z]{3}$/);
    }
  });

  it("assigns recordOwner on governed business-reference and enterprise-hierarchy families", () => {
    expect(getIdFamilyDefinition("ownershipInterest").recordOwner).toBe(
      "enterprise-structure"
    );
    expect(getIdFamilyDefinition("document").recordOwner).toBe(
      "document-management"
    );
    expect(getIdFamilyDefinition("asset").recordOwner).toBe("asset-management");
  });
});
