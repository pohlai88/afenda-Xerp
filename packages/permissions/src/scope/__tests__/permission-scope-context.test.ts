import { DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import { assertWirePermissionScopeContext } from "../permission-scope-context.assert.js";
import type { PermissionScopeWireContext } from "../permission-scope-context.contract.js";
import {
  normalizePermissionScopeContextForWire,
  parsePermissionScopeContext,
  parseUnknownPermissionScopeContext,
} from "../permission-scope-context.parser.js";

const VALID_WIRE: PermissionScopeWireContext = {
  grantScopeType: "organization",
  tenantId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  entityGroupId: "egr_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  companyId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  organizationId: "org_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  teamId: "tem_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  projectId: "prj_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  membershipId: "mem_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  roleId: "rol_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  elevations: DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
};

describe("permission scope context wire triad (@afenda/permissions)", () => {
  it("parses valid wire and round-trips through normalize", () => {
    const context = parsePermissionScopeContext(VALID_WIRE);

    expect(normalizePermissionScopeContextForWire(context)).toEqual(VALID_WIRE);
    expect(context.tenantId).toBe(VALID_WIRE.tenantId);
  });

  it("parses unknown JSON ingress via parseUnknownPermissionScopeContext", () => {
    const context = parseUnknownPermissionScopeContext(
      structuredClone(VALID_WIRE) as unknown
    );

    expect(context.membershipId).toBe(VALID_WIRE.membershipId);
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

  it("rejects non-object wire before parse", () => {
    expect(() => assertWirePermissionScopeContext(null)).toThrow(
      /must be an object/i
    );
  });

  it("rejects invalid grantScopeType before parse", () => {
    expect(() =>
      parsePermissionScopeContext({
        ...VALID_WIRE,
        grantScopeType: "ghost",
      } as unknown as PermissionScopeWireContext)
    ).toThrow(/grantScopeType must be one of/i);
  });

  it("rejects invalid elevations shape before parse", () => {
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

  it("rejects whitespace-only membershipId before parse", () => {
    expect(() =>
      assertWirePermissionScopeContext({
        ...VALID_WIRE,
        membershipId: "   ",
      })
    ).toThrow(/membershipId is required/i);
  });
});
