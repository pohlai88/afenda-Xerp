import type { MetadataLayoutProps } from "../contracts/layout-renderer.contract.js";
import { MetadataLayout } from "./metadata-layout.js";

export { MetadataLayout } from "./metadata-layout.js";

export function DashboardLayout(props: Omit<MetadataLayoutProps, "type">) {
  return <MetadataLayout {...props} type="dashboard" />;
}

export function GridLayout(props: Omit<MetadataLayoutProps, "type">) {
  return <MetadataLayout {...props} type="grid" />;
}

export function PanelLayout(props: Omit<MetadataLayoutProps, "type">) {
  return <MetadataLayout {...props} type="panel" />;
}

export function StackLayout(props: Omit<MetadataLayoutProps, "type">) {
  return <MetadataLayout {...props} type="stack" />;
}
