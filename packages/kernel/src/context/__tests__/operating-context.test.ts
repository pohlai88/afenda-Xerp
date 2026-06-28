import {
  createTestEnterpriseId,
  DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
} from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import { assertWireOperatingContext } from "../operating-context.assert.js";
import type { OperatingContextWireContext } from "../operating-context.contract.js";
import {
  normalizeOperatingContextForWire,
  parseOperatingContext,
  parseUnknownOperatingContext,
  serializeOperatingContext,
} from "../operating-context.parser.js";

const TENANT_ID = createTestEnterpriseId(
  "tenant",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const COMPANY_ID = createTestEnterpriseId(
  "company",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const USER_ID = createTestEnterpriseId("user", "01ARZ3NDEKTSV4RRFFQ69G5FAV");
const MEMBERSHIP_ID = createTestEnterpriseId(
  "membership",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const ROLE_ID = createTestEnterpriseId("role", "01ARZ3NDEKTSV4RRFFQ69G5FAV");

const VALID_WIRE: OperatingContextWireContext = {
  actor: { userId: USER_ID },
  correlationId: "corr-01ARZ3NDEKTSV4RRFFQ69G5FAV",
  tenant: {
    tenantId: TENANT_ID,
    slug: "acme",
    displayName: "Acme",
    status: "active",
  },
  entityGroup: null,
  legalEntity: {
    tenantId: TENANT_ID,
    entityGroupId: null,
    companyId: COMPANY_ID,
    legalName: "Acme Co",
    displayName: "Acme Co",
    slug: "acme-co",
    companyType: "standalone",
    relationshipToHoldingCompany: null,
    countryCode: "AU",
    baseCurrency: "AUD",
    reportingCurrency: null,
    fiscalCalendarId: null,
    registrationNumber: null,
    taxRegistrationNumber: null,
    effectiveFrom: "2026-01-01",
    effectiveTo: null,
    status: "active",
  },
  ownershipInterests: [],
  organizationUnit: null,
  team: null,
  project: null,
  workspace: {
    tenantId: TENANT_ID,
    companyId: COMPANY_ID,
    organizationId: null,
    projectId: null,
  },
  permissionScope: {
    grantScopeType: "company",
    tenantId: TENANT_ID,
    entityGroupId: null,
    companyId: COMPANY_ID,
    organizationId: null,
    teamId: null,
    projectId: null,
    membershipId: MEMBERSHIP_ID,
    roleId: ROLE_ID,
    elevations: DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
  },
  consolidationScope: null,
  surface: null,
  workflow: null,
};

describe("operating context wire triad (PAS-001 §4.4)", () => {
  it("parses valid composed wire and round-trips through normalize", () => {
    const context = parseOperatingContext(VALID_WIRE);

    expect(normalizeOperatingContextForWire(context)).toEqual(VALID_WIRE);
    expect(serializeOperatingContext(context)).toEqual(VALID_WIRE);
  });

  it("parses unknown JSON ingress via parseUnknownOperatingContext", () => {
    const context = parseUnknownOperatingContext(
      structuredClone(VALID_WIRE) as unknown
    );

    expect(`${context.tenant.tenantId}`).toBe(TENANT_ID);
    expect(`${context.legalEntity.companyId}`).toBe(COMPANY_ID);
  });

  it("rejects non-object wire before branding", () => {
    expect(() => assertWireOperatingContext(null)).toThrow(
      /must be an object/i
    );
  });

  it("rejects missing legalEntity before branding", () => {
    expect(() =>
      assertWireOperatingContext({
        ...VALID_WIRE,
        legalEntity: null,
      })
    ).toThrow(/legalEntity must be an object/i);
  });

  it("rejects invalid ownershipInterests container before branding", () => {
    expect(() =>
      assertWireOperatingContext({
        ...VALID_WIRE,
        ownershipInterests: {},
      })
    ).toThrow(/ownershipInterests must be an array/i);
  });

  it("rejects invalid nested legal entity before branding", () => {
    expect(() =>
      parseOperatingContext({
        ...VALID_WIRE,
        legalEntity: {
          ...VALID_WIRE.legalEntity,
          tenantId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
        },
      })
    ).toThrow(/tenantId/i);
  });

  it("rejects invalid tenant slug before branding", () => {
    expect(() =>
      assertWireOperatingContext({
        ...VALID_WIRE,
        tenant: {
          ...VALID_WIRE.tenant,
          slug: "Bad Slug",
        },
      })
    ).toThrow(/slug must use lowercase/i);
  });

  it("rejects whitespace-only correlationId before branding", () => {
    expect(() =>
      assertWireOperatingContext({
        ...VALID_WIRE,
        correlationId: "   ",
      })
    ).toThrow(/correlationId is required/i);
  });
});
