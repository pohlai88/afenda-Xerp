export type {
  ApplicationShellGovernedComponents,
  ApplicationShellProps,
} from "./app-shell";
export { ApplicationShell, AppShell } from "./app-shell";
export type {
  ApplicationShellPlaceholderGovernedComponents,
  ApplicationShellPlaceholderProps,
} from "./app-shell.placeholder";
export { ApplicationShellPlaceholderContent } from "./app-shell.placeholder";
export type {
  ApplicationShellIdentity,
  ApplicationShellOperatingContext,
  AppShellMainProps,
} from "./app-shell.types";
export {
  DEFAULT_APPLICATION_SHELL_PROPS,
  resolveApplicationShellAvatarFallback,
  resolveApplicationShellChrome,
} from "./app-shell.types";
export type { AppShellMainGovernedComponents } from "./app-shell-main";
export { AppShellMain } from "./app-shell-main";
export type {
  ApplicationShellRootGovernedComponentName,
  AppShellChromeRegion,
  AppShellCommandCenterSearchLabelKey,
  AppShellCommandCenterSearchLabels,
  AppShellContextSurfaceRule,
  AppShellContextSwitchSelection,
  AppShellHeaderCommandCenterSlot,
  AppShellHeaderGovernedComponentName,
  AppShellMainGovernedComponentName,
  AppShellMainSlot,
  AppShellSearchDialogGovernedComponentName,
  AppShellSidebarSlot,
  ManifestNavProjectionInput,
} from "./contracts/index.js";
export {
  APPLICATION_SHELL_ROOT_GOVERNED_COMPONENT_NAMES,
  APPSHELL_APPROVED_RUNTIME_DEPENDENCIES,
  APPSHELL_CHROME_REGIONS,
  APPSHELL_COMMAND_CENTER_SEARCH_LABEL_KEYS,
  APPSHELL_CONTEXT_CONSUMPTION_MODULES,
  APPSHELL_CONTEXT_SURFACE_RULE,
  APPSHELL_FORBIDDEN_AUTHORITY_DEPENDENCIES,
  APPSHELL_FORBIDDEN_AUTHORITY_SYMBOLS,
  APPSHELL_HEADER_COMMAND_CENTER_SLOTS,
  APPSHELL_HEADER_GOVERNED_COMPONENT_NAMES,
  APPSHELL_MAIN_GOVERNED_COMPONENT_NAMES,
  APPSHELL_MAIN_SLOTS,
  APPSHELL_NAV_ICON_IDS,
  APPSHELL_SEARCH_DIALOG_GOVERNED_COMPONENT_NAMES,
  APPSHELL_SIDEBAR_SLOTS,
  isAppShellChromeRegion,
  isAppShellHeaderCommandCenterSlot,
  isAppShellNavIconId,
  MANIFEST_MODULE_NAV_ICON_MAP,
} from "./contracts/index.js";
export type {
  ApplicationShellDashboardCanvasProps,
  ApplicationShellDashboardDemoProps,
  DashboardGridBreakpointKey,
  DashboardLayoutPreset,
  DashboardLayoutValidationResult,
  DashboardWidgetCategory,
  DashboardWidgetDefinition,
  DashboardWidgetId,
  DashboardWidgetLayoutItem,
  DashboardWidgetRenderContext,
  DashboardWidgetRenderContextPreviewMode,
  SerializableDashboardWidgetRenderContext,
} from "./dashboard";
export {
  APPSHELL_DASHBOARD_LAYOUT_STORAGE_KEY,
  ApplicationShellDashboardCanvas,
  ApplicationShellDashboardDemo,
  applyDashboardWidgetRenderContextPreview,
  clearStoredDashboardLayout,
  DASHBOARD_GRID_BREAKPOINTS,
  DASHBOARD_WIDGET_CAPABILITIES,
  DASHBOARD_WIDGET_FINANCE_PERMISSIONS,
  DashboardWidgetRenderContextProvider,
  DEFAULT_DASHBOARD_LAYOUT,
  DEMO_DASHBOARD_WIDGET_CAPABILITIES,
  DEMO_DASHBOARD_WIDGET_PERMISSIONS,
  EMPTY_DASHBOARD_WIDGET_RENDER_CONTEXT,
  getDashboardWidgetRegistry,
  hydrateDashboardWidgetRenderContext,
  PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT,
  parseDashboardLayoutPreset,
  parseStoredDashboardLayout,
  readStoredDashboardLayout,
  resolveDashboardLayoutPreset,
  resolveDashboardWidgets,
  serializeDashboardWidgetRenderContext,
  useDashboardWidgetRenderContext,
  useOptionalDashboardWidgetRenderContext,
  validateDashboardLayoutPreset,
  writeStoredDashboardLayout,
} from "./dashboard";
export type {
  BuildNavFromManifestInput,
  ManifestModuleId,
  ManifestNavModuleEntry,
} from "./navigation/build-nav-from-manifest";
export {
  buildHydratedManifestNavigation,
  buildManifestNavigation,
  hasManifestModuleAccess,
  hydrateManifestNavigation,
  isManifestModuleId,
  MANIFEST_MODULE_IDS,
  resolveManifestModuleNavIcon,
} from "./navigation/build-nav-from-manifest";
export type { AppShellActivityDialogProps } from "./shadcn-studio/blocks/app-shell-activity-dialog";
export { AppShellActivityDialog } from "./shadcn-studio/blocks/app-shell-activity-dialog";
export type {
  AppShellActivityFeedGovernedComponents,
  AppShellActivityFeedProps,
} from "./shadcn-studio/blocks/app-shell-activity-feed";
export { AppShellActivityFeed } from "./shadcn-studio/blocks/app-shell-activity-feed";
export type { AppShellContextSwitcherProps } from "./shadcn-studio/blocks/app-shell-context-switcher";
export {
  AppShellContextSwitcher,
  type AppShellContextSwitcherGovernedComponents,
} from "./shadcn-studio/blocks/app-shell-context-switcher";
export type { AppShellDashboardStatisticsLineTrendsGovernedComponents } from "./shadcn-studio/blocks/app-shell-dashboard-statistics-line-trends";
export {
  AppShellDashboardStatisticsLineTrends,
  type AppShellDashboardStatisticsLineTrendsProps,
} from "./shadcn-studio/blocks/app-shell-dashboard-statistics-line-trends";
export type { AppShellDashboardStatisticsMetricsGovernedComponents } from "./shadcn-studio/blocks/app-shell-dashboard-statistics-metrics";
export { AppShellDashboardStatisticsMetrics } from "./shadcn-studio/blocks/app-shell-dashboard-statistics-metrics";
export type { AppShellLanguageDropdownProps } from "./shadcn-studio/blocks/app-shell-language-dropdown";
export { AppShellLanguageDropdown } from "./shadcn-studio/blocks/app-shell-language-dropdown";
export type {
  AppShellMenuTriggerGovernedComponents,
  AppShellMenuTriggerProps,
} from "./shadcn-studio/blocks/app-shell-menu-trigger";
export { AppShellMenuTrigger } from "./shadcn-studio/blocks/app-shell-menu-trigger";
export type { AppShellModuleWorkspaceChromeProps } from "./shadcn-studio/blocks/app-shell-module-workspace-chrome";
export { AppShellModuleWorkspaceChrome } from "./shadcn-studio/blocks/app-shell-module-workspace-chrome";
export type {
  AppShellNotificationDropdownGovernedComponents,
  AppShellNotificationDropdownProps,
} from "./shadcn-studio/blocks/app-shell-notification-dropdown";
export { AppShellNotificationDropdown } from "./shadcn-studio/blocks/app-shell-notification-dropdown";
export type {
  AppShellProfileDropdownGovernedComponents,
  AppShellProfileDropdownProps,
} from "./shadcn-studio/blocks/app-shell-profile-dropdown";
export { AppShellProfileDropdown } from "./shadcn-studio/blocks/app-shell-profile-dropdown";
export type {
  AppShellSearchDialogGovernedComponents,
  AppShellSearchDialogProps,
} from "./shadcn-studio/blocks/app-shell-search-dialog";
export {
  AppShellSearchCommand,
  AppShellSearchDialog,
} from "./shadcn-studio/blocks/app-shell-search-dialog";
export type {
  AppShellSidebarUserDropdownGovernedComponents,
  AppShellSidebarUserDropdownProps,
} from "./shadcn-studio/blocks/app-shell-sidebar-user-dropdown";
export { AppShellSidebarUserDropdown } from "./shadcn-studio/blocks/app-shell-sidebar-user-dropdown";
export type { StatisticsActivityCardGovernedComponents } from "./shadcn-studio/blocks/statistics-activity-card";
export { StatisticsActivityCard } from "./shadcn-studio/blocks/statistics-activity-card";
export type { StatisticsLeadsCardGovernedComponents } from "./shadcn-studio/blocks/statistics-leads-card";
export { StatisticsLeadsCard } from "./shadcn-studio/blocks/statistics-leads-card";
export type {
  StatisticsLineTrendsCardGovernedComponents,
  StatisticsLineTrendsCardProps,
  StatisticsTrendSeries,
} from "./shadcn-studio/blocks/statistics-line-trends-card";
export { StatisticsLineTrendsCard } from "./shadcn-studio/blocks/statistics-line-trends-card";
export type { StatisticsProfileTrafficCardGovernedComponents } from "./shadcn-studio/blocks/statistics-profile-traffic-card";
export { StatisticsProfileTrafficCard } from "./shadcn-studio/blocks/statistics-profile-traffic-card";
export type { StatisticsRevenueCardGovernedComponents } from "./shadcn-studio/blocks/statistics-revenue-card";
export { StatisticsRevenueCard } from "./shadcn-studio/blocks/statistics-revenue-card";
export type {
  SystemAdminReadinessGateMetric,
  SystemAdminReadinessGateMetricsGovernedComponents,
} from "./shadcn-studio/blocks/system-admin-readiness-gate-metrics";
export { SystemAdminReadinessGateMetrics } from "./shadcn-studio/blocks/system-admin-readiness-gate-metrics";
export {
  DEFAULT_APPLICATION_SHELL_ROLE_LABEL,
  DEFAULT_APPLICATION_SHELL_SEARCH_TRIGGER_LABEL,
} from "./shadcn-studio/data/app-shell.chrome.constants";
export {
  DEFAULT_APP_SHELL_DASHBOARD_COMPARISON_LABEL,
  DEFAULT_APP_SHELL_DASHBOARD_LABEL,
  defaultAppShellDashboardInvoices,
  defaultAppShellDashboardKpiMetrics,
  defaultAppShellDashboardModuleEarnings,
  defaultAppShellDashboardPaymentHistory,
  defaultAppShellDashboardRegionalSales,
  defaultAppShellDashboardSparklineMetrics,
  defaultAppShellDashboardTransactions,
} from "./shadcn-studio/data/app-shell.dashboard.data";
export type {
  AppShellDashboardInvoiceRow,
  AppShellDashboardKpiMetric,
  AppShellDashboardModuleEarningRow,
  AppShellDashboardPaymentHistoryRow,
  AppShellDashboardRegionalSalesRow,
  AppShellDashboardSparklineMetric,
  AppShellDashboardTransactionRow,
  AppShellInvoiceId,
  AppShellTransactionDirection,
  AppShellTrendDirection,
} from "./shadcn-studio/data/app-shell.dashboard.types";
export type {
  AppShellActivityActor,
  AppShellActivityFileCardItem,
  AppShellActivityFileInlineItem,
  AppShellActivityItem,
  AppShellActivityMentionItem,
  AppShellActivitySimpleItem,
  AppShellActivityTag,
  AppShellActivityTagsItem,
  AppShellActivityTagTone,
  AppShellMenuItem,
  AppShellMenuSubItem,
  AppShellNavIconId,
  AppShellNavItemSerializable,
  AppShellRecipientItem,
} from "./shadcn-studio/data/app-shell.data";
export {
  defaultAppShellActivities,
  resolveAppShellNavIcon,
} from "./shadcn-studio/data/app-shell.data";
export type { AppShellLanguageOption } from "./shadcn-studio/data/app-shell.language.data";
export {
  DEFAULT_APP_SHELL_LANGUAGE_ID,
  defaultAppShellLanguages,
} from "./shadcn-studio/data/app-shell.language.data";
export {
  DEFAULT_APP_SHELL_MAIN_CONTENT_LABEL,
  DEFAULT_APP_SHELL_MAIN_TITLE_ID,
} from "./shadcn-studio/data/app-shell.main.constants";
export type {
  AppShellNotificationActor,
  AppShellNotificationApprovalItem,
  AppShellNotificationAttachmentItem,
  AppShellNotificationItem,
  AppShellNotificationSimpleItem,
} from "./shadcn-studio/data/app-shell.notification.data";
export {
  countDefaultAppShellUnreadNotifications,
  countUnreadAppShellNotifications,
  defaultAppShellGeneralNotifications,
  defaultAppShellInboxNotifications,
} from "./shadcn-studio/data/app-shell.notification.data";
export type {
  AppShellPlaceholderKpiCard,
  AppShellPlaceholderModuleRow,
  AppShellPlaceholderOrderRow,
  AppShellPlaceholderSparklineCard,
  AppShellPlaceholderTrendDirection,
} from "./shadcn-studio/data/app-shell.placeholder.data";
export {
  APP_SHELL_PLACEHOLDER_MODULE_PERFORMANCE_SECTION_ID,
  APP_SHELL_PLACEHOLDER_RECENT_ORDERS_SECTION_ID,
  DEFAULT_APP_SHELL_PLACEHOLDER_DASHBOARD_LABEL,
  DEFAULT_APP_SHELL_PLACEHOLDER_MODULE_PERFORMANCE_TITLE,
  DEFAULT_APP_SHELL_PLACEHOLDER_MODULE_PERIOD_LABEL,
  DEFAULT_APP_SHELL_PLACEHOLDER_RECENT_ORDERS_CAPTION,
  DEFAULT_APP_SHELL_PLACEHOLDER_RECENT_ORDERS_TITLE,
  DEFAULT_APP_SHELL_PLACEHOLDER_SPARKLINE_COMPARISON_LABEL,
  defaultAppShellPlaceholderKpiCards,
  defaultAppShellPlaceholderModules,
  defaultAppShellPlaceholderOrders,
  defaultAppShellPlaceholderSparklineCards,
} from "./shadcn-studio/data/app-shell.placeholder.data";
export type {
  AppShellProfileMenuGroup,
  AppShellProfileMenuItem,
} from "./shadcn-studio/data/app-shell.profile.data";
export {
  DEFAULT_APP_SHELL_PROFILE_AVATAR_SRC,
  DEFAULT_APP_SHELL_PROFILE_DISPLAY_NAME,
  DEFAULT_APP_SHELL_PROFILE_EMAIL,
  DEFAULT_APP_SHELL_PROFILE_FALLBACK,
  defaultAppShellProfileAccountActions,
  defaultAppShellProfileAdminActions,
  defaultAppShellProfileLogoutAction,
  defaultAppShellProfileMenuGroups,
} from "./shadcn-studio/data/app-shell.profile.data";
export type {
  AppShellSearchInteraction,
  AppShellSearchParticipant,
  AppShellSearchSuggestion,
  AppShellSearchUser,
  AppShellSearchUserStatusTone,
} from "./shadcn-studio/data/app-shell.search.data";
export {
  DEFAULT_APP_SHELL_PARTICIPANT_OVERFLOW_LABEL,
  DEFAULT_APP_SHELL_SEARCH_CLOSE_HINT,
  DEFAULT_APP_SHELL_SEARCH_DIALOG_TITLE,
  DEFAULT_APP_SHELL_SEARCH_EMPTY_MESSAGE,
  DEFAULT_APP_SHELL_SEARCH_INTERACTIONS_LABEL,
  DEFAULT_APP_SHELL_SEARCH_NAVIGATE_HINT,
  DEFAULT_APP_SHELL_SEARCH_PLACEHOLDER,
  DEFAULT_APP_SHELL_SEARCH_RESULTS_LABEL,
  DEFAULT_APP_SHELL_SEARCH_SELECT_HINT,
  DEFAULT_APP_SHELL_SEARCH_SUGGESTIONS_LABEL,
  DEFAULT_APP_SHELL_SEARCH_USERS_LABEL,
  defaultAppShellSearchInteractions,
  defaultAppShellSearchSuggestions,
  defaultAppShellSearchUsers,
  filterAppShellSearchInteractions,
  filterAppShellSearchSuggestions,
  filterAppShellSearchUsers,
} from "./shadcn-studio/data/app-shell.search.data";
export {
  DEFAULT_APP_SHELL_SIDEBAR_USER_AVATAR_SRC,
  DEFAULT_APP_SHELL_SIDEBAR_USER_DISPLAY_NAME,
  DEFAULT_APP_SHELL_SIDEBAR_USER_FALLBACK,
  DEFAULT_APP_SHELL_SIDEBAR_USER_MENU_LABEL,
  DEFAULT_APP_SHELL_SIDEBAR_USER_ROLE_LABEL,
  defaultAppShellSidebarUserLogoutAction,
  defaultAppShellSidebarUserMenuItems,
} from "./shadcn-studio/data/app-shell.sidebar-user.data";
export {
  DEFAULT_STATISTICS_COMPONENT_10_LABEL,
  DEFAULT_STATISTICS_METRIC_REPORT_CAPTION,
} from "./shadcn-studio/data/statistics-component-10.data";
export {
  DEFAULT_STATISTICS_LINE_TRENDS_LABEL,
  defaultStatisticsLineTrendsCards,
} from "./shadcn-studio/data/statistics-line-trends.data";
