import { describe, expect, it } from "vitest";
import type { ErpModuleFoundationBundle } from "../erp-module-foundation.types.js";
import {
  collectModuleRuntimeCompletenessFailures,
  defineModuleAuditMap,
  defineModuleContextSpineConsumer,
  defineModuleEventCatalog,
  defineModuleMetadataBinding,
  defineModuleOperationCatalog,
  defineModuleOutboxContract,
  defineModulePermissionBinding,
} from "../index.js";

function buildBundleWithOutboxOperation(): ErpModuleFoundationBundle {
  const permissionBinding = defineModulePermissionBinding({
    module: "procurement",
    kvId: "KV-PROC",
    permissionNamespace: "procurement",
    kernelPermissionKeys: ["procurement.requisition_submit"],
  });

  const auditMap = defineModuleAuditMap({
    module: "procurement",
    kvId: "KV-PROC",
    actions: ["procurement.requisition.submitted"],
  });

  const eventCatalog = defineModuleEventCatalog({
    module: "procurement",
    events: ["procurement.requisition.submitted"],
  });

  const outboxContract = defineModuleOutboxContract({
    module: "procurement",
    entries: [
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
        routeKind: "erp_module_page",
        permissionKey: "procurement.requisition_submit",
        operatingContextRequired: true,
      },
    ],
  });

  const contextSpineConsumer = defineModuleContextSpineConsumer({
    module: "procurement",
    kvId: "KV-PROC",
    requiredResolvers: ["loadProtectedRequestOperatingContext"],
    forbiddenIngress: ["session.user.tenantId"],
  });

  const operationCatalog = defineModuleOperationCatalog({
    module: "procurement",
    kvId: "KV-PROC",
    operations: [
      {
        operationId: "procurement.requisition.submit",
        permissionKey: "procurement.requisition_submit",
        auditAction: "procurement.requisition.submitted",
        outboxDecision: "required",
        outboxEvent: "procurement.requisition.submitted",
        contextRequirement: "required",
        metadataSurfaceId: "procurement.requisitions.list",
        testEvidence:
          "packages/erp-module-foundation/src/__tests__/outbox-runtime-completeness.test.ts",
      },
    ],
  });

  return {
    module: {
      slug: "procurement",
      kvId: "KV-PROC",
      permissionNamespace: "procurement",
      routeSlug: "procurement",
      runtimePackage: "@afenda/procurement",
      wirePackage: "@afenda/kernel/erp-domain/procurement",
      ownerPackage: "@afenda/procurement",
      databaseOwner: "@afenda/database",
      appOwner: "apps/erp",
      permissionOwner: "@afenda/permissions",
      knowledgeOwner: "@afenda/enterprise-knowledge",
      lifecycle: "foundation",
      runtimeStatus: "foundation_authorized",
    },
    ownership: {
      wireVocabulary: "@afenda/kernel",
      businessMeaning: "@afenda/enterprise-knowledge",
      runtimeBehavior: "@afenda/procurement",
      databaseSchema: "@afenda/database",
      appIngress: "apps/erp",
      permissionRegistry: "@afenda/permissions",
      metadataBinding: "apps/erp",
      presentation: "@afenda/shadcn-studio",
    },
    knowledge: { module: "procurement", kvId: "KV-PROC", terms: [] },
    permissionBinding,
    auditMap,
    eventCatalog,
    outboxContract,
    metadataBinding,
    contextSpineConsumer,
    operationCatalog,
    readiness: {
      module: "procurement",
      kvId: "KV-PROC",
      matrix: {
        authority: "deferred",
        registry: "deferred",
        knowledge: "deferred",
        ownership: "deferred",
        database: "deferred",
        contextSpine: "deferred",
        permissions: "deferred",
        audit: "deferred",
        outbox: "deferred",
        metadata: "deferred",
        ui: "deferred",
        operations: "deferred",
        tests: "deferred",
        gates: "deferred",
      },
    },
  };
}

describe("outbox runtime completeness strictness", () => {
  it("fails when operation requires outbox but contract entry is deferred", () => {
    const failures = collectModuleRuntimeCompletenessFailures(
      buildBundleWithOutboxOperation()
    );

    expect(
      failures.some((f) =>
        f.includes(
          "must be required in outbox contract when operation outboxDecision is required"
        )
      )
    ).toBe(true);
  });

  it("passes when outbox contract entry is required", () => {
    const bundle = buildBundleWithOutboxOperation();
    const fixed = {
      ...bundle,
      outboxContract: defineModuleOutboxContract({
        module: "procurement",
        entries: [
          {
            event: "procurement.requisition.submitted",
            requirement: "required",
          },
        ],
      }),
    };

    expect(collectModuleRuntimeCompletenessFailures(fixed)).toEqual([]);
  });
});
