"use client";
export { IconMark, type IconMarkProps } from "./components/assets/icon-mark";
export { AppShell01 } from "./components/layout/appshell-01";
export {
  AppShellFrame,
  appShellFrameClassName,
} from "./components/layout/appshell-frame";
export {
  Sidebar,
  sidebarClassName,
} from "./components/layout/sidebar";
export {
  Topbar,
  topbarClassName,
} from "./components/layout/topbar";
export {
  Alert,
  AlertDescription,
  type AlertProps,
  AlertTitle,
  type AlertVariant,
  alertClassName,
} from "./components/ui/alert";
export {
  Badge,
  type BadgeProps,
  type BadgeVariant,
  badgeClassName,
} from "./components/ui/badge";
export {
  Button,
  type ButtonProps,
  type ButtonSize,
  type ButtonVariant,
  buttonClassName,
} from "./components/ui/button";
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  type CardProps,
  CardTitle,
  type CardVariant,
  cardClassName,
} from "./components/ui/card";
export {
  Field,
  FieldControl,
  FieldDescription,
  FieldLabel,
  type FieldLabelProps,
  FieldMessage,
  type FieldMessageProps,
  type FieldOrientation,
  type FieldProps,
  type FieldState,
  fieldClassName,
} from "./components/ui/field";
export {
  Input,
  type InputProps,
  inputClassName,
} from "./components/ui/input";
export { Label, type LabelProps, labelClassName } from "./components/ui/label";
export {
  ScrollArea,
  type ScrollAreaProps,
  ScrollAreaViewport,
  type ScrollAreaViewportProps,
  ScrollBar,
  scrollAreaClassName,
} from "./components/ui/scroll-area";
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  type TableContainerProps,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  tableContainerClassName,
} from "./components/ui/table";
export {
  Tabs,
  TabsContent,
  TabsList,
  type TabsListProps,
  type TabsProps,
  TabsTrigger,
  type TabsTriggerProps,
  tabsContentClassName,
  tabsListClassName,
  tabsTriggerClassName,
} from "./components/ui/tabs";
export { studioPackageConfig } from "./configs/studio-config";
export { CANONICAL_THEME_TOKEN_NAMES } from "./configs/theme-config";
export {
  type StudioContextValue,
  StudioPresentationProviders,
  type StudioPresentationProvidersProps,
  StudioProvider,
  type StudioProviderProps,
  type StudioResolvedThemeMode,
  type StudioThemeConfig,
  type StudioThemeId,
  type StudioThemeMode,
  type StudioThemeOption,
  type StudioThemeState,
  type StudioThemeTokenMap,
  type StudioThemeTokenModeMap,
  type StudioThemeTokenName,
  type StudioThemeUpdate,
  studioThemeConfig,
  ThemeCustomizer,
  type ThemeCustomizerProps,
  ThemeProvider,
  type ThemeProviderProps,
  ThemeScript,
  type ThemeScriptProps,
  ThemeToggle,
  type ThemeToggleProps,
  useStudio,
  useTheme,
} from "./contexts/theme-boundary";
export type {
  AppShellNavGroupWire,
  AppShellNavItemWire,
  AppShellOperatingContextWire,
} from "./types/app-shell";
export {
  APP_SHELL_01_SLOTS,
  APP_SHELL_FRAME_SLOTS,
  type AppShell01MainProps,
  type AppShell01Props,
  type AppShell01Slot,
  type AppShell01SlotName,
  type AppShell01SlotValue,
  type AppShellFrameClassNameOptions,
  type AppShellFrameDensity,
  type AppShellFrameDensityClassMap,
  type AppShellFrameProps,
  type AppShellFrameSlot,
  type AppShellFrameSlotName,
  type AppShellFrameSlotValue,
  type AppShellFrameStructure,
  type AppShellFrameStructureClassMap,
  SIDEBAR_SLOTS,
  type SidebarProps,
  type SidebarSlot,
  type SidebarSlotName,
  type SidebarSlotValue,
  type SidebarVariant,
  TOPBAR_SLOTS,
  type TopbarProps,
  type TopbarSlot,
  type TopbarSlotName,
  type TopbarSlotValue,
  type TopbarVariant,
} from "./types/layout";
export type {
  StudioPackageConfig,
  StudioRuntimeState,
} from "./types/studio";
export {
  CONFIRM_DIALOG_SURFACE_SLOTS,
  type ConfirmDialogSurfaceIntent,
  type ConfirmDialogSurfaceProps,
  type ConfirmDialogSurfaceSlot,
  type ConfirmDialogSurfaceSlotName,
  type ConfirmDialogSurfaceSlotValue,
  DATA_TABLE_SURFACE_SLOTS,
  type DataTableSurfaceColumn,
  type DataTableSurfaceColumnAlign,
  type DataTableSurfaceProps,
  type DataTableSurfaceRow,
  type DataTableSurfaceSlot,
  type DataTableSurfaceSlotName,
  type DataTableSurfaceSlotValue,
  EVIDENCE_WIDGET_SLOTS,
  type EvidenceWidgetAdapterProps,
  type EvidenceWidgetItem,
  type EvidenceWidgetItemStatus,
  type EvidenceWidgetNonReadyProps,
  type EvidenceWidgetReadyProps,
  type EvidenceWidgetSlot,
  type EvidenceWidgetSlotName,
  type EvidenceWidgetSlotValue,
  type EvidenceWidgetSummary,
  FORM_SURFACE_SLOTS,
  type FormSurfaceField,
  type FormSurfaceProps,
  type FormSurfaceSlot,
  type FormSurfaceSlotName,
  type FormSurfaceSlotValue,
  METRIC_WIDGET_SLOTS,
  type MetricWidgetAdapterProps,
  type MetricWidgetNonReadyProps,
  type MetricWidgetReadyProps,
  type MetricWidgetSlot,
  type MetricWidgetSlotName,
  type MetricWidgetSlotValue,
  type MetricWidgetValue,
  type NonReadyViewSurfaceState,
  PAGE_SURFACE_SLOTS,
  type PageSurfaceSidebarProps,
  type PageSurfaceSlot,
  type PageSurfaceSlotName,
  type PageSurfaceSlotValue,
  type PageSurfaceTopbarProps,
  SETTINGS_SURFACE_SLOTS,
  type SettingsSurfaceItem,
  type SettingsSurfaceProps,
  type SettingsSurfaceSection,
  type SettingsSurfaceSlot,
  type SettingsSurfaceSlotName,
  type SettingsSurfaceSlotValue,
  type ViewStateMessage,
  type ViewStateMessages,
  type ViewStateProps,
  type ViewSurfaceState,
  type WorkspaceBoardUseCase,
  type WorkspaceBoardVisibilityRule,
  type WorkspaceBoardWidgetAdapterProps,
  type WorkspaceBoardWidgetCategory,
  type WorkspaceBoardWidgetInstance,
  type WorkspaceBoardWidgetLayout,
  type WorkspaceBoardWidgetManifest,
  type WorkspaceBoardWidgetSize,
} from "./types/views";
export {
  AUTH_SHELL_SLOTS,
  AuthShell,
  type AuthShellProps,
  type AuthShellSlot,
  type AuthShellSlotName,
  type AuthShellSlotValue,
  type AuthShellState,
  type AuthShellStateMessages,
  authShellClassName,
  type NonReadyAuthShellState,
} from "./views/auth/auth-shell";
export {
  AUTH_SHELL_ERP_BLOCK_IDS,
  type AuthShellBlockPreset,
  type AuthShellErpBlockId,
  resolveAuthShellBlockPreset,
  resolveAuthShellBlockPresetOrSignIn,
} from "./views/auth/auth-shell-block-map";
export {
  AUTH_SHELL_CANONICAL_VARIANT_IDS,
  AUTH_SHELL_VARIANT_PRESETS,
  type AuthShellVariantPreset,
  type AuthShellVariantPresetId,
  getAuthShellVariantPreset,
} from "./views/auth/auth-shell-variants";
export {
  DataTableSurface,
  dataTableSurfaceClassName,
} from "./views/datatables/data-table-surface";
export {
  ConfirmDialogSurface,
  confirmDialogSurfaceClassName,
} from "./views/dialogs/confirm-dialog-surface";
export {
  FormSurface,
  formSurfaceClassName,
} from "./views/forms/form-surface";
export {
  PageSurface,
  type PageSurfaceProps,
  pageSurfaceClassName,
} from "./views/pages/page-surface";
export {
  SettingsSurface,
  settingsSurfaceClassName,
} from "./views/settings/settings-surface";
export { workspaceBoardWidgetAdapterClassName } from "./views/widgets/widget-board-adapter";
export {
  EvidenceWidget,
  type EvidenceWidgetProps,
  evidenceWidgetSummaryClassName,
} from "./views/widgets/widget-evidence";
export {
  MetricWidget,
  type MetricWidgetProps,
  type MetricWidgetTone,
  metricWidgetValueClassName,
} from "./views/widgets/widget-metric";
