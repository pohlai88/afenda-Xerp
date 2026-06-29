import { describe, expect, it } from "vitest";
import type { ErpModuleFoundationBundle } from "../erp-module-foundation.types.js";
import {
  assertModuleRuntimeCompleteness,
  collectModuleRuntimeCompletenessFailures,
  defineModuleAuditMap,
  defineModuleContextSpineConsumer,
  defineModuleDatabaseBoundary,
  defineModuleEventCatalog,
  defineModuleMetadataBinding,
  defineModuleOperationCatalog,
  defineModuleOutboxContract,
  defineModulePermissionBinding,
} from "../index.js";

function buildCompleteRuntimeBundle(): ErpModuleFoundationBundle {
  const permissionBinding = defineModulePermissionBinding({
    module: "procurement",
    kvId: "KV-PROC",
    permissionNamespace: "procurement",
    permissionParity: "deferred",
    kernelPermissionKeys: [
      "procurement.requisition_submit",
      "procurement.purchaseOrder_send",
    ],
  });

  const auditMap = defineModuleAuditMap({
    module: "procurement",
    kvId: "KV-PROC",
    actions: [
      "procurement.requisition.submitted",
      "procurement.purchase_order.sent",
    ],
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
        event: "procurement.requisition.submitted",
        requirement: "required",
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

  const databaseBoundary = defineModuleDatabaseBoundary({
    module: "procurement",
    kvId: "KV-PROC",
    tables: [
      {
        tableName: "purchase_requisitions",
        tenantScoped: true,
        companyScoped: true,
        canonicalIdField: "requisition_id",
        internalPkField: "id",
        rlsExpectation: "tenant_company_isolation",
        migrationPath:
          "packages/database/src/migrations/procurement/purchase_requisitions.sql",
        ownershipRegistryRow: "PKGR05_PROCUREMENT",
        auditFields: ["created_at", "updated_at"],
      },
    ],
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
        databaseTablesTouched: ["purchase_requisitions"],
        testEvidence:
          "packages/erp-module-foundation/src/__tests__/module-runtime-completeness.test.ts",
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
    knowledge: {
      module: "procurement",
      kvId: "KV-PROC",
      terms: [],
    },
    permissionBinding,
    auditMap,
    eventCatalog,
    outboxContract,
    metadataBinding,
    contextSpineConsumer,
    databaseBoundary,
    operationCatalog,
    readiness: {
      module: "procurement",
      kvId: "KV-PROC",
      matrix: {
        authority: "required",
        registry: "deferred",
        knowledge: "deferred",
        ownership: "required",
        database: "required",
        contextSpine: "required",
        permissions: "required",
        audit: "required",
        outbox: "required",
        metadata: "required",
        ui: "required",
        operations: "required",
        tests: "required",
        gates: "required",
      },
    },
  };
}

describe("assertModuleRuntimeCompleteness", () => {
  it("passes when every operation is fully wired", () => {
    const result = assertModuleRuntimeCompleteness(
      buildCompleteRuntimeBundle()
    );

    expect(result.ok).toBe(true);
    expect(result.module).toBe("procurement");
  });

  it.each([
    {
      case: "missing permission",
      mutate: (bundle: ErpModuleFoundationBundle) => {
        const baseOperation = bundle.operationCatalog?.operations[0];
        if (!baseOperation) {
          throw new Error("expected operation catalog operation");
        }
        return {
          ...bundle,
          operationCatalog: defineModuleOperationCatalog({
            module: "procurement",
            kvId: "KV-PROC",
            operations: [
              {
                ...baseOperation,
                permissionKey: "procurement.unknown_permission",
              },
            ],
          }),
        };
      },
      expectedFragment: "missing from permission binding",
    },
    {
      case: "missing audit",
      mutate: (bundle: ErpModuleFoundationBundle) => {
        const baseOperation = bundle.operationCatalog?.operations[0];
        if (!baseOperation) {
          throw new Error("expected operation catalog operation");
        }
        return {
          ...bundle,
          operationCatalog: defineModuleOperationCatalog({
            module: "procurement",
            kvId: "KV-PROC",
            operations: [
              {
                ...baseOperation,
                auditAction: "procurement.unknown.audit",
              },
            ],
          }),
        };
      },
      expectedFragment: "missing from audit map",
    },
    {
      case: "missing outboxEvent",
      mutate: (bundle: ErpModuleFoundationBundle) => {
        const catalog = bundle.operationCatalog;
        const baseOperation = catalog?.operations[0];
        if (!(catalog && baseOperation)) {
          throw new Error("expected operation catalog operation");
        }
        const { outboxEvent: _outboxEvent, ...operationWithoutOutbox } =
          baseOperation;
        return {
          ...bundle,
          operationCatalog: {
            module: catalog.module,
            kvId: catalog.kvId,
            operations: [operationWithoutOutbox],
          },
        };
      },
      expectedFragment: "outboxEvent is missing",
    },
    {
      case: "missing contextSpine",
      mutate: (bundle: ErpModuleFoundationBundle) => {
        const { contextSpineConsumer: _contextSpineConsumer, ...rest } = bundle;
        return rest;
      },
      expectedFragment: "contextSpineConsumer is missing",
    },
    {
      case: "missing metadata",
      mutate: (bundle: ErpModuleFoundationBundle) => {
        const catalog = bundle.operationCatalog;
        const baseOperation = catalog?.operations[0];
        if (!(catalog && baseOperation)) {
          throw new Error("expected operation catalog operation");
        }
        const {
          metadataSurfaceId: _metadataSurfaceId,
          uiWaiver: _uiWaiver,
          ...operationWithoutMetadata
        } = baseOperation;
        return {
          ...bundle,
          operationCatalog: {
            module: catalog.module,
            kvId: catalog.kvId,
            operations: [operationWithoutMetadata],
          },
        };
      },
      expectedFragment: "requires metadataSurfaceId or uiWaiver=true",
    },
    {
      case: "missing testEvidence",
      mutate: (bundle: ErpModuleFoundationBundle) => {
        const baseOperation = bundle.operationCatalog?.operations[0];
        if (!baseOperation) {
          throw new Error("expected operation catalog operation");
        }
        return {
          ...bundle,
          operationCatalog: defineModuleOperationCatalog({
            module: "procurement",
            kvId: "KV-PROC",
            operations: [
              {
                ...baseOperation,
                testEvidence: "",
              },
            ],
          }),
        };
      },
      expectedFragment: "testEvidence path is missing",
    },
  ])("collectModuleRuntimeCompletenessFailures detects $case", ({
    mutate,
    expectedFragment,
  }) => {
    const failures = collectModuleRuntimeCompletenessFailures(
      mutate(buildCompleteRuntimeBundle())
    );

    expect(failures.some((failure) => failure.includes(expectedFragment))).toBe(
      true
    );
  });
});
