import { describe, expect, it } from "vitest";
import {
  KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES,
  type OperatingContext,
} from "../context/index.js";
import {
  ACCOUNT_TYPES,
  isAccountType,
} from "../erp-domain/accounting/index.js";
import {
  type DomainEvent,
  parseUnknownDomainEvent,
  serializeDomainEvent,
} from "../events/index.js";
import {
  KERNEL_BOUNDARY_DRIFT_POLICY,
  KERNEL_CONTRACT_RULES_POLICY,
  KERNEL_DECISION_MATRIX_POLICY,
  KERNEL_PROHIBITED_OWNERSHIP_POLICY,
  KERNEL_RUNTIME_RULES_POLICY,
  listKernelBoundaryDriftEntries,
  listKernelContractRules,
  listKernelDecisionMatrixRows,
  listKernelProhibitedOwnershipConcerns,
  listKernelRuntimeRules,
} from "../governance/index.js";
import {
  createTestEnterpriseId,
  parseInternalEntityPk,
} from "../identity/index.js";
import { getPackageName, PACKAGE_NAME } from "../index.js";
import {
  isPermissionAction,
  PERMISSION_ACTIONS,
  PERMISSION_MODEL_SCOPES,
  type PermissionAction,
  parseUnknownPermissionModelDescriptor,
  serializePermissionModelDescriptor,
} from "../permission/index.js";
import {
  isPolicyDecisionKind,
  POLICY_DECISION_KINDS,
  type PolicyDecisionKind,
  parseUnknownPolicyDecision,
  serializePolicyDecision,
} from "../policy/index.js";
import { kernelContext } from "../propagation/index.js";

/** PAS §6.4 — root `.` plus registered subpaths (layout contract parity). */
const PAS_64_REQUIRED_SUBPATH_KEYS = [
  ".",
  "./context",
  "./erp-domain/accounting",
  "./propagation",
  "./events",
  "./policy",
  "./permission",
  "./governance",
] as const;

describe("@afenda/kernel subpath exports", () => {
  it("documents PAS §6.4 required subpath keys (core 9 incl. PAS-001B catalog)", () => {
    expect(PAS_64_REQUIRED_SUBPATH_KEYS).toHaveLength(8);
    expect(PAS_64_REQUIRED_SUBPATH_KEYS).toEqual([
      ".",
      "./context",
      "./erp-domain/accounting",
      "./propagation",
      "./events",
      "./policy",
      "./permission",
      "./governance",
    ]);
  });

  it("exposes PAS-001B catalog layout from ./erp-domain/catalog", async () => {
    const catalog = await import("../erp-domain/catalog/index.js");
    expect(catalog.ERP_DOMAIN_MODULE_KV_IDS.inventory).toBe("KV-INV");
    expect(catalog.ERP_DOMAIN_MODULES).toHaveLength(28);
  });

  it("exposes root vocabulary from .", () => {
    expect(getPackageName()).toBe(PACKAGE_NAME);
    expect(JSON.parse(JSON.stringify({ name: PACKAGE_NAME }))).toEqual({
      name: "@afenda/kernel",
    });
  });

  it("exposes policy and permission wire serializers from root .", () => {
    expect(typeof serializePolicyDecision).toBe("function");
    expect(typeof parseUnknownPolicyDecision).toBe("function");
    expect(typeof serializePermissionModelDescriptor).toBe("function");
    expect(typeof parseUnknownPermissionModelDescriptor).toBe("function");

    const policyWire = serializePolicyDecision({ kind: "allow" });
    expect(parseUnknownPolicyDecision(policyWire)).toEqual({ kind: "allow" });

    const permissionWire = serializePermissionModelDescriptor({
      module: "workspace",
      action: "read",
      scope: "legal_entity",
    });
    expect(parseUnknownPermissionModelDescriptor(permissionWire)).toEqual(
      permissionWire
    );
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

  it("exposes accounting ERP domain vocabulary from ./erp-domain/accounting", () => {
    expect(ACCOUNT_TYPES.length).toBeGreaterThan(0);
    expect(isAccountType("asset")).toBe(true);
    expect(isAccountType("not-an-account-type")).toBe(false);
  });

  it("exposes propagation runtime from ./propagation", () => {
    expect(kernelContext.get()).toBeNull();
    expect(typeof kernelContext.run).toBe("function");
    expect(typeof kernelContext.fork).toBe("function");
  });

  it("exposes propagation wire helpers from ./propagation", async () => {
    const propagation = await import("../propagation/index.js");
    expect(typeof propagation.serializeKernelContextFrame).toBe("function");
    expect(typeof propagation.normalizeKernelContextFrameForWire).toBe(
      "function"
    );
    expect(typeof propagation.assertKernelContextFrame).toBe("function");
    expect(typeof propagation.assertWireKernelContextFrame).toBe("function");
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
    const correlationId = createTestEnterpriseId("correlation");
    const tenantPk = parseInternalEntityPk(
      "018f9f8c-9f1a-7c2b-9c20-000000000001",
      "TenantPk"
    );

    const event: DomainEvent = {
      causationId: null,
      correlationId,
      eventId: "evt-1",
      eventName: "tenant.created",
      occurredAt: "2026-01-01T00:00:00.000Z",
      payload: { tenantSlug: "acme" },
      schemaVersion: 1,
      tenantId: null,
      tenantPk,
    };

    expect(typeof parseUnknownDomainEvent).toBe("function");
    expect(typeof serializeDomainEvent).toBe("function");
    expect(parseUnknownDomainEvent(serializeDomainEvent(event))).toEqual(event);
  });

  it("exposes governance registries from ./governance", () => {
    expect(KERNEL_DECISION_MATRIX_POLICY.pasSection).toBe("7");
    expect(listKernelDecisionMatrixRows()).toHaveLength(20);
    expect(KERNEL_PROHIBITED_OWNERSHIP_POLICY.pasSection).toBe("5");
    expect(listKernelProhibitedOwnershipConcerns()).toHaveLength(38);
    expect(KERNEL_CONTRACT_RULES_POLICY.pasSection).toBe("9");
    expect(listKernelContractRules()).toHaveLength(14);
    expect(KERNEL_RUNTIME_RULES_POLICY.pasSection).toBe("10");
    expect(listKernelRuntimeRules()).toHaveLength(7);
    expect(KERNEL_BOUNDARY_DRIFT_POLICY.entryCount).toBe(
      listKernelBoundaryDriftEntries().length
    );
  });
});
