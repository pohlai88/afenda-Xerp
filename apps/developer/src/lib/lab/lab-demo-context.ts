import type { LabDemoContext } from "./contracts";

/** Static demo fixture — consume via resolveLabShellOperatingContext only. */
export const labDemoContextFixture = {
  legalEntityLabel: "Afenda Operator Preview",
  tenantLabel: "Route Lab Sandbox",
  workspaceLabel: "Presentation Review Workspace",
} satisfies LabDemoContext;

export const labDemoContext = labDemoContextFixture;
