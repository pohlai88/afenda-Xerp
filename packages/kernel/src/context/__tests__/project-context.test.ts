import { createTestEnterpriseId } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import { assertWireProjectContext } from "../project-context.assert.js";
import type { ProjectWireContext } from "../project-context.contract.js";
import {
  normalizeProjectContextForWire,
  parseProjectContext,
  parseUnknownProjectContext,
} from "../project-context.parser.js";

const PROJECT_ID = createTestEnterpriseId(
  "project",
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
const ORG_UNIT_ID = createTestEnterpriseId(
  "organization",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);

const VALID_WIRE: ProjectWireContext = {
  projectId: PROJECT_ID,
  tenantId: TENANT_ID,
  companyId: COMPANY_ID,
  organizationUnitId: ORG_UNIT_ID,
  slug: "phase-one",
  displayName: "Phase One",
  status: "active",
};

describe("project context wire triad (PAS-001 §4.4)", () => {
  it("parses valid wire and round-trips through normalize", () => {
    const context = parseProjectContext(VALID_WIRE);

    expect(normalizeProjectContextForWire(context)).toEqual(VALID_WIRE);
  });

  it("parses unknown JSON ingress via parseUnknownProjectContext", () => {
    const context = parseUnknownProjectContext(
      structuredClone(VALID_WIRE) as unknown
    );

    expect(`${context.projectId}`).toBe(PROJECT_ID);
  });

  it("accepts null optional scope ids", () => {
    const wire: ProjectWireContext = {
      ...VALID_WIRE,
      companyId: null,
      organizationUnitId: null,
    };

    expect(normalizeProjectContextForWire(parseProjectContext(wire))).toEqual(
      wire
    );
  });

  it("rejects non-object wire before branding", () => {
    expect(() => assertWireProjectContext(null)).toThrow(/must be an object/i);
  });

  it("rejects invalid status enum before branding", () => {
    expect(() =>
      parseProjectContext({
        ...VALID_WIRE,
        status: "ghost",
      } as unknown as ProjectWireContext)
    ).toThrow(/status must be one of/i);
  });

  it("rejects invalid slug format before branding", () => {
    expect(() =>
      assertWireProjectContext({
        ...VALID_WIRE,
        slug: "Bad Slug",
      })
    ).toThrow(/slug must use lowercase/i);
  });

  it("rejects whitespace-only displayName before branding", () => {
    expect(() =>
      assertWireProjectContext({
        ...VALID_WIRE,
        displayName: "   ",
      })
    ).toThrow(/displayName is required/i);
  });

  it("rejects invalid tenant id family before branding", () => {
    expect(() =>
      parseProjectContext({
        ...VALID_WIRE,
        tenantId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/tenantId/i);
  });

  it("rejects invalid projectId family before branding", () => {
    expect(() =>
      parseProjectContext({
        ...VALID_WIRE,
        projectId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/projectId|ProjectId/i);
  });

  it("rejects invalid company id family before branding", () => {
    expect(() =>
      parseProjectContext({
        ...VALID_WIRE,
        companyId: "org_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/companyId|CompanyId/i);
  });

  it("rejects invalid organizationUnitId family before branding", () => {
    expect(() =>
      parseProjectContext({
        ...VALID_WIRE,
        organizationUnitId: "prj_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/organizationUnitId|OrganizationId/i);
  });
});
