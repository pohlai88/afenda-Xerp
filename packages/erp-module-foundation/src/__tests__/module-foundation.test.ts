import { describe, expect, it } from "vitest";
import {
  assertModuleReadiness,
  collectModuleReadinessFailures,
  defineErpRuntimeModule,
  defineModuleAuditMap,
  defineModuleEventCatalog,
  defineModuleKnowledgeMap,
  defineModuleMetadataBinding,
  defineModuleOutboxContract,
  defineModuleOwnership,
  defineModulePermissionBinding,
  defineModuleReadiness,
  ModuleReadinessAssertionError,
} from "../index.js";

const PROCUREMENT_KERNEL_PERMISSION_KEYS = [
  "procurement.requisition_read",
  "procurement.requisition_create",
  "procurement.purchaseOrder_read",
] as const;

const PROCUREMENT_AUDIT_ACTIONS = [
  "requisition.submitted",
  "purchase_order.sent",
] as const;

function buildProcurementFoundationBundle(
  evidence?: Partial<
    Record<
      | "authority"
      | "knowledge"
      | "ownership"
      | "database"
      | "contextSpine"
      | "permissions"
      | "audit"
      | "outbox"
      | "metadata"
      | "ui"
      | "tests"
      | "gates",
      string
    >
  >
) {
  const module = defineErpRuntimeModule({
    slug: "procurement",
    kvId: "KV-PROC",
    runtimePackage: "@afenda/procurement",
    wirePackage: "@afenda/kernel/erp-domain/procurement",
    ownerPackage: "@afenda/procurement",
    databaseOwner: "@afenda/database",
    appOwner: "apps/erp",
    permissionOwner: "@afenda/permissions",
    knowledgeOwner: "@afenda/enterprise-knowledge",
    lifecycle: "foundation",
    runtimeStatus: "foundation_authorized",
  });

  const ownership = defineModuleOwnership({
    wireVocabulary: "@afenda/kernel",
    businessMeaning: "@afenda/enterprise-knowledge",
    runtimeBehavior: "@afenda/procurement",
    databaseSchema: "@afenda/database",
    appIngress: "apps/erp",
    permissionRegistry: "@afenda/permissions",
    metadataBinding: "apps/erp",
    presentation: "@afenda/shadcn-studio",
  });

  const knowledge = defineModuleKnowledgeMap({
    module: "procurement",
    kvId: "KV-PROC",
    terms: [
      {
        term: "procurement_requisition",
        status: "accepted",
        requiredAction: "Maintain PAS-004 bridge.",
        atomId: "procurement_requisition",
        wireArtifact:
          "packages/kernel/src/erp-domain/procurement/purchase-requisition-status.contract.ts",
      },
      {
        term: "purchase_order",
        status: "wire_only",
        requiredAction: "Create PAS-004 atom before runtime behavior.",
        wireArtifact:
          "packages/kernel/src/erp-domain/procurement/purchase-order-status.contract.ts",
      },
    ],
  });

  const permissionBinding = defineModulePermissionBinding({
    module: "procurement",
    kvId: "KV-PROC",
    registryNamespace: "procurement",
    kernelPermissionKeys: [...PROCUREMENT_KERNEL_PERMISSION_KEYS],
  });

  const auditMap = defineModuleAuditMap({
    module: "procurement",
    kvId: "KV-PROC",
    actions: [...PROCUREMENT_AUDIT_ACTIONS],
  });

  const eventCatalog = defineModuleEventCatalog({
    module: "procurement",
    events: [
      "procurement.requisition.submitted",
      "procurement.purchase_order.sent",
    ],
  });

  const outboxContract = defineModuleOutboxContract({
    module: "procurement",
    entries: [
      {
        event: "procurement.purchase_order.sent",
        requirement: "required",
      },
      {
        event: "procurement.requisition.submitted",
        requirement: "deferred",
      },
    ],
  });

  const metadataBinding = defineModuleMetadataBinding({
    module: "procurement",
    kvId: "KV-PROC",
    surfaces: [
      {
        surfaceId: "procurement.requisitions.list",
        route: "/modules/procurement/requisitions",
        permissionKey: "procurement.requisition_read",
        operatingContextRequired: true,
        metadataSlotId: "procurement.requisitions.list",
      },
    ],
  });

  const readiness = defineModuleReadiness({
    module: "procurement",
    kvId: "KV-PROC",
    matrix: {
      authority: "required",
      knowledge: "required",
      ownership: "required",
      database: "deferred",
      contextSpine: "required",
      permissions: "required",
      audit: "required",
      outbox: "deferred",
      metadata: "deferred",
      ui: "deferred",
      tests: "required",
      gates: "required",
    },
  });

  return {
    module,
    ownership,
    knowledge,
    permissionBinding,
    auditMap,
    eventCatalog,
    outboxContract,
    metadataBinding,
    readiness,
    ...(evidence ? { evidence } : {}),
  };
}

