/** PAS-006A — @afenda/shadcn-studio public surface (product + selective L1 wire types). */

export const SHADCN_STUDIO_PACKAGE_VERSION = "0.0.0" as const;
export const SHADCN_STUDIO_PACKAGE_NAME = "@afenda/shadcn-studio" as const;
export const SHADCN_STUDIO_CSS_PATH = "./shadcn-studio.css" as const;

export {
  AppShell,
  type AppShellProps,
} from "./components-app-shell/app-shell.js";
export {
  AppShellNav,
  type AppShellNavProps,
} from "./components-app-shell/app-shell-nav.js";
/** @deprecated Use `AppShell` */
export { AppShell as ErpDashboardShell } from "./components-app-shell/app-shell.js";
/** @deprecated Use `AppShellProps` */
export type { AppShellProps as ErpDashboardShellProps } from "./components-app-shell/app-shell.js";
/** @deprecated Use `AppShellNav` */
export { AppShellNav as ErpShellNav } from "./components-app-shell/app-shell-nav.js";
/** @deprecated Use `AppShellNavProps` */
export type { AppShellNavProps as ErpShellNavProps } from "./components-app-shell/app-shell-nav.js";
export { default as AccountSettings01Block } from "./components-layouts/account-settings-01/account-settings-01.js";
export { default as ChartEarningReportBlock } from "./components-layouts/chart-earning-report.js";
export { default as ChartSalesMetricsBlock } from "./components-layouts/chart-sales-metrics.js";
export { default as DatatableInvoiceBlock } from "./components-layouts/datatable-invoice.js";
export type { Item as DatatableProductRow } from "./components-layouts/datatable-product.js";
export { default as DatatableProductBlock } from "./components-layouts/datatable-product.js";
export type { Item as DatatableUserRow } from "./components-layouts/datatable-user.js";
export { default as DatatableUserBlock } from "./components-layouts/datatable-user.js";
export { default as ActivityDialogBlock } from "./components-layouts/dialog-activity.js";
export { default as SearchDialogBlock } from "./components-layouts/dialog-search.js";
export { default as LanguageDropdownBlock } from "./components-layouts/dropdown-language.js";
export { default as NotificationDropdownBlock } from "./components-layouts/dropdown-notification.js";
export { default as ProfileDropdownBlock } from "./components-layouts/dropdown-profile.js";
export { default as HeroSection01Block } from "./components-layouts/hero-section-01/hero-section-01.js";
export { default as LoginPage04Block } from "./components-auth-shell/login-page-04/login-page-04.js";
export {
  MorphingText,
  type MorphingTextProps,
} from "./components-layouts/morphing-text.js";
export { default as MenuTriggerBlock } from "./components-layouts/menu-trigger.js";
export { default as SidebarUserDropdownBlock } from "./components-layouts/sidebar-user-dropdown.js";
export { default as StatisticsActivityCardBlock } from "./components-layouts/statistics-activity-card.js";
export { default as StatisticsCard01Block } from "./components-layouts/statistics-card-01.js";
export { default as StatisticsCard02Block } from "./components-layouts/statistics-card-02.js";
export { default as StatisticsCard03Block } from "./components-layouts/statistics-card-03.js";
export { default as StatisticsIncomeCardBlock } from "./components-layouts/statistics-income-card.js";
export { default as StatisticsLeadsCardBlock } from "./components-layouts/statistics-leads-card.js";
export { default as StatisticsLineTrendsCardBlock } from "./components-layouts/statistics-line-trends-card.js";
export { default as StatisticsOrdersProgressCardBlock } from "./components-layouts/statistics-orders-progress-card.js";
export { default as StatisticsProfileTrafficCardBlock } from "./components-layouts/statistics-profile-traffic-card.js";
export { default as StatisticsRevenueCardBlock } from "./components-layouts/statistics-revenue-card.js";
export { default as StatisticsSalesOverviewCardBlock } from "./components-layouts/statistics-sales-overview-card.js";
export { default as StatisticsTrendCardBlock } from "./components-layouts/statistics-trend-card.js";
export { default as WidgetPaymentHistoryBlock } from "./components-layouts/widget-payment-history.js";
export { default as WidgetSalesByCountriesBlock } from "./components-layouts/widget-sales-by-countries.js";
export { default as WidgetTotalEarningBlock } from "./components-layouts/widget-total-earning.js";
export { default as WidgetTransactionsBlock } from "./components-layouts/widget-transactions.js";

