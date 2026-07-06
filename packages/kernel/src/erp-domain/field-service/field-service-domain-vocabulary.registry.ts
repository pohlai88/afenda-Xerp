import type {
  ErpDomainBrandedIdEntry,
  ErpDomainClosedVocabularyEntry,
  ErpDomainVocabularyKind,
} from "../_internal/domain-vocabulary.types.js";
import { DISPATCH_PRIORITIES } from "./dispatch-priority.contract.js";

import {
  FIELD_SERVICE_AUDIT_ACTIONS,
  type isFieldServiceAuditAction,
} from "./field-service-audit-actions.contract.js";
import {
  FIELD_SERVICE_PACKAGE_LIFECYCLE,
  FIELD_SERVICE_PACKAGE_LIFECYCLE_PHASES,
} from "./field-service-authority.contract.js";
import {
  FIELD_SERVICE_PERMISSION_DOMAINS,
  FIELD_SERVICE_PERMISSION_KEY_VOCABULARY,
} from "./field-service-permission-vocabulary.contract.js";
import { ROUTE_STATUSES } from "./route-status.contract.js";
import { VISIT_OUTCOMES } from "./visit-outcome.contract.js";
import { WORK_ORDER_STATUSES } from "./work-order-status.contract.js";

export const FIELD_SERVICE_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-FIELD_SERVICE" as const;

export type FieldServiceDomainVocabularyKind = ErpDomainVocabularyKind;

export type FieldServiceDomainClosedVocabularyEntry =
  ErpDomainClosedVocabularyEntry;

export const FIELD_SERVICE_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "work-order-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "work-order-status.contract.ts",
    constantExport: "WORK_ORDER_STATUSES",
    typeExport: "WorkOrderStatus",
    narrowerExport: "isWorkOrderStatus",
    valueCount: WORK_ORDER_STATUSES.length,
  },
  {
    id: "dispatch-priority",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "dispatch-priority.contract.ts",
    constantExport: "DISPATCH_PRIORITIES",
    typeExport: "DispatchPriority",
    narrowerExport: "isDispatchPriority",
    valueCount: DISPATCH_PRIORITIES.length,
  },
  {
    id: "visit-outcome",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "visit-outcome.contract.ts",
    constantExport: "VISIT_OUTCOMES",
    typeExport: "VisitOutcome",
    narrowerExport: "isVisitOutcome",
    valueCount: VISIT_OUTCOMES.length,
  },
  {
    id: "route-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "route-status.contract.ts",
    constantExport: "ROUTE_STATUSES",
    typeExport: "RouteStatus",
    narrowerExport: "isRouteStatus",
    valueCount: ROUTE_STATUSES.length,
  },
] as const satisfies readonly FieldServiceDomainClosedVocabularyEntry[];

export type FieldServiceDomainBrandedIdEntry = ErpDomainBrandedIdEntry;

export const FIELD_SERVICE_DOMAIN_BRANDED_IDS = [
  {
    typeName: "FieldWorkOrderId",
    brandFunction: "brandFieldWorkOrderId",
    toFunction: "toFieldWorkOrderId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "DispatchRunId",
    brandFunction: "brandDispatchRunId",
    toFunction: "toDispatchRunId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "TechnicianRouteId",
    brandFunction: "brandTechnicianRouteId",
    toFunction: "toTechnicianRouteId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly FieldServiceDomainBrandedIdEntry[];

export const FIELD_SERVICE_DOMAIN_BRANDED_ID_TYPE_NAMES =
  FIELD_SERVICE_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const FIELD_SERVICE_DOMAIN_WIRE_CONTEXT = {
  id: "field-service-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "field-service-domain-wire-context.contract.ts",
  typeExport: "FieldServiceDomainWireContext",
  assertExport: "assertFieldServiceDomainWireContextJsonSerializable",
} as const;

export const FIELD_SERVICE_DOMAIN_AUDIT_VOCABULARY = {
  id: "field-service-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "field-service-audit-actions.contract.ts",
  constantExport: "FIELD_SERVICE_AUDIT_ACTIONS",
  typeExport: "FieldServiceAuditAction",
  narrowerExport: "isFieldServiceAuditAction",
  valueCount: FIELD_SERVICE_AUDIT_ACTIONS.length,
} as const;

export const FIELD_SERVICE_DOMAIN_PERMISSION_VOCABULARY = {
  id: "field-service-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "field-service-permission-vocabulary.contract.ts",
  domainsExport: "FIELD_SERVICE_PERMISSION_DOMAINS",
  keysExport: "FIELD_SERVICE_PERMISSION_KEY_VOCABULARY",
  domainCount: FIELD_SERVICE_PERMISSION_DOMAINS.length,
  keyCount: FIELD_SERVICE_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const FIELD_SERVICE_DOMAIN_AUTHORITY_METADATA = {
  id: "field-service-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "field-service-authority.contract.ts",
  lifecycleExport: "FIELD_SERVICE_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "FIELD_SERVICE_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: FIELD_SERVICE_PACKAGE_LIFECYCLE,
  phaseCount: FIELD_SERVICE_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const FIELD_SERVICE_DOMAIN_VOCABULARY_REGISTRY = {
  id: FIELD_SERVICE_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: FIELD_SERVICE_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: FIELD_SERVICE_DOMAIN_BRANDED_IDS,
  wireContext: FIELD_SERVICE_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: FIELD_SERVICE_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: FIELD_SERVICE_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: FIELD_SERVICE_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof FIELD_SERVICE_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isFieldServiceAuditAction
  >[0]
    ? true
    : never;

export type assertFieldServiceDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
