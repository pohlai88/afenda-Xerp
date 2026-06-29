import { defineErpRuntimeModule } from "../define-erp-runtime-module.js";
import { defineModuleAuditMap } from "../define-module-audit-map.js";
import { defineModuleContextSpineConsumer } from "../define-module-context-spine-consumer.js";
import { defineModuleEventCatalog } from "../define-module-event-catalog.js";
import { defineModuleKnowledgeMap } from "../define-module-knowledge-map.js";
import { defineModuleMetadataBinding } from "../define-module-metadata-binding.js";
import { defineModuleOutboxContract } from "../define-module-outbox-contract.js";
import { defineModuleOwnership } from "../define-module-ownership.js";
import { defineModulePermissionBinding } from "../define-module-permission-binding.js";
import { defineModuleReadiness } from "../define-module-readiness.js";
import { defineModuleRuntimeContract } from "../define-module-runtime-contract.js";
import type {
  ErpModuleFoundationBundle,
  ReadinessDimension,
} from "../erp-module-foundation.types.js";

/** Partial KV catalog for reference bundle — not full PAS-001B closure. */
export const REFERENCE_KV_CATALOG = {
  procurement: "KV-PROC",
  inventory: "KV-INV",
  accounting: "KV-ACCT",
} as const;

export const PROCUREMENT_REFERENCE_KERNEL_PERMISSION_KEYS = [
  "procurement.requisition_read",
  "procurement.requisition_create",
  "procurement.requisition_submit",
  "procurement.purchaseOrder_read",
  "procurement.purchaseOrder_create",
  "procurement.purchaseOrder_send",
] as const;

export const PROCUREMENT_REFERENCE_EVENTS = [
  "procurement.requisition.submitted",
  "procurement.purchase_order.sent",
] as const;

export const PROCUREMENT_REFERENCE_AUDIT_ACTIONS = [
  "procurement.requisition.submitted",
  "procurement.purchase_order.sent",
] as const;

const WIRE_ARTIFACT_BASE =
  "packages/kernel/src/erp-domain/procurement/procurement-authority.contract.ts";

export const PROCUREMENT_RUNTIME_MODULE = defineErpRuntimeModule({
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
  erpDomainModuleKvIds: REFERENCE_KV_CATALOG,
});

const PROCUREMENT_READINESS_MATRIX = {
  authority: "required",
  registry: "required",
  knowledge: "required",
  ownership: "required",
  database: "deferred",
  contextSpine: "required",
  permissions: "required",
  audit: "required",
  outbox: "required",
  metadata: "required",
  ui: "partial",
  operations: "deferred",
  tests: "required",
  gates: "required",
} as const;

export type ProcurementFoundationEvidence = Partial<
  Readonly<Record<ReadinessDimension, string>>
>;

/** Wire-phase base — authority intentionally empty until ERP-PROC-FDN-001 attests. */
export const PROCUREMENT_FOUNDATION_EVIDENCE: Readonly<
  Record<ReadinessDimension, string>
> = {
  authority: "",
  registry: "docs/PAS/KERNEL/SLICE/erp-mod-fdn-003-foundation-authority.md",
  knowledge: "packages/enterprise-knowledge/src/data/atoms.json",
  ownership: "docs/PAS/KERNEL/audit/procurement-foundation-gap-report.md",
  database: "",
  contextSpine: "apps/erp/src/lib/context/resolve-operating-context.server.ts",
  permissions:
    "packages/kernel/src/erp-domain/procurement/procurement-permission-vocabulary.contract.ts",
  audit:
    "packages/kernel/src/erp-domain/procurement/procurement-audit-actions.contract.ts",
  outbox:
    "packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts",
  metadata: "docs/PAS/ERP-MODULES/erp-runtime-module-foundation.template.md",
  ui: "docs/PAS/ERP-MODULES/erp-runtime-module-foundation.template.md",
  operations: "",
  tests:
    "packages/erp-module-foundation/src/__tests__/module-foundation.test.ts",
  gates: "scripts/governance/check-erp-module-foundation.mts",
};