export { Button, buttonVariants } from "./components-ui/button.js";
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components-ui/card.js";
export {
  Kanban,
  KanbanAddColumn,
  KanbanAddItem,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
  type KanbanMoveEvent,
} from "./components-ui/kanban.js";
export {
  type AcceptanceCriterionResult,
  type AcceptanceRecordWire,
  assertAcceptanceRecordWire,
  isAcceptanceCriterionResult,
  isAcceptanceRecordWire,
  isSealEligibleLifecycleState,
  type SealEligibleLifecycleState,
} from "./meta-contracts/acceptance-record.contract.js";
export {
  type AcceptanceRecordSealFailure,
  type AcceptanceRecordSealResult,
  type AcceptanceRecordSealSuccess,
  validateAcceptanceRecordSeal,
} from "./meta-contracts/acceptance-record.validator.js";
export {
  assertBlockDataContractWire,
  BLOCK_DATA_ACTION_KINDS,
  BLOCK_DATA_FIELD_KINDS,
  type BlockDataActionKind,
  type BlockDataActionWire,
  type BlockDataContractWire,
  type BlockDataFieldKind,
  type BlockDataFieldWire,
  isBlockDataActionKind,
  isBlockDataContractWire,
  isBlockDataFieldKind,
  isBlockDataFieldWire,
} from "./meta-contracts/block-data.contract.js";
export {
  BLOCK_LIFECYCLE_ORDER,
  type BlockLifecycleState,
  isBlockLifecycleState,
} from "./meta-contracts/block-lifecycle.contract.js";
export {
  AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE,
  type BlockSlotDomMarkerProps,
  blockSlotDomMarkerProps,
} from "./meta-contracts/block-slot-dom-marker.contract.js";
export {
  type AppShellNavGroupWire,
  type AppShellNavItemWire,
  type AppShellOperatingContextWire,
  type ErpNavGroupWire,
  type ErpNavItemWire,
  type ErpShellOperatingContextWire,
  isAppShellNavGroupWire,
  isAppShellNavItemWire,
  isAppShellOperatingContextWire,
  isErpNavGroupWire,
  isErpNavItemWire,
  isErpShellOperatingContextWire,
} from "./meta-contracts/app-shell.contract.js";
export {
  assertMetadataBindingContractWire,
  isMetadataBindingContractWire,
  isValidMetadataBindingPresentationKind,
  METADATA_BINDING_DENSITIES,
  METADATA_BINDING_PRESENTATION_KINDS,
  type MetadataBindingContractWire,
  type MetadataBindingDensity,
  type MetadataBindingFieldPresentationKind,
  type MetadataBindingFieldWire,
  type MetadataBindingStateKind,
  type MetadataBindingStateTemplateWire,
  type MetadataBindingTableColumnWire,
} from "./meta-contracts/metadata-binding.contract.js";
export {
  isMetadataBindingWaiverReason,
  isMetadataBindingWaiverWire,
  type MetadataBindingWaiverReason,
  type MetadataBindingWaiverWire,
} from "./meta-contracts/metadata-binding-waiver.contract.js";
export {
  assertSurfaceTemplateContractWire,
  isSurfaceTemplateClass,
  isSurfaceTemplateContractWire,
  SURFACE_TEMPLATE_CLASSES,
  type SurfaceTemplateBlockBindingWire,
  type SurfaceTemplateClass,
  type SurfaceTemplateContractWire,
} from "./meta-contracts/surface-template.contract.js";
export {
  assertMetadataBindingCoverage,
  type MetadataBindingCoverageResult,
  type MetadataBindingCoverageRow,
  summarizeMetadataBindingCoverage,
} from "./meta-registry/assert-metadata-binding-coverage.js";
export { isValidBlockLifecycleTransition } from "./meta-registry/block-lifecycle.js";
export {
  assertBlockLifecycleRegistryValid,
  BLOCK_LIFECYCLE_REGISTRY,
  type BlockLifecycleRegistryEntry,
  type BlockLifecycleTransitionFailure,
  type BlockLifecycleTransitionResult,
  type BlockLifecycleTransitionSuccess,
  buildInitialBlockLifecycleRegistry,
  transitionBlockLifecycleEntry,
  transitionBlockLifecycleRegistry,
} from "./meta-registry/block-lifecycle-mutation.js";
export {
  BLOCK_DATA_CONTRACT_REGISTRY,
  BLOCK_SLOT_REGISTRY,
  type BlockSlotEntry,
  type BlockSlotRole,
  getBlockDataContractForBlockId,
  getBlockSlotsForBlockId,
} from "./meta-registry/block-slot.registry.js";
export { buildMetadataBindingFromDataContracts } from "./meta-registry/build-metadata-binding-from-data-contracts.js";
export { buildPresentationInventoryFromParity } from "./meta-registry/build-presentation-inventory-from-parity.js";
export {
  MCP_SEED_BLOCK_IDS,
  MCP_SEED_BLOCK_MANIFEST,
  type McpSeedBlockId,
  type McpSeedBlockManifestEntry,
} from "./meta-registry/mcp-seed-block-manifest.js";
export {
  getMetadataBindingByBlockId,
  getMetadataBindingById,
  METADATA_BINDING_REGISTRY,
} from "./meta-registry/metadata-binding.registry.js";
export {
  METADATA_BINDING_MODULE_KV_ID_BY_SLUG,
  type MetadataBindingModuleAssignment,
  resolveMetadataBindingModuleAssignment,
} from "./meta-registry/metadata-binding-module-assignment.js";
export {
  applyMetadataBindingOverrides,
  METADATA_BINDING_OVERRIDE_REGISTRY,
  type MetadataBindingOverrideReason,
  type MetadataBindingOverrideWire,
} from "./meta-registry/metadata-binding-overrides.registry.js";
export {
  getMetadataBindingWaiverByBlockId,
  isMetadataBindingWaivedBlockId,
  METADATA_BINDING_WAIVER_REGISTRY,
} from "./meta-registry/metadata-binding-waiver.registry.js";
export {
  PRESENTATION_INVENTORY_REGISTRY,
  type PresentationInventoryEntry,
  type PresentationLayerKind,
} from "./meta-registry/presentation-inventory.registry.js";
export {
  assertSurfaceTemplateBlockComponentsRegistered,
  isStudioBlockComponentId,
  listSurfaceTemplateBlockComponentIds,
  resolveStudioBlockComponent,
  STUDIO_BLOCK_COMPONENT_REGISTRY,
  type StudioBlockComponent,
  type StudioBlockComponentId,
} from "./meta-registry/studio-block-component.registry.js";
export {
  computeStudioBlockParitySummary,
  SHADCN_STUDIO_BLOCK_PARITY_REGISTRY,
  type StudioBlockParityEntry,
  type StudioBlockParityStatus,
  type StudioBlockParitySummary,
} from "./meta-registry/studio-block-parity.registry.js";
export {
  assertSurfaceTemplateBlockDataCoverage,
  assertSurfaceTemplateMetadataBinding,
  getSurfaceTemplateById,
  SURFACE_TEMPLATE_REGISTRY,
} from "./meta-registry/surface-template.registry.js";
export {
  applyThemePresetStyles,
  clearThemePresetStyles,
  type ResolvedColorMode,
} from "./theme/apply-theme-preset.js";
export {
  ErpPresentationProviders,
  type ErpPresentationProvidersProps,
} from "./theme/erp-presentation-providers.js";
export {
  initialSettings,
  type Settings,
} from "./theme/settings.contract.js";
export {
  type SettingsContextValue,
  SettingsProvider,
  type SettingsProviderProps,
  useSettings,
} from "./theme/settings-context.js";
export {
  parseStoredSettings,
  readStoredSettings,
  type StoredSettings,
  serializeSettings,
} from "./theme/settings-storage.js";
export {
  themeConfig,
  themeConfig as themeConfigValues,
} from "./theme/theme-config.js";
export { ThemeCustomizer } from "./theme/theme-customizer.js";
export {
  assertThemePresetSlug,
  isNamedThemePresetSlug,
  isThemeMode,
  isThemePresetSlug,
  isThemeRadius,
  isThemeScale,
  NAMED_THEME_PRESET_SLUGS,
  type NamedThemePresetSlug,
  PRESET_CSS_VARS,
  type PresetCssVar,
  RADIUS_VALUES,
  THEME_LAYOUTS,
  THEME_MODES,
  THEME_PRESET_SLUGS,
  THEME_RADII,
  THEME_SCALES,
  THEME_SIDEBAR_COLLAPSIBLES,
  THEME_SIDEBAR_VARIANTS,
  type ThemeFont,
  type ThemeLayout,
  type ThemeMode,
  type ThemePreset,
  type ThemePresetMap,
  type ThemePresetSlug,
  type ThemeRadius,
  type ThemeScale,
  type ThemeSidebarCollapsible,
  type ThemeSidebarVariant,
  type ThemeStyleProps,
  type ThemeStyles,
} from "./theme/theme-preset.contract.js";
export { themePresets } from "./theme/theme-presets.js";
