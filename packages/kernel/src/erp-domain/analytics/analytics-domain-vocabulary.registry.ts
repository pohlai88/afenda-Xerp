import type {
  ErpDomainBrandedIdEntry,
  ErpDomainClosedVocabularyEntry,
  ErpDomainVocabularyKind,
} from "../_internal/domain-vocabulary.types.js";
import { AGGREGATION_GRAINS } from "./aggregation-grain.contract.js";

import {
  ANALYTICS_AUDIT_ACTIONS,
  type isAnalyticsAuditAction,
} from "./analytics-audit-actions.contract.js";
import {
  ANALYTICS_PACKAGE_LIFECYCLE,
  ANALYTICS_PACKAGE_LIFECYCLE_PHASES,
} from "./analytics-authority.contract.js";
import {
  ANALYTICS_PERMISSION_DOMAINS,
  ANALYTICS_PERMISSION_KEY_VOCABULARY,
} from "./analytics-permission-vocabulary.contract.js";
import { DASHBOARD_VISIBILITIES } from "./dashboard-visibility.contract.js";
import { METRIC_CATEGORIES } from "./metric-category.contract.js";
import { QUERY_STATUSES } from "./query-status.contract.js";

export const ANALYTICS_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-ANALYTICS" as const;

export type AnalyticsDomainVocabularyKind = ErpDomainVocabularyKind;

export type AnalyticsDomainClosedVocabularyEntry =
  ErpDomainClosedVocabularyEntry;

export const ANALYTICS_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "query-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "query-status.contract.ts",
    constantExport: "QUERY_STATUSES",
    typeExport: "QueryStatus",
    narrowerExport: "isQueryStatus",
    valueCount: QUERY_STATUSES.length,
  },
  {
    id: "aggregation-grain",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "aggregation-grain.contract.ts",
    constantExport: "AGGREGATION_GRAINS",
    typeExport: "AggregationGrain",
    narrowerExport: "isAggregationGrain",
    valueCount: AGGREGATION_GRAINS.length,
  },
  {
    id: "metric-category",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "metric-category.contract.ts",
    constantExport: "METRIC_CATEGORIES",
    typeExport: "MetricCategory",
    narrowerExport: "isMetricCategory",
    valueCount: METRIC_CATEGORIES.length,
  },
  {
    id: "dashboard-visibility",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "dashboard-visibility.contract.ts",
    constantExport: "DASHBOARD_VISIBILITIES",
    typeExport: "DashboardVisibility",
    narrowerExport: "isDashboardVisibility",
    valueCount: DASHBOARD_VISIBILITIES.length,
  },
] as const satisfies readonly AnalyticsDomainClosedVocabularyEntry[];

export type AnalyticsDomainBrandedIdEntry = ErpDomainBrandedIdEntry;

export const ANALYTICS_DOMAIN_BRANDED_IDS = [
  {
    typeName: "AnalyticsQueryId",
    brandFunction: "brandAnalyticsQueryId",
    toFunction: "toAnalyticsQueryId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "DashboardDefinitionId",
    brandFunction: "brandDashboardDefinitionId",
    toFunction: "toDashboardDefinitionId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "MetricSnapshotId",
    brandFunction: "brandMetricSnapshotId",
    toFunction: "toMetricSnapshotId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly AnalyticsDomainBrandedIdEntry[];

export const ANALYTICS_DOMAIN_BRANDED_ID_TYPE_NAMES =
  ANALYTICS_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const ANALYTICS_DOMAIN_WIRE_CONTEXT = {
  id: "analytics-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "analytics-domain-wire-context.contract.ts",
  typeExport: "AnalyticsDomainWireContext",
  assertExport: "assertAnalyticsDomainWireContextJsonSerializable",
} as const;

export const ANALYTICS_DOMAIN_AUDIT_VOCABULARY = {
  id: "analytics-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "analytics-audit-actions.contract.ts",
  constantExport: "ANALYTICS_AUDIT_ACTIONS",
  typeExport: "AnalyticsAuditAction",
  narrowerExport: "isAnalyticsAuditAction",
  valueCount: ANALYTICS_AUDIT_ACTIONS.length,
} as const;

export const ANALYTICS_DOMAIN_PERMISSION_VOCABULARY = {
  id: "analytics-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "analytics-permission-vocabulary.contract.ts",
  domainsExport: "ANALYTICS_PERMISSION_DOMAINS",
  keysExport: "ANALYTICS_PERMISSION_KEY_VOCABULARY",
  domainCount: ANALYTICS_PERMISSION_DOMAINS.length,
  keyCount: ANALYTICS_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const ANALYTICS_DOMAIN_AUTHORITY_METADATA = {
  id: "analytics-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "analytics-authority.contract.ts",
  lifecycleExport: "ANALYTICS_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "ANALYTICS_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: ANALYTICS_PACKAGE_LIFECYCLE,
  phaseCount: ANALYTICS_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const ANALYTICS_DOMAIN_VOCABULARY_REGISTRY = {
  id: ANALYTICS_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: ANALYTICS_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: ANALYTICS_DOMAIN_BRANDED_IDS,
  wireContext: ANALYTICS_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: ANALYTICS_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: ANALYTICS_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: ANALYTICS_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof ANALYTICS_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isAnalyticsAuditAction
  >[0]
    ? true
    : never;

export type assertAnalyticsDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