/** Gate-attested evidence — used by PROCUREMENT_FOUNDATION_BUNDLE and readiness report. */
export const PROCUREMENT_FOUNDATION_ATTESTED_EVIDENCE = {
  authority: "docs/PAS/KERNEL/PAS-001C-ERP-MODULE-FOUNDATION-STANDARD.md",
  registry: "docs/PAS/KERNEL/SLICE/erp-mod-fdn-003-foundation-authority.md",
  knowledge: "packages/enterprise-knowledge/src/data/atoms.json",
  ownership: "docs/PAS/KERNEL/audit/procurement-foundation-gap-report.md",
  contextSpine: "apps/erp/src/lib/context/resolve-operating-context.server.ts",
  permissions:
    "packages/kernel/src/erp-domain/procurement/procurement-permission-vocabulary.contract.ts",
  audit:
    "packages/kernel/src/erp-domain/procurement/procurement-audit-actions.contract.ts",
  outbox:
    "packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts",
  metadata: "docs/PAS/ERP-MODULES/erp-runtime-module-foundation.template.md",
  ui: "docs/PAS/ERP-MODULES/erp-runtime-module-foundation.template.md",
  tests:
    "packages/erp-module-foundation/src/__tests__/module-foundation.test.ts",
  gates: "scripts/governance/check-erp-module-foundation.mts",
} as const satisfies ProcurementFoundationEvidence;

function buildKnowledgeMap() {
  return defineModuleKnowledgeMap({
    module: "procurement",
    kvId: "KV-PROC",
    terms: [
      {
        term: "procurement_requisition",
        status: "accepted",
        atomId: "procurement_requisition",
        requiredAction: "Accepted — PAS-004 B53 bridge.",
      },
      {
        term: "purchase_order",
        status: "wire_only",
        wireArtifact: WIRE_ARTIFACT_BASE,
        requiredAction: "Promote PAS-004 atom before PO runtime.",
      },
      {
        term: "supplier",
        status: "missing",
        requiredAction: "Create BMD / PAS-004 atom.",
      },
      {
        term: "module_runtime_identity",
        status: "accepted",
        atomId: "module_runtime_identity",
        requiredAction: "Accepted — EK-MOD-FDN-001.",
      },
      {
        term: "wire_catalog_key",
        status: "accepted",
        atomId: "wire_catalog_key",
        requiredAction: "Accepted — EK-MOD-FDN-001.",
      },
      {
        term: "module_ownership_contract",
        status: "accepted",
        atomId: "module_ownership_contract",
        requiredAction: "Accepted — EK-MOD-FDN-001.",
      },
      {
        term: "knowledge_map_status",
        status: "accepted",
        atomId: "knowledge_map_status",
        requiredAction: "Accepted — EK-MOD-FDN-002.",
      },
      {
        term: "operating_context_consumption",
        status: "accepted",
        atomId: "operating_context_consumption",
        requiredAction: "Accepted — EK-MOD-FDN-002.",
      },
      {
        term: "permission_binding",
        status: "accepted",
        atomId: "permission_binding",
        requiredAction: "Accepted — EK-MOD-FDN-002.",
      },
      {
        term: "audit_action_map",
        status: "accepted",
        atomId: "audit_action_map",
        requiredAction: "Accepted — EK-MOD-FDN-002.",
      },
      {
        term: "metadata_surface_binding",
        status: "accepted",
        atomId: "metadata_surface_binding",
        requiredAction: "Accepted — EK-MOD-FDN-002.",
      },
      {
        term: "module_readiness_dimension",
        status: "accepted",
        atomId: "module_readiness_dimension",
        requiredAction: "Accepted — EK-MOD-FDN-003.",
      },
      {
        term: "foundation_lifecycle_phase",
        status: "accepted",
        atomId: "foundation_lifecycle_phase",
        requiredAction: "Accepted — EK-MOD-FDN-003.",
      },
      {
        term: "module_ingress",
        status: "accepted",
        atomId: "module_ingress",
        requiredAction: "Accepted — EK-MOD-FDN-003.",
      },
      {
        term: "readiness_report",
        status: "accepted",
        atomId: "readiness_report",
        requiredAction: "Accepted — EK-MOD-FDN-003.",
      },
    ],
  });
}

