// biome-ignore-all lint/performance/noBarrelFile: TIP-007 server entry surface.

export * from "./index.js";
export type {
  MetadataLayoutProps,
  MetadataSpecificLayoutProps,
} from "./layouts/index.js";

export {
  DashboardLayout,
  GridLayout,
  MetadataLayout,
  PanelLayout,
  StackLayout,
  TabsLayout,
  WizardLayout,
} from "./layouts/index.js";
export type {
  MetadataSectionProps,
  MetadataSpecificSectionProps,
} from "./sections/index.js";

export {
  ActionSection,
  AuditSection,
  ChartSection,
  DetailSection,
  FormSection,
  ListSection,
  MetadataSection,
  StatSection,
} from "./sections/index.js";
export type {
  MetadataSpecificStateProps,
  MetadataStateCopy,
  MetadataStateProps,
} from "./states/index.js";

export {
  MetadataDegradedState,
  MetadataEmptyState,
  MetadataErrorState,
  MetadataForbiddenState,
  MetadataInvalidState,
  MetadataLoadingState,
  MetadataMaintenanceState,
  MetadataPartialState,
  MetadataReadonlyState,
  MetadataState,
} from "./states/index.js";
export type {
  MetadataModuleSurfaceProps,
  MetadataPageSurfaceProps,
  MetadataSpecificSurfaceProps,
  MetadataSurfaceProps,
  MetadataWorkspaceSurfaceProps,
} from "./surfaces/index.js";
export {
  MetadataModuleSurface,
  MetadataPageSurface,
  MetadataSurface,
  MetadataWorkspaceSurface,
} from "./surfaces/index.js";
export {
  metadataRuntimeDensityToGovernedDensity,
  resolveMetadataUiDensityAttribute,
  resolveMetadataUiGovernedClassName,
} from "./wiring/governance.js";
