import type { ComponentProps, ReactNode } from "react";
import type {
  AppShellNavGroupWire,
  AppShellOperatingContextWire,
} from "./app-shell";

export type AppShellFrameDensity = "comfortable" | "compact";

export type AppShellFrameStructure = "sidebar" | "single";

export type AppShellFrameSlotName = "root";

export type AppShellFrameSlotValue = "appshell-frame";

export const APP_SHELL_FRAME_SLOTS = {
  root: "appshell-frame",
} as const satisfies Record<AppShellFrameSlotName, AppShellFrameSlotValue>;

export type AppShellFrameSlot =
  (typeof APP_SHELL_FRAME_SLOTS)[keyof typeof APP_SHELL_FRAME_SLOTS];

export interface AppShellFrameProps extends ComponentProps<"div"> {
  readonly density?: AppShellFrameDensity;
  readonly structure?: AppShellFrameStructure;
}

export type AppShellFrameClassNameOptions = Pick<
  AppShellFrameProps,
  "className" | "density" | "structure"
>;

export type AppShellFrameDensityClassMap = Readonly<
  Record<AppShellFrameDensity, string>
>;

export type AppShellFrameStructureClassMap = Readonly<
  Record<AppShellFrameStructure, string>
>;

export type AppShell01MainProps = Omit<ComponentProps<"main">, "children">;

export type AppShell01SlotName =
  | "brand"
  | "brandMark"
  | "brandText"
  | "content"
  | "footer"
  | "main";

export type AppShell01SlotValue = `appshell-01-${string}`;

export const APP_SHELL_01_SLOTS = {
  brand: "appshell-01-brand",
  brandMark: "appshell-01-brand-mark",
  brandText: "appshell-01-brand-text",
  content: "appshell-01-content",
  footer: "appshell-01-footer",
  main: "appshell-01-main",
} as const satisfies Record<AppShell01SlotName, AppShell01SlotValue>;

export type AppShell01Slot =
  (typeof APP_SHELL_01_SLOTS)[keyof typeof APP_SHELL_01_SLOTS];

export interface AppShell01Props {
  readonly brand?: ReactNode;
  readonly brandLabel?: string;
  readonly children: ReactNode;
  readonly frameDensity?: AppShellFrameDensity;
  readonly mainLabel?: string;
  readonly mainProps?: AppShell01MainProps;
  readonly navGroups: readonly AppShellNavGroupWire[];
  readonly navLabel?: string;
  readonly operatingContext: AppShellOperatingContextWire;
  readonly sidebarFooter?: ReactNode;
  readonly topbarActions?: ReactNode;
  readonly topbarContent?: ReactNode;
  readonly topbarControls?: ReactNode;
  readonly topbarDescription?: ReactNode;
  readonly topbarHeading?: ReactNode;
}

export type SidebarVariant = "default";

export type SidebarSlotName =
  | "footer"
  | "nav"
  | "navGroup"
  | "navGroupItems"
  | "navGroupLabel"
  | "navItem"
  | "navLink"
  | "root";

export type SidebarSlotValue = "sidebar" | `sidebar-${string}`;

export const SIDEBAR_SLOTS = {
  footer: "sidebar-footer",
  nav: "sidebar-nav",
  navGroup: "sidebar-nav-group",
  navGroupItems: "sidebar-nav-group-items",
  navGroupLabel: "sidebar-nav-group-label",
  navItem: "sidebar-nav-item",
  navLink: "sidebar-nav-link",
  root: "sidebar",
} as const satisfies Record<SidebarSlotName, SidebarSlotValue>;

export type SidebarSlot = (typeof SIDEBAR_SLOTS)[keyof typeof SIDEBAR_SLOTS];

export interface SidebarProps extends ComponentProps<"aside"> {
  readonly footer?: ReactNode;
  readonly groups?: readonly AppShellNavGroupWire[];
  readonly navLabel?: string;
  readonly variant?: SidebarVariant;
}

export type TopbarVariant = "default" | "transparent";

export type TopbarSlotName =
  | "actionArea"
  | "actions"
  | "content"
  | "controls"
  | "description"
  | "heading"
  | "headingArea"
  | "root";

export type TopbarSlotValue = "topbar" | `topbar-${string}`;

export const TOPBAR_SLOTS = {
  actionArea: "topbar-action-area",
  actions: "topbar-actions",
  content: "topbar-content",
  controls: "topbar-controls",
  description: "topbar-description",
  heading: "topbar-heading",
  headingArea: "topbar-heading-area",
  root: "topbar",
} as const satisfies Record<TopbarSlotName, TopbarSlotValue>;

export type TopbarSlot = (typeof TOPBAR_SLOTS)[keyof typeof TOPBAR_SLOTS];

type TopbarHeaderProps = Omit<ComponentProps<"header">, "children" | "content">;

export interface TopbarProps extends TopbarHeaderProps {
  readonly actions?: ReactNode;
  readonly content?: ReactNode;
  readonly controls?: ReactNode;
  readonly description?: ReactNode;
  readonly heading?: ReactNode;
  readonly variant?: TopbarVariant;
}