describe("erp-module-foundation define helpers", () => {
  it("defines a governed ERP runtime module identity", () => {
    const module = defineErpRuntimeModule({
      slug: "procurement",
      kvId: "KV-PROC",
      runtimePackage: "@afenda/procurement",
      wirePackage: "@afenda/kernel/erp-domain/procurement",
      ownerPackage: "@afenda/procurement",
      databaseOwner: "@afenda/database",
      appOwner: "apps/erp",
      permissionOwner: "@afenda/permissions",
      knowledgeOwner: "@afenda/enterprise-knowledge",
      lifecycle: "foundation",
      runtimeStatus: "foundation_authorized",
    });

    expect(module.kvId).toBe("KV-PROC");
    expect(module.lifecycle).toBe("foundation");
  });

  it("rejects permission keys outside registry namespace", () => {
    expect(() =>
      defineModulePermissionBinding({
        module: "procurement",
        kvId: "KV-PROC",
        registryNamespace: "procurement",
        kernelPermissionKeys: ["inventory.product_read"],
      })
    ).toThrow(/registryNamespace/);
  });

  it("collects outbox failures when event is missing from catalog", () => {
    const bundle = buildProcurementFoundationBundle();
    const broken = {
      ...bundle,
      outboxContract: defineModuleOutboxContract({
        module: "procurement",
        entries: [
          {
            event: "procurement.unknown.event",
            requirement: "required",
          },
        ],
      }),
    };

    const failures = collectModuleReadinessFailures(broken);
    expect(failures.some((failure) => failure.includes("outbox event"))).toBe(
      true
    );
  });
});

describe("assertModuleReadiness", () => {
  it("passes when required dimensions have evidence", () => {
    const result = assertModuleReadiness(
      buildProcurementFoundationBundle({
        authority: "docs/PAS/KERNEL/audit/procurement-foundation-gap-report.md",
        knowledge: "packages/enterprise-knowledge/src/data/atoms.json",
        ownership: "docs/PAS/KERNEL/audit/procurement-foundation-gap-report.md",
        contextSpine:
          "apps/erp/src/lib/context/resolve-operating-context.server.ts",
        permissions:
          "packages/kernel/src/erp-domain/procurement/procurement-permission-vocabulary.contract.ts",
        audit:
          "packages/kernel/src/erp-domain/procurement/procurement-audit-actions.contract.ts",
        tests:
          "packages/erp-module-foundation/src/__tests__/module-foundation.test.ts",
        gates: "scripts/governance/check-procurement-domain-contracts.mts",
      })
    );

    expect(result.ok).toBe(true);
    expect(result.module).toBe("procurement");
  });

  it("fails when required readiness evidence is missing", () => {
    const bundle = buildProcurementFoundationBundle();

    expect(() => assertModuleReadiness(bundle)).toThrow(
      ModuleReadinessAssertionError
    );

    const failures = collectModuleReadinessFailures(bundle);
    expect(failures.some((failure) => failure.includes("authority"))).toBe(
      true
    );
  });
});
