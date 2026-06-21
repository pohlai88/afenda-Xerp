// biome-ignore-all lint/performance/noBarrelFile: TIP-007 client entry surface.
export {
  MetadataActionBar,
  MetadataActionButton,
  MetadataActionMenu,
} from "./actions/metadata-action-bar.js";
export type {
  MetadataActionBarProps,
  MetadataActionButtonProps,
  MetadataActionMenuProps,
} from "./actions/metadata-action-bar.js";

export { TabsLayout, WizardLayout } from "./layouts/tabs-layout.js";

export {
  MetadataDiagnosticsPanel,
  MetadataBoundaryWarning,
  MetadataRenderTrace,
} from "./diagnostics/metadata-diagnostics-panel.js";

export {
  listRenderer,
} from "./renderers/list-renderer.js";
export { statRenderer } from "./renderers/stat-renderer.js";
export { chartRenderer } from "./renderers/chart-renderer.js";
export { formRenderer } from "./renderers/form-renderer.js";
export { detailRenderer } from "./renderers/detail-renderer.js";
export { auditRenderer } from "./renderers/audit-renderer.js";
export { actionRenderer } from "./renderers/action-renderer.js";

export {
  sampleDashboardLayoutFixture,
} from "./fixtures/sample-dashboard-layout.fixture.js";
export { samplePageSurfaceFixture } from "./fixtures/sample-page-surface.fixture.js";
export { sampleSectionFixture } from "./fixtures/sample-section.fixture.js";

export * from "./index.js";
