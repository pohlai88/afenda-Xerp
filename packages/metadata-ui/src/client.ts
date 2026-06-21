// biome-ignore-all lint/performance/noBarrelFile: TIP-007 client entry surface.
export {
  MetadataActionBar,
  MetadataActionButton,
  MetadataActionMenu,
} from "./client/metadata-action-renderer.client.js";
export type {
  MetadataActionBarProps,
  MetadataActionButtonProps,
  MetadataActionMenuProps,
} from "./client/metadata-action-renderer.client.js";
export type { MetadataActionResultHandler } from "./contracts/action.contract.js";

export {
  MetadataBoundaryWarning,
  MetadataDiagnosticsPanel,
  MetadataRenderTrace,
} from "./diagnostics/index.js";
export type { MetadataBoundaryWarningProps } from "./contracts/diagnostics.contract.js";

export { TabsLayout, WizardLayout } from "./layouts/index.js";
export type { MetadataSpecificLayoutProps } from "./layouts/index.js";

export {
  actionRenderer,
  auditRenderer,
  chartRenderer,
  detailRenderer,
  formRenderer,
  listRenderer,
  statRenderer,
} from "./renderers/index.js";

export {
  sampleDashboardLayoutFixture,
  sampleDashboardLayoutIdentity,
  sampleDashboardDominantMetric,
  sampleDashboardRailMetrics,
  sampleDashboardAttentionQueue,
  sampleDashboardTrendEvidence,
  sampleDashboardActivityRows,
  sampleDashboardLayoutProps,
  sampleDashboardLayoutRenderProps,
} from "./fixtures/sample-dashboard-layout.fixture.js";
export {
  samplePageSurfaceFixture,
  samplePageSurfaceActions,
  samplePageSurfaceAuditEntries,
  samplePageSurfaceBreadcrumbs,
  samplePageSurfaceIdentity,
  samplePageSurfaceOrderRows,
  samplePageSurfaceProps,
  samplePageSurfaceRenderProps,
  samplePageSurfaceSelectedOrder,
} from "./fixtures/sample-page-surface.fixture.js";
export type { MetadataPageSurfaceFixtureProps } from "./fixtures/sample-page-surface.fixture.js";
export {
  sampleListSectionFixture,
  sampleListSectionIdentity,
  sampleListSectionOrderRows,
  sampleListSectionProps,
  sampleListSectionRenderProps,
} from "./fixtures/sample-list-section.fixture.js";
export type { MetadataListSectionFixtureProps } from "./fixtures/sample-list-section.fixture.js";
export {
  sampleLoadingStateFixture,
  sampleLoadingStateProps,
  sampleLoadingStateRenderProps,
  sampleStateCatalog,
  sampleStateFixtureList,
  sampleStateFixtures,
} from "./fixtures/sample-state.fixture.js";
export type {
  MetadataStateFixtureProps,
  SampleStateFixture,
} from "./fixtures/sample-state.fixture.js";

export * from "./index.js";
