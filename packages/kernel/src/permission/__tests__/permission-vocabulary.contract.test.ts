import { describe, expect, it } from "vitest";

import {
  composeModuleActionWireKey,
  getPermissionAction,
  getPermissionModelScope,
  isPermissionAction,
  isPermissionModelDescriptor,
  isPermissionModelScope,
  PERMISSION_ACTIONS,
  PERMISSION_MODEL_PATTERN,
  PERMISSION_MODEL_SCOPE_GRANT_ALIASES,
  PERMISSION_MODEL_SCOPES,
  PERMISSION_VOCABULARY_AUTHORITY,
  PERMISSION_VOCABULARY_OWNERSHIP,
  type PermissionAction,
  type PermissionModelDescriptor,
  type PermissionModelScope,
} from "../index.js";

const MANUAL_ACTIONS: PermissionAction[] = [
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
];

const MANUAL_SCOPES: PermissionModelScope[] = [
  "tenant",
  "entity_group",
  "legal_entity",
  "organization_unit",
  "team",
  "project",
  "own_data",
  "assigned",
  "global",
];

describe("permission vocabulary registry", () => {
  it("locks permission action registry length at ten", () => {
    expect(PERMISSION_ACTIONS).toHaveLength(10);
    expect(PERMISSION_ACTIONS).toEqual(MANUAL_ACTIONS);
  });

  it("locks permission model scope registry length at nine", () => {
    expect(PERMISSION_MODEL_SCOPES).toHaveLength(9);
    expect(PERMISSION_MODEL_SCOPES).toEqual(MANUAL_SCOPES);
  });

  it("accepts every registry action via type guard", () => {
    for (const action of PERMISSION_ACTIONS) {
      expect(isPermissionAction(action)).toBe(true);
    }
  });

  it("accepts every registry scope via type guard", () => {
    for (const scope of PERMISSION_MODEL_SCOPES) {
      expect(isPermissionModelScope(scope)).toBe(true);
    }
  });

  it("rejects invalid action and scope strings", () => {
    expect(isPermissionAction("write")).toBe(false);
    expect(isPermissionModelScope("company")).toBe(false);
    expect(getPermissionAction("write")).toBeNull();
    expect(getPermissionModelScope("company")).toBeNull();
  });

  it("narrows valid strings via get helpers", () => {
    expect(getPermissionAction("read")).toBe("read");
    expect(getPermissionModelScope("tenant")).toBe("tenant");
  });

  it("documents grant-scope aliases for model scope words", () => {
    expect(PERMISSION_MODEL_SCOPE_GRANT_ALIASES).toEqual({
      legal_entity: "company",
      organization_unit: "organization",
    });
  });
});

describe("permission vocabulary authority metadata", () => {
  it("matches PAS-001 §8 authority pointer", () => {
    expect(PERMISSION_VOCABULARY_AUTHORITY).toEqual({
      pas: "PAS-001",
      section: "8",
    });
  });

  it("documents PAS §8 ownership split", () => {
    expect(PERMISSION_VOCABULARY_OWNERSHIP).toEqual([
      { concern: "permission model vocabulary", owner: "kernel" },
      { concern: "registry and checks", owner: "@afenda/permissions" },
      { concern: "role/permission storage", owner: "Database" },
      { concern: "route/action enforcement", owner: "ERP" },
      { concern: "HTTP error mapping", owner: "API governance" },
    ]);
  });

  it("documents PAS §8 permission model pattern", () => {
    expect(PERMISSION_MODEL_PATTERN).toBe("module × action × scope");
  });
});

describe("PermissionModelDescriptor structural guard", () => {
  const validDescriptor: PermissionModelDescriptor = {
    module: "inventory",
    action: "read",
    scope: "tenant",
  };

  it("accepts valid descriptors", () => {
    expect(isPermissionModelDescriptor(validDescriptor)).toBe(true);
  });

  it("rejects empty or whitespace-only module", () => {
    expect(
      isPermissionModelDescriptor({
        module: "",
        action: "read",
        scope: "tenant",
      })
    ).toBe(false);
    expect(
      isPermissionModelDescriptor({
        module: "   ",
        action: "read",
        scope: "tenant",
      })
    ).toBe(false);
  });

  it("rejects invalid action and scope values", () => {
    expect(
      isPermissionModelDescriptor({
        module: "inventory",
        action: "write",
        scope: "tenant",
      })
    ).toBe(false);
    expect(
      isPermissionModelDescriptor({
        module: "inventory",
        action: "read",
        scope: "company",
      })
    ).toBe(false);
  });

  it("rejects malformed wire payloads", () => {
    expect(isPermissionModelDescriptor(null)).toBe(false);
    expect(isPermissionModelDescriptor("inventory.read.tenant")).toBe(false);
    expect(isPermissionModelDescriptor({ module: "inventory" })).toBe(false);
  });

  it("round-trips sample descriptors through JSON", () => {
    const samples: PermissionModelDescriptor[] = [
      validDescriptor,
      { module: "accounting", action: "approve", scope: "legal_entity" },
      { module: "hr", action: "assign", scope: "own_data" },
    ];

    for (const sample of samples) {
      const parsed: unknown = JSON.parse(JSON.stringify(sample));
      expect(isPermissionModelDescriptor(parsed)).toBe(true);
      expect(parsed).toEqual(sample);
    }
  });

  it("allows extra keys on lenient isPermissionModelDescriptor guard", () => {
    expect(
      isPermissionModelDescriptor({
        ...validDescriptor,
        extra: true,
      })
    ).toBe(true);
  });
});

describe("permission model wire triad exports", () => {
  it("re-exports parse and serialize from permission barrel", async () => {
    const barrel = await import("../index.js");
    expect(typeof barrel.parseUnknownPermissionModelDescriptor).toBe(
      "function"
    );
    expect(typeof barrel.serializePermissionModelDescriptor).toBe("function");
    expect(typeof barrel.assertWirePermissionModelDescriptor).toBe("function");
  });
});

describe("composeModuleActionWireKey", () => {
  it("composes module.action wire segment for database parity", () => {
    expect(composeModuleActionWireKey("inventory", "read")).toBe(
      "inventory.read"
    );
    expect(composeModuleActionWireKey("accounting", "approve")).toBe(
      "accounting.approve"
    );
  });
});

describe("registry-derived types exhaustiveness", () => {
  it("matches manual action arrays", () => {
    const derived: PermissionAction[] = [...PERMISSION_ACTIONS];
    expect(derived).toEqual(MANUAL_ACTIONS);
  });

  it("matches manual scope arrays", () => {
    const derived: PermissionModelScope[] = [...PERMISSION_MODEL_SCOPES];
    expect(derived).toEqual(MANUAL_SCOPES);
  });
});
