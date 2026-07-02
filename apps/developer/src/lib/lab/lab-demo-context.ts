import type { AppShellOperatingContextWire } from "@afenda/shadcn-studio";

export const LAB_DEMO_BANNER =
  "Developer Route Lab — demo fixtures only · not authenticated · not production";

export const labDemoOperatingContext = {
  tenantLabel: "Demo Tenant",
  workspaceLabel: "Route Lab Workspace",
  legalEntityLabel: "Afenda Developer Sandbox",
} as const satisfies AppShellOperatingContextWire;
