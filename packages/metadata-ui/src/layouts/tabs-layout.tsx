"use client";

import type { MetadataLayoutProps } from "../contracts/layout-renderer.contract.js";
import { MetadataLayout } from "./metadata-layout.js";

export function TabsLayout(props: Omit<MetadataLayoutProps, "type">) {
  return <MetadataLayout {...props} type="tabs" />;
}

export function WizardLayout(props: Omit<MetadataLayoutProps, "type">) {
  return <MetadataLayout {...props} type="wizard" />;
}
