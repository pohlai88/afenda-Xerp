import { describe, expect, it } from "vitest";
import {
  KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES,
  type OperatingContext,
} from "../context/index.js";
import {
  ACCOUNT_TYPES,
  isAccountType,
} from "../contracts/accounting-domain/index.js";
import type { DomainEvent } from "../events/index.js";
import {
  KERNEL_DECISION_MATRIX_POLICY,
  KERNEL_PROHIBITED_OWNERSHIP_POLICY,
  listKernelDecisionMatrixRows,
  listKernelProhibitedOwnershipConcerns,
} from "../governance/index.js";
import { getPackageName, PACKAGE_NAME } from "../index.js";
import {
  isPermissionAction,
  PERMISSION_ACTIONS,
  PERMISSION_MODEL_SCOPES,
  type PermissionAction,
} from "../permission/index.js";
import {
  isPolicyDecisionKind,
  POLICY_DECISION_KINDS,
  type PolicyDecisionKind,
} from "../policy/index.js";
import { kernelContext } from "../propagation/index.js";

/** PAS §6.4 — root `.` plus registered subpaths (layout contract parity). */
const PAS_64_REQUIRED_SUBPATH_KEYS = [
  ".",
  "./context",
  "./accounting-domain",
  "./propagation",
  "./events",
  "./policy",
  "./permission",
  "./governance",
] as const;

describe("@afenda/kernel subpath exports", () => {
  it("documents PAS §6.4 required subpath keys (exactly 8)", () => {
    expect(PAS_64_REQUIRED_SUBPATH_KEYS).toHaveLength(8);
    expect(PAS_64_REQUIRED_SUBPATH_KEYS).toEqual([
      ".",
      "./context",
      "./accounting-domain",
      "./propagation",
      "./events",
      "./policy",
      "./permission",
      "./governance",
    ]);
  });

  it("exposes root vocabulary from .", () => {
    expect(getPackageName()).toBe(PACKAGE_NAME);
    expect(JSON.parse(JSON.stringify({ name: PACKAGE_NAME }))).toEqual({
      name: "@afenda/kernel",
    });
  });

  it("exposes operating-context registry from ./context", () => {
    expect(KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES.length).toBeGreaterThan(0);
    expect(
      KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES.some(
        (module) => module.primaryType === "TenantContext"
      )
    ).toBe(true);
    type OperatingContextSmoke = OperatingContext;
    const smoke: Pick<OperatingContextSmoke, "correlationId"> = {
      correlationId: "corr-smoke",
    };
    expect(smoke.correlationId).toBe("corr-smoke");
  });

  it("exposes accounting-domain vocabulary from ./accounting-domain", () => {
    expect(ACCOUNT_TYPES.length).toBeGreaterThan(0);
    expect(isAccountType("asset")).toBe(true);
    expect(isAccountType("not-an-account-type")).toBe(false);
  });

  it("exposes propagation runtime from ./propagation", () => {
    expect(kernelContext.get()).toBeNull();
    expect(typeof kernelContext.run).toBe("function");
    expect(typeof kernelContext.fork).toBe("function");
  });

  it("exposes policy vocabulary registry from ./policy", () => {
    expect(POLICY_DECISION_KINDS).toContain("allow");
    const decision: PolicyDecisionKind = "allow";
    expect(decision).toBe("allow");
    expect(isPolicyDecisionKind("deny")).toBe(true);
  });

  it("exposes permission model vocabulary registry from ./permission", () => {
    expect(PERMISSION_ACTIONS).toContain("read");
    const action: PermissionAction = "read";
    expect(action).toBe("read");
    expect(isPermissionAction("manage")).toBe(true);
    expect(PERMISSION_MODEL_SCOPES).toContain("tenant");
  });

  it("exposes domain event envelope from ./events", () => {
    const event: DomainEvent = {
      causationId: null,
      correlationId: "corr-1" as DomainEvent["correlationId"],
      eventId: "evt-1",
      eventName: "tenant.created",
      occurredAt: "2026-01-01T00:00:00.000Z",
      payload: { tenantSlug: "acme" },
      schemaVersion: 1,
      tenantId: null,
    };

    expect(JSON.parse(JSON.stringify(event)).eventName).toBe("tenant.created");
  });

  it("exposes governance registries from ./governance", () => {
    expect(KERNEL_DECISION_MATRIX_POLICY.pasSection).toBe("7");
    expect(listKernelDecisionMatrixRows()).toHaveLength(20);
    expect(KERNEL_PROHIBITED_OWNERSHIP_POLICY.pasSection).toBe("5");
    expect(listKernelProhibitedOwnershipConcerns()).toHaveLength(38);
  });
});
