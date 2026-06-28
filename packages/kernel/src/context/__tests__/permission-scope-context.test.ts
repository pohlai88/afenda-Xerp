import {
  createTestEnterpriseId,
  DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
} from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import { assertWirePermissionScopeContext } from "../permission-scope-context.assert.js";
import type { PermissionScopeWireContext } from "../permission-scope-context.contract.js";
import {
  normalizePermissionScopeContextForWire,
  parsePermissionScopeContext,
  parseUnknownPermissionScopeContext,
} from "../permission-scope-context.parser.js";

const TENANT_ID = createTestEnterpriseId(
  "tenant",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const ENTITY_GROUP_ID = createTestEnterpriseId(
  "entityGroup",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const COMPANY_ID = createTestEnterpriseId(
  "company",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const ORG_ID = createTestEnterpriseId(
  "organization",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const TEAM_ID = createTestEnterpriseId("team", "01ARZ3NDEKTSV4RRFFQ69G5FAV");
const PROJECT_ID = createTestEnterpriseId(
  "project",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const MEMBERSHIP_ID = createTestEnterpriseId(
  "membership",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
const ROLE_ID = createTestEnterpriseId("role", "01ARZ3NDEKTSV4RRFFQ69G5FAV");

const VALID_WIRE: PermissionScopeWireContext = {
  grantScopeType: "organization",
  tenantId: TENANT_ID,
  entityGroupId: ENTITY_GROUP_ID,
  companyId: COMPANY_ID,
  organizationId: ORG_ID,
  teamId: TEAM_ID,
  projectId: PROJECT_ID,
  membershipId: MEMBERSHIP_ID,
  roleId: ROLE_ID,
  elevations: DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
};

describe("permission scope context wire triad (PAS-001 §4.4)", () => {
  it("parses valid wire and round-trips through normalize", () => {
    const context = parsePermissionScopeContext(VALID_WIRE);

    expect(normalizePermissionScopeContextForWire(context)).toEqual(VALID_WIRE);
  });

  it("parses unknown JSON ingress via parseUnknownPermissionScopeContext", () => {
    const context = parseUnknownPermissionScopeContext(
      structuredClone(VALID_WIRE) as unknown
    );

    expect(`${context.tenantId}`).toBe(TENANT_ID);
  });

  it("accepts org-backed teamId wire", () => {
    const orgBackedWire: PermissionScopeWireContext = {
      ...VALID_WIRE,
      teamId: ORG_ID,
    };

    const context = parsePermissionScopeContext(orgBackedWire);

    expect(`${context.teamId}`).toBe(ORG_ID);
  });

  it("accepts null optional scope ids", () => {
    const wire: PermissionScopeWireContext = {
      ...VALID_WIRE,
      entityGroupId: null,
      companyId: null,
      organizationId: null,
      teamId: null,
      projectId: null,
    };

    expect(
      normalizePermissionScopeContextForWire(parsePermissionScopeContext(wire))
    ).toEqual(wire);
  });

  it("rejects non-object wire before branding", () => {
    expect(() => assertWirePermissionScopeContext(null)).toThrow(
      /must be an object/i
    );
  });

  it("rejects invalid grantScopeType before branding", () => {
    expect(() =>
      parsePermissionScopeContext({
        ...VALID_WIRE,
        grantScopeType: "ghost",
      } as unknown as PermissionScopeWireContext)
    ).toThrow(/grantScopeType must be one of/i);
  });

  it("rejects invalid elevations shape before branding", () => {
    expect(() =>
      assertWirePermissionScopeContext({
        ...VALID_WIRE,
        elevations: {
          ...DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
          crossCompany: "yes",
        },
      })
    ).toThrow(/elevations\.crossCompany must be a boolean/i);
  });

  it("rejects invalid tenant id family before branding", () => {
    expect(() =>
      parsePermissionScopeContext({
        ...VALID_WIRE,
        tenantId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/tenantId/i);
  });

  it("rejects invalid membershipId family before branding", () => {
    expect(() =>
      parsePermissionScopeContext({
        ...VALID_WIRE,
        membershipId: "rol_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/membershipId|MembershipId/i);
  });

  it("rejects invalid roleId family before branding", () => {
    expect(() =>
      parsePermissionScopeContext({
        ...VALID_WIRE,
        roleId: "mem_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/roleId|RoleId/i);
  });

  it("rejects invalid entityGroupId family before branding", () => {
    expect(() =>
      parsePermissionScopeContext({
        ...VALID_WIRE,
        entityGroupId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      })
    ).toThrow(/entityGroupId|EntityGroupId/i);
  });

  it("rejects whitespace-only membershipId before branding", () => {
    expect(() =>
      assertWirePermissionScopeContext({
        ...VALID_WIRE,
        membershipId: "   ",
      })
    ).toThrow(/membershipId is required/i);
  });
});
