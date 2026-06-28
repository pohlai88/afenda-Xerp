import { createTestEnterpriseId } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import { assertWireOrganizationUnitContext } from "../organization-unit-context.assert.js";
import type { OrganizationUnitWireContext } from "../organization-unit-context.contract.js";
import {
  normalizeOrganizationUnitContextForWire,
  parseOrganizationUnitContext,
  parseUnknownOrganizationUnitContext,
} from "../organization-unit-context.parser.js";

const ORG_UNIT_ID = createTestEnterpriseId(
  "organization",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const TENANT_ID = createTestEnterpriseId(
  "tenant",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const COMPANY_ID = createTestEnterpriseId(
  "company",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const PARENT_ORG_ID = createTestEnterpriseId(
  "organization",
  "01ARZ3NDEKTSV4RRFFQ69G5FBV"
);

const VALID_WIRE: OrganizationUnitWireContext = {
  organizationUnitId: ORG_UNIT_ID,
  tenantId: TENANT_ID,
  companyId: COMPANY_ID,
  slug: "finance-cc",
  displayName: "Finance CC",
  organizationUnitType: "cost_center",
  parentOrganizationUnitId: PARENT_ORG_ID,
  status: "active",
  effectiveFrom: "2026-01-01",
  effectiveTo: null,
};

describe("organization unit context wire triad (PAS-001 §4.4)", () => {
  it("parses valid wire and round-trips through normalize", () => {
    const context = parseOrganizationUnitContext(VALID_WIRE);

    expect(normalizeOrganizationUnitContextForWire(context)).toEqual(
      VALID_WIRE
    );
  });

  it("parses unknown JSON ingress via parseUnknownOrganizationUnitContext", () => {
    const context = parseUnknownOrganizationUnitContext(
      structuredClone(VALID_WIRE) as unknown
    );

    expect(`${context.organizationUnitId}`).toBe(ORG_UNIT_ID);
  });

  it("accepts null parentOrganizationUnitId and open-ended effective dates", () => {
    const wire: OrganizationUnitWireContext = {
      ...VALID_WIRE,
      parentOrganizationUnitId: null,
      effectiveFrom: null,
      effectiveTo: null,
    };

    expect(
      normalizeOrganizationUnitContextForWire(
        parseOrganizationUnitContext(wire)
      )
    ).toEqual(wire);
  });

  it("rejects non-object wire before branding", () => {
    expect(() => assertWireOrganizationUnitContext(null)).toThrow(
      /must be an object/i
    );
  });

  it("rejects invalid status enum before branding", () => {
    expect(() =>
      parseOrganizationUnitContext({
        ...VALID_WIRE,
        status: "ghost",
      } as unknown as OrganizationUnitWireContext)
    ).toThrow(/status must be one of/i);
  });

  it("rejects invalid organizationUnitType before branding", () => {
    expect(() =>
      parseOrganizationUnitContext({
        ...VALID_WIRE,
        organizationUnitType: "pod",
      } as unknown as OrganizationUnitWireContext)
    ).toThrow(/organizationUnitType must be one of/i);
  });

  it("rejects invalid slug format before branding", () => {
    expect(() =>
      assertWireOrganizationUnitContext({
        ...VALID_WIRE,
        slug: "Bad Slug",
      })
    ).toThrow(/slug must use lowercase/i);
  });

  it("rejects whitespace-only displayName before branding", () => {
    expect(() =>
      assertWireOrganizationUnitContext({
        ...VALID_WIRE,
        displayName: "   ",
      })
    ).toThrow(/displayName is required/i);
  });

  it("rejects invalid tenant id family before branding", () => {
    expect(() =>
      parseOrganizationUnitContext({
        ...VALID_WIRE,
        tenantId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/tenantId/i);
  });

  it("rejects invalid organizationUnitId family before branding", () => {
    expect(() =>
      parseOrganizationUnitContext({
        ...VALID_WIRE,
        organizationUnitId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/organizationUnitId|OrganizationId/i);
  });

  it("rejects invalid company id family before branding", () => {
    expect(() =>
      parseOrganizationUnitContext({
        ...VALID_WIRE,
        companyId: "org_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/companyId|CompanyId/i);
  });

  it("rejects invalid parentOrganizationUnitId family before branding", () => {
    expect(() =>
      parseOrganizationUnitContext({
        ...VALID_WIRE,
        parentOrganizationUnitId: "tea_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/parentOrganizationUnitId|OrganizationId/i);
  });

  it("rejects invalid effectiveFrom format before branding", () => {
    expect(() =>
      parseOrganizationUnitContext({
        ...VALID_WIRE,
        effectiveFrom: "2026/01/01",
      })
    ).toThrow(/effectiveFrom must be an ISO calendar date/i);
  });

  it("rejects effectiveTo before effectiveFrom", () => {
    expect(() =>
      parseOrganizationUnitContext({
        ...VALID_WIRE,
        effectiveFrom: "2026-06-01",
        effectiveTo: "2026-01-01",
      })
    ).toThrow(
      /effectiveTo must be null or greater than or equal to effectiveFrom/i
    );
  });
});
