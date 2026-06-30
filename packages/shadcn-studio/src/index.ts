/** PAS-006A — @afenda/shadcn-studio public surface (product + selective L1 wire types). */

export const SHADCN_STUDIO_PACKAGE_VERSION = "0.0.0" as const;
export const SHADCN_STUDIO_PACKAGE_NAME = "@afenda/shadcn-studio" as const;
export const SHADCN_STUDIO_CSS_PATH = "./shadcn-studio.css" as const;

export { ErpDashboardShell } from "./components/erp-shell/erp-dashboard-shell.js";
export { ErpShellNav } from "./components/erp-shell/erp-shell-nav.js";
export { default as AccountSettings01Block } from "./components/shadcn-studio/blocks/account-settings-01/account-settings-01.js";
export { default as ChartEarningReportBlock } from "./components/shadcn-studio/blocks/chart-earning-report.js";
export { default as ChartSalesMetricsBlock } from "./components/shadcn-studio/blocks/chart-sales-metrics.js";
export { default as DatatableInvoiceBlock } from "./components/shadcn-studio/blocks/datatable-invoice.js";
export type { Item as DatatableProductRow } from "./components/shadcn-studio/blocks/datatable-product.js";
export { default as DatatableProductBlock } from "./components/shadcn-studio/blocks/datatable-product.js";
export type { Item as DatatableUserRow } from "./components/shadcn-studio/blocks/datatable-user.js";
export { default as DatatableUserBlock } from "./components/shadcn-studio/blocks/datatable-user.js";
export { default as ActivityDialogBlock } from "./components/shadcn-studio/blocks/dialog-activity.js";
export { default as SearchDialogBlock } from "./components/shadcn-studio/blocks/dialog-search.js";
export { default as LanguageDropdownBlock } from "./components/shadcn-studio/blocks/dropdown-language.js";
export { default as NotificationDropdownBlock } from "./components/shadcn-studio/blocks/dropdown-notification.js";
export { default as ProfileDropdownBlock } from "./components/shadcn-studio/blocks/dropdown-profile.js";
export { default as HeroSection01Block } from "./components/shadcn-studio/blocks/hero-section-01/hero-section-01.js";
export { default as LoginPage04Block } from "./components/shadcn-studio/blocks/login-page-04/login-page-04.js";
export { default as MenuTriggerBlock } from "./components/shadcn-studio/blocks/menu-trigger.js";
export { default as SidebarUserDropdownBlock } from "./components/shadcn-studio/blocks/sidebar-user-dropdown.js";
export { default as StatisticsActivityCardBlock } from "./components/shadcn-studio/blocks/statistics-activity-card.js";
export { default as StatisticsCard01Block } from "./components/shadcn-studio/blocks/statistics-card-01.js";
export { default as StatisticsCard02Block } from "./components/shadcn-studio/blocks/statistics-card-02.js";
export { default as StatisticsCard03Block } from "./components/shadcn-studio/blocks/statistics-card-03.js";
export { default as StatisticsIncomeCardBlock } from "./components/shadcn-studio/blocks/statistics-income-card.js";
export { default as StatisticsLeadsCardBlock } from "./components/shadcn-studio/blocks/statistics-leads-card.js";
export { default as StatisticsLineTrendsCardBlock } from "./components/shadcn-studio/blocks/statistics-line-trends-card.js";
export { default as StatisticsOrdersProgressCardBlock } from "./components/shadcn-studio/blocks/statistics-orders-progress-card.js";
export { default as StatisticsProfileTrafficCardBlock } from "./components/shadcn-studio/blocks/statistics-profile-traffic-card.js";
export { default as StatisticsRevenueCardBlock } from "./components/shadcn-studio/blocks/statistics-revenue-card.js";
export { default as StatisticsSalesOverviewCardBlock } from "./components/shadcn-studio/blocks/statistics-sales-overview-card.js";
export { default as StatisticsTrendCardBlock } from "./components/shadcn-studio/blocks/statistics-trend-card.js";
export { default as WidgetPaymentHistoryBlock } from "./components/shadcn-studio/blocks/widget-payment-history.js";
export { default as WidgetSalesByCountriesBlock } from "./components/shadcn-studio/blocks/widget-sales-by-countries.js";
export { default as WidgetTotalEarningBlock } from "./components/shadcn-studio/blocks/widget-total-earning.js";
export { default as WidgetTransactionsBlock } from "./components/shadcn-studio/blocks/widget-transactions.js";