function buildCoreBundle(
  evidence: Readonly<Record<ReadinessDimension, string>>
): ErpModuleFoundationBundle {
  const permissionBinding = defineModulePermissionBinding({
    module: "procurement",
    kvId: "KV-PROC",
    permissionNamespace: "procurement",
    permissionParity: "deferred",
    kernelPermissionKeys: [...PROCUREMENT_REFERENCE_KERNEL_PERMISSION_KEYS],
  });

  const metadataBinding = defineModuleMetadataBinding({
    module: "procurement",
    kvId: "KV-PROC",
    routeSlug: "procurement",
    surfaces: [
      {
        surfaceId: "procurement.foundation.readiness",
        route: "/modules/procurement/readiness",
        routeKind: "erp_module_page",
        permissionKey: "procurement.requisition_read",
        operatingContextRequired: true,
        metadataSlotId: "procurement.foundation.readiness",
      },
    ],
  });

  return {
    module: PROCUREMENT_RUNTIME_MODULE,
    ownership: defineModuleOwnership({
      wireVocabulary: "@afenda/kernel",
      businessMeaning: "@afenda/enterprise-knowledge",
      runtimeBehavior: "@afenda/procurement",
      databaseSchema: "@afenda/database",
      appIngress: "apps/erp",
      permissionRegistry: "@afenda/permissions",
      metadataBinding: "apps/erp",
      presentation: "@afenda/shadcn-studio",
    }),
    knowledge: buildKnowledgeMap(),
    permissionBinding,
    auditMap: defineModuleAuditMap({
      module: "procurement",
      kvId: "KV-PROC",
      auditNamespaceMode: "module_prefixed",
      actions: [...PROCUREMENT_REFERENCE_AUDIT_ACTIONS],
    }),
    eventCatalog: defineModuleEventCatalog({
      module: "procurement",
      events: [...PROCUREMENT_REFERENCE_EVENTS],
    }),
    outboxContract: defineModuleOutboxContract({
      module: "procurement",
      entries: [
        {
          event: "procurement.requisition.submitted",
          requirement: "deferred",
        },
        {
          event: "procurement.purchase_order.sent",
          requirement: "deferred",
        },
      ],
    }),
    metadataBinding,
    contextSpineConsumer: defineModuleContextSpineConsumer({
      module: "procurement",
      kvId: "KV-PROC",
      requiredResolvers: [
        "apps/erp/src/lib/context/resolve-operating-context.server.ts",
      ],
      forbiddenIngress: [
        "apps/erp/src/lib/context/resolve-operating-context-from-headers.server.ts",
      ],
    }),
    runtimeContract: defineModuleRuntimeContract({
      module: "procurement",
      kvId: "KV-PROC",
      lifecycle: "foundation",
      documentFamilies: ["requisition", "purchase_order", "rfq"],
      operationSummary: ["foundation.readiness.attest"],
      nonGoals: [
        "purchase order posting runtime",
        "goods receipt stock movement",
        "three-way match posting",
      ],
      crossDomainDependencies: ["inventory", "accounting"],
      requiredGates: [
        "pnpm check:procurement-domain-contracts",
        "pnpm check:erp-module-foundation",
      ],
    }),
    readiness: defineModuleReadiness({
      module: "procurement",
      kvId: "KV-PROC",
      matrix: PROCUREMENT_READINESS_MATRIX,
    }),
    evidence,
  };
}

export function buildProcurementFoundationBundle(
  evidenceOverrides?: ProcurementFoundationEvidence
): ErpModuleFoundationBundle {
  const evidence = {
    ...PROCUREMENT_FOUNDATION_EVIDENCE,
    ...evidenceOverrides,
  } as Readonly<Record<ReadinessDimension, string>>;

  return buildCoreBundle(evidence);
}

export const PROCUREMENT_FOUNDATION_BUNDLE = buildProcurementFoundationBundle(
  PROCUREMENT_FOUNDATION_ATTESTED_EVIDENCE
);

export const REFERENCE_PROCUREMENT_FOUNDATION_BUNDLE =
  PROCUREMENT_FOUNDATION_BUNDLE;
