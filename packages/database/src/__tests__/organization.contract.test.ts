import { describe, expect, it } from "vitest";
import { ORGANIZATION_UNIT_TYPES } from "../database.types.js";
import {
  assertNoOrganizationCycle,
  assertOrganizationSlug,
  buildOrganizationInsertRow,
  OrganizationCycleError,
  OrganizationScopeMismatchError,
  OrganizationValidationError,
  resolveLegalEntityId,
  resolveOrganizationUnitType,
  toOrganizationUnitAuthorityRecord,
} from "../organization/organization.contract.js";

describe("organization unit types", () => {
  it("includes multi-tenancy authority types", () => {
    for (const unitType of [
      "branch",
      "department",
      "site",
      "farm",
      "factory",
      "warehouse",
      "retail_outlet",
      "cost_center",
      "shared_service",
      "operating_unit",
      "company_root",
      "team",
    ] as const) {
      expect(ORGANIZATION_UNIT_TYPES).toContain(unitType);
    }
  });
});

describe("organization contract", () => {
  it("normalizes organization slugs to lowercase kebab-case", () => {
    expect(assertOrganizationSlug("Finance Team")).toBe("finance-team");
  });

  it("accepts legalEntityId and organizationUnitType aliases", () => {
    const row = buildOrganizationInsertRow({
      tenantId: "00000000-0000-4000-8000-000000000001",
      legalEntityId: "00000000-0000-4000-8000-000000000002",
      slug: "north-warehouse",
      name: "North Warehouse",
      organizationUnitType: "warehouse",
      parentOrganizationUnitId: null,
      effectiveFrom: "2026-01-01",
    });

    expect(row).toMatchObject({
      companyId: "00000000-0000-4000-8000-000000000002",
      slug: "north-warehouse",
      name: "North Warehouse",
      type: "warehouse",
      status: "active",
      parentOrganizationId: null,
      effectiveFrom: "2026-01-01",
      effectiveTo: null,
    });
  });

  it("builds normalized insert rows with defaults", () => {
    const row = buildOrganizationInsertRow({
      tenantId: "00000000-0000-4000-8000-000000000001",
      companyId: "00000000-0000-4000-8000-000000000002",
      slug: "Finance Team",
      name: " Finance ",
      parentOrganizationId: null,
    });

    expect(row).toMatchObject({
      slug: "finance-team",
      name: "Finance",
      type: "department",
      status: "active",
      parentOrganizationId: null,
    });
  });

  it("maps persisted rows to authority records", () => {
    const record = toOrganizationUnitAuthorityRecord({
      id: "org-1",
      tenantId: "tenant-1",
      companyId: "company-1",
      parentOrganizationId: "org-root",
      slug: "north-farm",
      name: "North Farm",
      type: "farm",
      status: "active",
      effectiveFrom: "2026-01-01",
      effectiveTo: null,
    });

    expect(record).toMatchObject({
      organizationUnitId: "org-1",
      legalEntityId: "company-1",
      parentOrganizationUnitId: "org-root",
      organizationUnitType: "farm",
      displayName: "North Farm",
    });
  });

  it("rejects mismatched legalEntityId and companyId", () => {
    expect(() =>
      resolveLegalEntityId({
        legalEntityId: "company-a",
        companyId: "company-b",
      })
    ).toThrow(OrganizationValidationError);
  });

  it("rejects effectiveTo before effectiveFrom", () => {
    expect(() =>
      buildOrganizationInsertRow({
        tenantId: "tenant-1",
        companyId: "company-1",
        slug: "ops",
        name: "Ops",
        effectiveFrom: "2026-06-01",
        effectiveTo: "2026-01-01",
      })
    ).toThrow(OrganizationValidationError);
  });

  it("defaults organization unit type to department", () => {
    expect(resolveOrganizationUnitType({})).toBe("department");
  });

  it("detects direct and indirect organization cycles", () => {
    expect(() =>
      assertNoOrganizationCycle("org-a", "org-a", () => null)
    ).toThrow(OrganizationCycleError);

    expect(() =>
      assertNoOrganizationCycle("org-a", "org-b", (id) =>
        id === "org-b" ? "org-a" : null
      )
    ).toThrow(OrganizationCycleError);

    expect(() =>
      assertNoOrganizationCycle("org-a", "org-c", (id) => {
        if (id === "org-c") {
          return "org-b";
        }
        if (id === "org-b") {
          return "org-a";
        }
        return null;
      })
    ).toThrow(OrganizationCycleError);
  });

  it("allows acyclic parent assignment", () => {
    expect(() =>
      assertNoOrganizationCycle("org-a", "org-c", (id) => {
        if (id === "org-c") {
          return "org-b";
        }
        return null;
      })
    ).not.toThrow();
  });
});

describe("organization contract errors", () => {
  it("exposes scope mismatch error type", () => {
    expect(new OrganizationScopeMismatchError("test").name).toBe(
      "OrganizationScopeMismatchError"
    );
  });
});
