import { describe, expect, it } from "vitest";
import { createTestEnterpriseId } from "../../identity/index.js";

import { assertWireTeamContext } from "../team-context.assert.js";
import type { TeamWireContext } from "../team-context.contract.js";
import {
  normalizeTeamContextForWire,
  parseTeamContext,
  parseUnknownTeamContext,
} from "../team-context.parser.js";

const TEAM_ID = createTestEnterpriseId("team");
const TENANT_ID = createTestEnterpriseId("tenant");
const COMPANY_ID = createTestEnterpriseId("company");
const ORG_UNIT_ID = createTestEnterpriseId(
  "organization",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);

const VALID_WIRE: TeamWireContext = {
  teamId: TEAM_ID,
  tenantId: TENANT_ID,
  companyId: COMPANY_ID,
  organizationUnitId: ORG_UNIT_ID,
  slug: "ops",
  displayName: "Ops",
  status: "active",
};

describe("team context wire triad (PAS-001 §4.4)", () => {
  it("parses valid wire and round-trips through normalize", () => {
    const context = parseTeamContext(VALID_WIRE);

    expect(normalizeTeamContextForWire(context)).toEqual(VALID_WIRE);
  });

  it("parses unknown JSON ingress via parseUnknownTeamContext", () => {
    const context = parseUnknownTeamContext(
      structuredClone(VALID_WIRE) as unknown
    );

    expect(`${context.teamId}`).toBe(TEAM_ID);
  });

  it("accepts org-backed teamId wire until Foundation phase 30 teams resolver", () => {
    const orgBackedWire: TeamWireContext = {
      ...VALID_WIRE,
      teamId: ORG_UNIT_ID,
      organizationUnitId: ORG_UNIT_ID,
    };

    const context = parseTeamContext(orgBackedWire);

    expect(`${context.teamId}`).toBe(ORG_UNIT_ID);
    expect(normalizeTeamContextForWire(context).teamId).toBe(ORG_UNIT_ID);
  });

  it("rejects non-object wire before branding", () => {
    expect(() => assertWireTeamContext(null)).toThrow(/must be an object/i);
  });

  it("rejects invalid status enum before branding", () => {
    expect(() =>
      parseTeamContext({
        ...VALID_WIRE,
        status: "ghost",
      } as unknown as TeamWireContext)
    ).toThrow(/status must be one of/i);
  });

  it("rejects invalid slug format before branding", () => {
    expect(() =>
      assertWireTeamContext({
        ...VALID_WIRE,
        slug: "Bad Slug",
      })
    ).toThrow(/slug must use lowercase/i);
  });

  it("rejects whitespace-only displayName before branding", () => {
    expect(() =>
      assertWireTeamContext({
        ...VALID_WIRE,
        displayName: "   ",
      })
    ).toThrow(/displayName is required/i);
  });

  it("rejects invalid tenant id family before branding", () => {
    expect(() =>
      parseTeamContext({
        ...VALID_WIRE,
        tenantId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/tenantId/i);
  });

  it("rejects invalid team id family before branding", () => {
    expect(() =>
      parseTeamContext({
        ...VALID_WIRE,
        teamId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/teamId|TeamId|TenantId|OrganizationId/i);
  });

  it("rejects invalid company id family before branding", () => {
    expect(() =>
      parseTeamContext({
        ...VALID_WIRE,
        companyId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/companyId|CompanyId/i);
  });

  it("rejects invalid organizationUnitId family before branding", () => {
    expect(() =>
      parseTeamContext({
        ...VALID_WIRE,
        organizationUnitId: "tea_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/organizationUnitId|OrganizationId/i);
  });

  it("accepts null optional scope ids", () => {
    const wire: TeamWireContext = {
      ...VALID_WIRE,
      companyId: null,
      organizationUnitId: null,
    };

    expect(normalizeTeamContextForWire(parseTeamContext(wire))).toEqual(wire);
  });
});
