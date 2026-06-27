import { describe, expect, it } from "vitest";
import type { assertPermissionModelDescriptorJsonSerializable } from "../permission/index.js";
import {
  PERMISSION_ACTIONS,
  PERMISSION_MODEL_SCOPES,
  type PermissionAction,
  type PermissionModelDescriptor,
  type PermissionModelScope,
} from "../permission/index.js";

type _PermissionModelDescriptorJsonGuard =
  assertPermissionModelDescriptorJsonSerializable;

describe("permission model vocabulary", () => {
  it("satisfies compile-time AssertJsonSerializable guard", () => {
    type Guard = assertPermissionModelDescriptorJsonSerializable;
    const _guard: Guard = true;
    expect(_guard).toBe(true);
  });

  it("exports serializable permission actions from registry", () => {
    const actions: PermissionAction[] = [...PERMISSION_ACTIONS];
    expect(actions).toEqual([
      "create",
      "read",
      "update",
      "delete",
      "approve",
      "export",
      "import",
      "manage",
      "assign",
      "revoke",
    ]);
    expect(JSON.parse(JSON.stringify(actions))).toEqual(actions);
  });

  it("exports serializable permission model scopes from registry", () => {
    const scopes: PermissionModelScope[] = [...PERMISSION_MODEL_SCOPES];
    expect(scopes).toEqual([
      "tenant",
      "entity_group",
      "legal_entity",
      "organization_unit",
      "team",
      "project",
      "own_data",
      "assigned",
      "global",
    ]);
    expect(JSON.parse(JSON.stringify(scopes))).toEqual(scopes);
  });

  it("round-trips sample descriptors through JSON", () => {
    const sample: PermissionModelDescriptor = {
      module: "inventory",
      action: "read",
      scope: "tenant",
    };
    expect(JSON.parse(JSON.stringify(sample))).toEqual(sample);
  });
});

type _AssertPermissionModelDescriptorJsonGuard =
  _PermissionModelDescriptorJsonGuard extends true ? true : never;
