/**
 * PAS-001B B105 — analytics ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/analytics`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed analytics-domain export surface.

export {
  AGGREGATION_GRAINS,
  type AggregationGrain,
  isAggregationGrain,
} from "./aggregation-grain.contract.js";
export {
  ANALYTICS_AUDIT_ACTIONS,
  type AnalyticsAuditAction,
  isAnalyticsAuditAction,
  parseAnalyticsAuditAction,
} from "./analytics-audit-actions.contract.js";
export {
  ANALYTICS_AUTHORITY_FINGERPRINT,
  ANALYTICS_AUTHORITY_PAS,
  ANALYTICS_CONTRACTS_OWNER,
  ANALYTICS_MODULE_KV_ID,
  ANALYTICS_PACKAGE_LIFECYCLE,
  ANALYTICS_PACKAGE_LIFECYCLE_PHASES,
  ANALYTICS_REGISTRY_ID,
  type AnalyticsPackageLifecyclePhase,
  isAnalyticsPackageLifecyclePhase,
} from "./analytics-authority.contract.js";
export {
  ANALYTICS_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  ANALYTICS_DOMAIN_VOCABULARY_POLICY,
  type AnalyticsDomainProhibitedRuntimeSurface,
} from "./analytics-domain-vocabulary.policy.js";
export {
  ANALYTICS_DOMAIN_AUDIT_VOCABULARY,
  ANALYTICS_DOMAIN_AUTHORITY_METADATA,
  ANALYTICS_DOMAIN_BRANDED_ID_TYPE_NAMES,
  ANALYTICS_DOMAIN_BRANDED_IDS,
  ANALYTICS_DOMAIN_CLOSED_VOCABULARIES,
  ANALYTICS_DOMAIN_PERMISSION_VOCABULARY,
  ANALYTICS_DOMAIN_VOCABULARY_REGISTRY,
  ANALYTICS_DOMAIN_VOCABULARY_REGISTRY_ID,
  ANALYTICS_DOMAIN_WIRE_CONTEXT,
  type AnalyticsDomainBrandedIdEntry,
  type AnalyticsDomainClosedVocabularyEntry,
  type AnalyticsDomainVocabularyKind,
  type assertAnalyticsDomainVocabularyRegistryIntegrity,
} from "./analytics-domain-vocabulary.registry.js";
export type {
  AnalyticsDomainWireContext,
  assertAnalyticsDomainWireContextJsonSerializable,
} from "./analytics-domain-wire-context.contract.js";
export {
  type AnalyticsQueryId,
  brandAnalyticsQueryId,
  brandDashboardDefinitionId,
  brandMetricSnapshotId,
  type DashboardDefinitionId,
  type MetricSnapshotId,
  toAnalyticsQueryId,
  toDashboardDefinitionId,
  toMetricSnapshotId,
} from "./analytics-id.contract.js";
export {
  ANALYTICS_PERMISSION_ACTIONS,
  ANALYTICS_PERMISSION_DOMAINS,
  ANALYTICS_PERMISSION_KEY_VOCABULARY,
  type AnalyticsPermissionAction,
  type AnalyticsPermissionDomain,
  type AnalyticsPermissionKey,
  toAnalyticsPermissionKey,
} from "./analytics-permission-vocabulary.contract.js";
export {
  DASHBOARD_VISIBILITIES,
  type DashboardVisibility,
  isDashboardVisibility,
} from "./dashboard-visibility.contract.js";
export {
  isMetricCategory,
  METRIC_CATEGORIES,
  type MetricCategory,
} from "./metric-category.contract.js";
export {
  isQueryStatus,
  QUERY_STATUSES,
  type QueryStatus,
} from "./query-status.contract.js";