export { Button, buttonVariants } from "./components/ui/button.js";
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card.js";
export {
  type AcceptanceCriterionResult,
  type AcceptanceRecordWire,
  assertAcceptanceRecordWire,
  isAcceptanceCriterionResult,
  isAcceptanceRecordWire,
  isSealEligibleLifecycleState,
  type SealEligibleLifecycleState,
} from "./contracts/acceptance-record.contract.js";
export {
  type AcceptanceRecordSealFailure,
  type AcceptanceRecordSealResult,
  type AcceptanceRecordSealSuccess,
  validateAcceptanceRecordSeal,
} from "./contracts/acceptance-record.validator.js";
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
} from "./contracts/block-data.contract.js";
export {
  BLOCK_LIFECYCLE_ORDER,
  type BlockLifecycleState,
  isBlockLifecycleState,
} from "./contracts/block-lifecycle.contract.js";
export {
  AFENDA_BLOCK_SLOT_DOM_ATTRIBUTE,
  type BlockSlotDomMarkerProps,
  blockSlotDomMarkerProps,
} from "./contracts/block-slot-dom-marker.contract.js";
export {
  type ErpNavGroupWire,
  type ErpNavItemWire,
  type ErpShellOperatingContextWire,
  isErpNavGroupWire,
  isErpNavItemWire,
  isErpShellOperatingContextWire,
} from "./contracts/erp-shell.contract.js";
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
} from "./contracts/metadata-binding.contract.js";
export {
  isMetadataBindingWaiverReason,
  isMetadataBindingWaiverWire,
  type MetadataBindingWaiverReason,
  type MetadataBindingWaiverWire,
} from "./contracts/metadata-binding-waiver.contract.js";
export {
  assertSurfaceTemplateContractWire,
  isSurfaceTemplateClass,
  isSurfaceTemplateContractWire,
  SURFACE_TEMPLATE_CLASSES,
  type SurfaceTemplateBlockBindingWire,
  type SurfaceTemplateClass,
  type SurfaceTemplateContractWire,
} from "./contracts/surface-template.contract.js";
export {
  assertMetadataBindingCoverage,
  type MetadataBindingCoverageResult,
  type MetadataBindingCoverageRow,
  summarizeMetadataBindingCoverage,
} from "./registry/assert-metadata-binding-coverage.js";
export { isValidBlockLifecycleTransition } from "./registry/block-lifecycle.js";
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
} from "./registry/block-lifecycle-mutation.js";
export {
  BLOCK_DATA_CONTRACT_REGISTRY,
  BLOCK_SLOT_REGISTRY,
  type BlockSlotEntry,
  type BlockSlotRole,
  getBlockDataContractForBlockId,
  getBlockSlotsForBlockId,
} from "./registry/block-slot.registry.js";
export { buildMetadataBindingFromDataContracts } from "./registry/build-metadata-binding-from-data-contracts.js";
export { buildPresentationInventoryFromParity } from "./registry/build-presentation-inventory-from-parity.js";
export {
  MCP_SEED_BLOCK_IDS,
  MCP_SEED_BLOCK_MANIFEST,
  type McpSeedBlockId,
  type McpSeedBlockManifestEntry,
} from "./registry/mcp-seed-block-manifest.js";
export {
  getMetadataBindingByBlockId,
  getMetadataBindingById,
  METADATA_BINDING_REGISTRY,
} from "./registry/metadata-binding.registry.js";
export {
  METADATA_BINDING_MODULE_KV_ID_BY_SLUG,
  type MetadataBindingModuleAssignment,
  resolveMetadataBindingModuleAssignment,
} from "./registry/metadata-binding-module-assignment.js";
export {
  applyMetadataBindingOverrides,
  METADATA_BINDING_OVERRIDE_REGISTRY,
  type MetadataBindingOverrideReason,
  type MetadataBindingOverrideWire,
} from "./registry/metadata-binding-overrides.registry.js";
export {
  getMetadataBindingWaiverByBlockId,
  isMetadataBindingWaivedBlockId,
  METADATA_BINDING_WAIVER_REGISTRY,
} from "./registry/metadata-binding-waiver.registry.js";
export {
  PRESENTATION_INVENTORY_REGISTRY,
  type PresentationInventoryEntry,
  type PresentationLayerKind,
} from "./registry/presentation-inventory.registry.js";
export {
  assertSurfaceTemplateBlockComponentsRegistered,
  isStudioBlockComponentId,
  listSurfaceTemplateBlockComponentIds,
  resolveStudioBlockComponent,
  STUDIO_BLOCK_COMPONENT_REGISTRY,
  type StudioBlockComponent,
  type StudioBlockComponentId,
} from "./registry/studio-block-component.registry.js";
export {
  computeStudioBlockParitySummary,
  SHADCN_STUDIO_BLOCK_PARITY_REGISTRY,
  type StudioBlockParityEntry,
  type StudioBlockParityStatus,
  type StudioBlockParitySummary,
} from "./registry/studio-block-parity.registry.js";
export {
  assertSurfaceTemplateBlockDataCoverage,
  assertSurfaceTemplateMetadataBinding,
  getSurfaceTemplateById,
  SURFACE_TEMPLATE_REGISTRY,
} from "./registry/surface-template.registry.js";
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
