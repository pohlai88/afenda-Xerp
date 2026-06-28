/** PAS-005A — @afenda/shadcn-studio public surface (B38–B42f MCP live seed). */

export const SHADCN_STUDIO_PACKAGE_VERSION = "0.0.0" as const;
export const SHADCN_STUDIO_PACKAGE_NAME = "@afenda/shadcn-studio" as const;
export const SHADCN_STUDIO_CSS_PATH = "./shadcn-studio.css" as const;

export {
  shadcnStudioBlockDocs,
  shadcnStudioCenteredLayout,
  shadcnStudioDarkThemeGlobals,
  shadcnStudioFullscreenLayout,
  shadcnStudioPaddedLayout,
  shadcnStudioPrimitivesDocs,
  shadcnStudioStoryA11y,
  shadcnStudioThemeLabDocs,
} from "./_storybook/story-parameters.js";

export { default as AccountSettings01Block } from "./components/shadcn-studio/blocks/account-settings-01/account-settings-01.js";
export { default as AccountSettings02Block } from "./components/shadcn-studio/blocks/account-settings-02/account-settings-02.js";
export { default as AccountSettings03Block } from "./components/shadcn-studio/blocks/account-settings-03/account-settings-03.js";
export { default as AccountSettings04Block } from "./components/shadcn-studio/blocks/account-settings-04/account-settings-04.js";
export { default as AccountSettings05Block } from "./components/shadcn-studio/blocks/account-settings-05/account-settings-05.js";
export { default as AccountSettings06Block } from "./components/shadcn-studio/blocks/account-settings-06/account-settings-06.js";
export { default as AccountSettings07Block } from "./components/shadcn-studio/blocks/account-settings-07/account-settings-07.js";
export { default as ChartEarningReportBlock } from "./components/shadcn-studio/blocks/chart-earning-report.js";
export { default as ChartSalesMetricsBlock } from "./components/shadcn-studio/blocks/chart-sales-metrics.js";
export { default as DatatableInvoiceBlock } from "./components/shadcn-studio/blocks/datatable-invoice.js";
export { default as ActivityDialogBlock } from "./components/shadcn-studio/blocks/dialog-activity.js";
export { default as SearchDialogBlock } from "./components/shadcn-studio/blocks/dialog-search.js";
export { default as LanguageDropdownBlock } from "./components/shadcn-studio/blocks/dropdown-language.js";
export { default as NotificationDropdownBlock } from "./components/shadcn-studio/blocks/dropdown-notification.js";
export { default as ProfileDropdownBlock } from "./components/shadcn-studio/blocks/dropdown-profile.js";
export { default as ErrorPage02Block } from "./components/shadcn-studio/blocks/error-page-02/error-page-02.js";
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
  computeStudioBlockParitySummary,
  LEGACY_APPSHELL_STUDIO_BLOCK_COUNT,
  SHADCN_STUDIO_BLOCK_PARITY_REGISTRY,
  type StudioBlockParityEntry,
  type StudioBlockParityStatus,
  type StudioBlockParitySummary,
} from "./registry/studio-block-parity.registry.js";
export {
  applyThemePresetStyles,
  clearThemePresetStyles,
  type ResolvedColorMode,
} from "./theme/apply-theme-preset.js";
export {
  initialSettings,
  type Settings,
  type SettingsContextValue,
  SettingsProvider,
  type SettingsProviderProps,
  useSettings,
} from "./theme/settings-context.js";
export {
  default as themeConfig,
  themeConfig as themeConfigValues,
} from "./theme/theme-config.js";
export { ThemeCustomizer } from "./theme/theme-customizer.js";
export {
  assertThemePresetSlug,
  isThemePresetSlug,
  NAMED_THEME_PRESET_SLUGS,
  type NamedThemePresetSlug,
  PRESET_CSS_VARS,
  type PresetCssVar,
  RADIUS_VALUES,
  THEME_PRESET_SLUGS,
  type ThemeFont,
  type ThemeMode,
  type ThemePreset,
  type ThemePresetMap,
  type ThemePresetSlug,
  type ThemeRadius,
  type ThemeScale,
  type ThemeStyleProps,
  type ThemeStyles,
} from "./theme/theme-preset.contract.js";
export { themePresets } from "./theme/theme-presets.js";
