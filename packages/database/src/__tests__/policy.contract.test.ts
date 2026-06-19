import { describe, expect, it } from "vitest";

import { createPermissionKey } from "../permission-key.contract.js";
import {
  assertPolicyKey,
  assertPolicyScopeMatchesTenant,
  buildPolicyInsertRow,
  InvalidPolicyKeyError,
  PolicyScopeTenantMismatchError,
} from "../policy/policy.contract.js";
import {
  InvalidPolicyConditionError,
  parsePolicyCondition,
  policyConditionMatches,
} from "../policy/policy.validation.js";

describe("policy contract", () => {
  it("accepts canonical dot-case policy keys", () => {
    expect(assertPolicyKey("approval.purchase_order.amount_limit")).toBe(
      "approval.purchase_order.amount_limit"
    );
  });

  it("rejects raw display names as keys", () => {
    expect(() => assertPolicyKey("Admin Policy")).toThrow(
      InvalidPolicyKeyError
    );
  });

  it("enforces scope and tenantId alignment", () => {
    expect(() =>
      assertPolicyScopeMatchesTenant("platform", "tenant-001")
    ).toThrow(PolicyScopeTenantMismatchError);
    expect(() => assertPolicyScopeMatchesTenant("workflow", null)).toThrow(
      PolicyScopeTenantMismatchError
    );
  });

  it("validates governed condition schema", () => {
    const permissionKey = createPermissionKey("accounting", "journal_read");

    const condition = parsePolicyCondition({
      version: 1,
      match: {
        permissionKey,
        action: "read",
      },
      gateDecision: "require_approval",
    });

    expect(condition.gateDecision).toBe("require_approval");
    expect(() => parsePolicyCondition({ version: 2 })).toThrow(
      InvalidPolicyConditionError
    );
  });

  it("builds governed insert rows", () => {
    const row = buildPolicyInsertRow({
      tenantId: "tenant-001",
      key: " approval.purchase_order.amount_limit ",
      name: " PO Amount Limit ",
      scope: "workflow",
      effect: "allow",
      condition: {
        version: 1,
        match: { action: "approve" },
        gateDecision: "require_approval",
      },
    });

    expect(row.key).toBe("approval.purchase_order.amount_limit");
    expect(row.priority).toBe(100);
    expect(row.condition.match?.action).toBe("approve");
  });

  it("matches evaluation input against stored conditions", () => {
    const permissionKey = createPermissionKey("accounting", "journal_read");
    const condition = parsePolicyCondition({
      version: 1,
      match: { permissionKey, action: "read" },
    });

    expect(
      policyConditionMatches(condition, {
        permissionKey,
        action: "read",
        targetType: "journal",
      })
    ).toBe(true);
    expect(
      policyConditionMatches(condition, {
        permissionKey,
        action: "post",
        targetType: "journal",
      })
    ).toBe(false);
  });
});
