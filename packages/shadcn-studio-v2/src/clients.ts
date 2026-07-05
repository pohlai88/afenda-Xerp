// biome-ignore lint/performance/noBarrelFile: V2 clients.ts is the explicit client boundary surface.
export { IconMark, type IconMarkProps } from "./components/assets/IconMark";
export {
  AppShell,
  type AppShellDensity,
  type AppShellProps,
  appShellClassName,
} from "./components/layout/AppShell";
export {
  Sidebar,
  type SidebarProps,
  type SidebarVariant,
  sidebarClassName,
} from "./components/layout/Sidebar";
export {
  Topbar,
  type TopbarProps,
  type TopbarVariant,
  topbarClassName,
} from "./components/layout/Topbar";
export {
  ThemeToggle,
  type ThemeToggleProps,
} from "./components/shared/ThemeToggle";
export {
  Alert,
  AlertDescription,
  type AlertProps,
  AlertTitle,
  type AlertVariant,
  alertClassName,
} from "./components/ui/Alert";
export {
  Badge,
  type BadgeProps,
  type BadgeVariant,
  badgeClassName,
} from "./components/ui/Badge";
export {
  Button,
  type ButtonProps,
  type ButtonSize,
  type ButtonVariant,
  buttonClassName,
} from "./components/ui/Button";
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
} from "./components/ui/Card";
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
} from "./components/ui/Field";
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
} from "./components/ui/Table";
export { studioPackageConfig } from "./configs/studio-config";
export { studioThemeConfig } from "./configs/theme-config";
export {
  ThemeProvider,
  type ThemeProviderProps,
} from "./contexts/ThemeProvider";
export { useTheme } from "./hooks/use-theme";
export type { StudioPackageConfig } from "./types/studio";
export type {
  StudioResolvedThemeMode,
  StudioThemeConfig,
  StudioThemeId,
  StudioThemeMode,
  StudioThemeOption,
  StudioThemeState,
  StudioThemeUpdate,
} from "./types/theme";
export {
  AuthShell,
  type AuthShellProps,
  authShellClassName,
} from "./views/auth/AuthShell";
export {
  PageSurface,
  type PageSurfaceProps,
  pageSurfaceClassName,
} from "./views/pages/PageSurface";
export {
  MetricWidget,
  type MetricWidgetProps,
  type MetricWidgetTone,
  metricWidgetValueClassName,
} from "./views/widgets/MetricWidget";
