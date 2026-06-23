import type { LayoutType } from "@afenda/metadata";

import type { MetadataSpecificLayoutProps } from "../contracts/layout.contract.js";
import { MetadataLayout } from "./metadata-layout.js";

export type {
  MetadataLayoutProps,
  MetadataSpecificLayoutProps,
} from "../contracts/layout.contract.js";
export { MetadataLayout } from "./metadata-layout.js";

const DASHBOARD_LAYOUT_TYPE = "dashboard" satisfies LayoutType;
const GRID_LAYOUT_TYPE = "grid" satisfies LayoutType;
const PANEL_LAYOUT_TYPE = "panel" satisfies LayoutType;
const STACK_LAYOUT_TYPE = "stack" satisfies LayoutType;
const TABS_LAYOUT_TYPE = "tabs" satisfies LayoutType;
const WIZARD_LAYOUT_TYPE = "wizard" satisfies LayoutType;

export function DashboardLayout(props: MetadataSpecificLayoutProps) {
  return <MetadataLayout {...props} type={DASHBOARD_LAYOUT_TYPE} />;
}

export function GridLayout(props: MetadataSpecificLayoutProps) {
  return <MetadataLayout {...props} type={GRID_LAYOUT_TYPE} />;
}

export function PanelLayout(props: MetadataSpecificLayoutProps) {
  return <MetadataLayout {...props} type={PANEL_LAYOUT_TYPE} />;
}

export function StackLayout(props: MetadataSpecificLayoutProps) {
  return <MetadataLayout {...props} type={STACK_LAYOUT_TYPE} />;
}

export function TabsLayout(props: MetadataSpecificLayoutProps) {
  return <MetadataLayout {...props} type={TABS_LAYOUT_TYPE} />;
}

export function WizardLayout(props: MetadataSpecificLayoutProps) {
  return <MetadataLayout {...props} type={WIZARD_LAYOUT_TYPE} />;
}
