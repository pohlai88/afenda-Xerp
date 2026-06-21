// biome-ignore-all lint/performance/noBarrelFile: TIP-007 server entry surface.
export {
  MetadataSurface,
  MetadataPageSurface,
  MetadataModuleSurface,
  MetadataWorkspaceSurface,
} from "./surfaces/index.js";
export type {
  MetadataModuleSurfaceProps,
  MetadataPageSurfaceProps,
  MetadataSpecificSurfaceProps,
  MetadataSurfaceProps,
  MetadataWorkspaceSurfaceProps,
} from "./surfaces/index.js";

export {
  MetadataLayout,
  DashboardLayout,
  GridLayout,
  PanelLayout,
  StackLayout,
  TabsLayout,
  WizardLayout,
} from "./layouts/index.js";
export type {
  MetadataLayoutProps,
  MetadataSpecificLayoutProps,
} from "./layouts/index.js";

export {
  MetadataSection,
  ListSection,
  StatSection,
  ChartSection,
  FormSection,
  DetailSection,
  AuditSection,
  ActionSection,
} from "./sections/index.js";
export type {
  MetadataSectionProps,
  MetadataSpecificSectionProps,
} from "./sections/index.js";

export {
  MetadataState,
  MetadataLoadingState,
  MetadataEmptyState,
  MetadataErrorState,
  MetadataForbiddenState,
  MetadataInvalidState,
  MetadataDegradedState,
  MetadataPartialState,
  MetadataReadonlyState,
  MetadataMaintenanceState,
} from "./states/index.js";
export type {
  MetadataSpecificStateProps,
  MetadataStateCopy,
  MetadataStateProps,
} from "./states/index.js";

export * from "./index.js";
