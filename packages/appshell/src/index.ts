export {
  APPSHELL_APPROVED_RUNTIME_DEPENDENCIES,
  APPSHELL_CONTEXT_CONSUMPTION_MODULES,
  APPSHELL_CONTEXT_SURFACE_RULE,
  APPSHELL_FORBIDDEN_AUTHORITY_DEPENDENCIES,
  APPSHELL_FORBIDDEN_AUTHORITY_SYMBOLS,
} from "./context/index.js";
export type {
  ApplicationShellGovernedComponents,
  ApplicationShellProps,
} from "./app-shell";
export { AppShell, ApplicationShell } from "./app-shell";
export {
  DEFAULT_APPLICATION_SHELL_ROLE_LABEL,
  DEFAULT_APPLICATION_SHELL_SEARCH_TRIGGER_LABEL,
} from "./shadcn-studio/data/app-shell.chrome.constants";
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
export { AppShellMain } from "./app-shell-main";
export type { AppShellMainGovernedComponents } from "./app-shell-main";
export {
  DEFAULT_APP_SHELL_MAIN_CONTENT_LABEL,
  DEFAULT_APP_SHELL_MAIN_TITLE_ID,
} from "./shadcn-studio/data/app-shell.main.constants";
export type {
  AppShellActivityActor,
  AppShellActivityFileCardItem,
  AppShellActivityFileInlineItem,
  AppShellActivityItem,
  AppShellActivityMentionItem,
  AppShellActivitySimpleItem,
  AppShellActivityTag,
  AppShellActivityTagTone,
  AppShellActivityTagsItem,
  AppShellMenuItem,
  AppShellMenuSubItem,
  AppShellRecipientItem,
} from "./shadcn-studio/data/app-shell.data";
export { defaultAppShellActivities } from "./shadcn-studio/data/app-shell.data";
export type {
  AppShellNavIconId,
  AppShellNavItemSerializable,
} from "./shadcn-studio/data/app-shell.data";
export { resolveAppShellNavIcon } from "./shadcn-studio/data/app-shell.data";
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
  DEFAULT_APP_SHELL_PLACEHOLDER_MODULE_PERIOD_LABEL,
  DEFAULT_APP_SHELL_PLACEHOLDER_MODULE_PERFORMANCE_TITLE,
  DEFAULT_APP_SHELL_PLACEHOLDER_RECENT_ORDERS_CAPTION,
  DEFAULT_APP_SHELL_PLACEHOLDER_RECENT_ORDERS_TITLE,
  DEFAULT_APP_SHELL_PLACEHOLDER_SPARKLINE_COMPARISON_LABEL,
  defaultAppShellPlaceholderKpiCards,
  defaultAppShellPlaceholderModules,
  defaultAppShellPlaceholderOrders,
  defaultAppShellPlaceholderSparklineCards,
} from "./shadcn-studio/data/app-shell.placeholder.data";
export type {
  AppShellDashboardInvoiceRow,
  AppShellDashboardKpiMetric,
  AppShellDashboardModuleEarningRow,
  AppShellDashboardPaymentHistoryRow,
  AppShellDashboardRegionalSalesRow,
  AppShellDashboardSparklineMetric,
  AppShellDashboardTransactionRow,
  AppShellInvoiceId,
  AppShellTrendDirection,
  AppShellTransactionDirection,
} from "./shadcn-studio/data/app-shell.dashboard.types";
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
  ApplicationShellPlaceholderGovernedComponents,
  ApplicationShellPlaceholderProps,
} from "./app-shell.placeholder";
export { ApplicationShellPlaceholderContent } from "./app-shell.placeholder";
export {
  ApplicationShellDashboardCanvas,
  ApplicationShellDashboardDemo,
  applyDashboardWidgetRenderContextPreview,
  DEFAULT_DASHBOARD_LAYOUT,
  DashboardWidgetRenderContextProvider,
  DEMO_DASHBOARD_WIDGET_CAPABILITIES,
  DEMO_DASHBOARD_WIDGET_PERMISSIONS,
  DASHBOARD_GRID_BREAKPOINTS,
  DASHBOARD_WIDGET_CAPABILITIES,
  DASHBOARD_WIDGET_FINANCE_PERMISSIONS,
  EMPTY_DASHBOARD_WIDGET_RENDER_CONTEXT,
  hydrateDashboardWidgetRenderContext,
  PERMISSIVE_DASHBOARD_WIDGET_RENDER_CONTEXT,
  serializeDashboardWidgetRenderContext,
  useDashboardWidgetRenderContext,
  useOptionalDashboardWidgetRenderContext,
  APPSHELL_DASHBOARD_LAYOUT_STORAGE_KEY,
  clearStoredDashboardLayout,
  getDashboardWidgetRegistry,
  parseStoredDashboardLayout,
  parseDashboardLayoutPreset,
  readStoredDashboardLayout,
  resolveDashboardLayoutPreset,
  resolveDashboardWidgets,
  validateDashboardLayoutPreset,
  writeStoredDashboardLayout,
} from "./dashboard";
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
export type {
  StatisticsLineTrendsCardGovernedComponents,
  StatisticsLineTrendsCardProps,
  StatisticsTrendSeries,
} from "./shadcn-studio/blocks/statistics-line-trends-card";
export { StatisticsLineTrendsCard } from "./shadcn-studio/blocks/statistics-line-trends-card";
export {
  DEFAULT_STATISTICS_LINE_TRENDS_LABEL,
  defaultStatisticsLineTrendsCards,
} from "./shadcn-studio/data/statistics-line-trends.data";
export { StatisticsActivityCard } from "./shadcn-studio/blocks/statistics-activity-card";
export type { StatisticsActivityCardGovernedComponents } from "./shadcn-studio/blocks/statistics-activity-card";
export { StatisticsLeadsCard } from "./shadcn-studio/blocks/statistics-leads-card";
export type { StatisticsLeadsCardGovernedComponents } from "./shadcn-studio/blocks/statistics-leads-card";
export { StatisticsProfileTrafficCard } from "./shadcn-studio/blocks/statistics-profile-traffic-card";
export type { StatisticsProfileTrafficCardGovernedComponents } from "./shadcn-studio/blocks/statistics-profile-traffic-card";
export { StatisticsRevenueCard } from "./shadcn-studio/blocks/statistics-revenue-card";
export type { StatisticsRevenueCardGovernedComponents } from "./shadcn-studio/blocks/statistics-revenue-card";
export type { AppShellDashboardStatisticsLineTrendsGovernedComponents } from "./shadcn-studio/blocks/app-shell-dashboard-statistics-line-trends";
export {
  AppShellDashboardStatisticsLineTrends,
  type AppShellDashboardStatisticsLineTrendsProps,
} from "./shadcn-studio/blocks/app-shell-dashboard-statistics-line-trends";
export type { AppShellDashboardStatisticsMetricsGovernedComponents } from "./shadcn-studio/blocks/app-shell-dashboard-statistics-metrics";
export { AppShellDashboardStatisticsMetrics } from "./shadcn-studio/blocks/app-shell-dashboard-statistics-metrics";
export {
  DEFAULT_STATISTICS_COMPONENT_10_LABEL,
  DEFAULT_STATISTICS_METRIC_REPORT_CAPTION,
} from "./shadcn-studio/data/statistics-component-10.data";
export type { AppShellContextSwitcherProps } from "./shadcn-studio/blocks/app-shell-context-switcher";
export {
  AppShellContextSwitcher,
  type AppShellContextSwitchSelection,
  type AppShellContextSwitcherGovernedComponents,
} from "./shadcn-studio/blocks/app-shell-context-switcher";
export type { AppShellActivityDialogProps } from "./shadcn-studio/blocks/app-shell-activity-dialog";
export { AppShellActivityDialog } from "./shadcn-studio/blocks/app-shell-activity-dialog";
export type {
  AppShellActivityFeedGovernedComponents,
  AppShellActivityFeedProps,
} from "./shadcn-studio/blocks/app-shell-activity-feed";
export { AppShellActivityFeed } from "./shadcn-studio/blocks/app-shell-activity-feed";
export type { AppShellLanguageDropdownProps } from "./shadcn-studio/blocks/app-shell-language-dropdown";
export { AppShellLanguageDropdown } from "./shadcn-studio/blocks/app-shell-language-dropdown";
export type { AppShellLanguageOption } from "./shadcn-studio/data/app-shell.language.data";
export {
  DEFAULT_APP_SHELL_LANGUAGE_ID,
  defaultAppShellLanguages,
} from "./shadcn-studio/data/app-shell.language.data";
export type {
  AppShellMenuTriggerGovernedComponents,
  AppShellMenuTriggerProps,
} from "./shadcn-studio/blocks/app-shell-menu-trigger";
export { AppShellMenuTrigger } from "./shadcn-studio/blocks/app-shell-menu-trigger";
export type {
  AppShellNotificationDropdownGovernedComponents,
  AppShellNotificationDropdownProps,
} from "./shadcn-studio/blocks/app-shell-notification-dropdown";
export { AppShellNotificationDropdown } from "./shadcn-studio/blocks/app-shell-notification-dropdown";
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
  AppShellProfileDropdownGovernedComponents,
  AppShellProfileDropdownProps,
} from "./shadcn-studio/blocks/app-shell-profile-dropdown";
export { AppShellProfileDropdown } from "./shadcn-studio/blocks/app-shell-profile-dropdown";
export type { AppShellSearchDialogProps } from "./shadcn-studio/blocks/app-shell-search-dialog";
export {
  AppShellSearchCommand,
  AppShellSearchDialog,
} from "./shadcn-studio/blocks/app-shell-search-dialog";
export type {
  AppShellSearchDialogGovernedComponents,
} from "./shadcn-studio/blocks/app-shell-search-dialog";
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
export type { AppShellSidebarUserDropdownProps } from "./shadcn-studio/blocks/app-shell-sidebar-user-dropdown";
export {
  AppShellSidebarUserDropdown,
} from "./shadcn-studio/blocks/app-shell-sidebar-user-dropdown";
export type {
  AppShellSidebarUserDropdownGovernedComponents,
} from "./shadcn-studio/blocks/app-shell-sidebar-user-dropdown";
export {
  DEFAULT_APP_SHELL_SIDEBAR_USER_AVATAR_SRC,
  DEFAULT_APP_SHELL_SIDEBAR_USER_DISPLAY_NAME,
  DEFAULT_APP_SHELL_SIDEBAR_USER_FALLBACK,
  DEFAULT_APP_SHELL_SIDEBAR_USER_MENU_LABEL,
  DEFAULT_APP_SHELL_SIDEBAR_USER_ROLE_LABEL,
  defaultAppShellSidebarUserLogoutAction,
  defaultAppShellSidebarUserMenuItems,
} from "./shadcn-studio/data/app-shell.sidebar-user.data";
