import type { ReactNode } from "react";

import { ApplicationShell } from "../app-shell";
import {
  ApplicationShellDashboardCanvas,
  ApplicationShellDashboardDemo,
} from "../dashboard";
import {
  ApplicationShellDashboardContent,
  type ApplicationShellDashboardProps,
} from "../app-shell-dashboard";
import type { ApplicationShellProps } from "../app-shell.types";
import type { ApplicationShellDashboardCanvasProps } from "../dashboard/app-shell-dashboard-canvas.client";

/** Pads dashboard content the same way the shell main region does in Storybook. */
export function DashboardStoryCanvas({ children }: { readonly children: ReactNode }) {
  return <div className="app-shell-content">{children}</div>;
}

export function renderDashboardStory(args: ApplicationShellDashboardProps = {}) {
  return (
    <DashboardStoryCanvas>
      <ApplicationShellDashboardContent {...args} />
    </DashboardStoryCanvas>
  );
}

export function renderDashboardInShellStory(
  shellArgs: ApplicationShellProps,
  dashboardArgs: ApplicationShellDashboardProps
) {
  return (
    <ApplicationShell {...shellArgs}>
      <ApplicationShellDashboardContent {...dashboardArgs} />
    </ApplicationShell>
  );
}

export function renderDashboardDemoInShellStory(shellArgs: ApplicationShellProps) {
  return (
    <ApplicationShell {...shellArgs}>
      <ApplicationShellDashboardDemo />
    </ApplicationShell>
  );
}

export function renderDashboardCanvasInShellStory(
  shellArgs: ApplicationShellProps,
  canvasArgs: Pick<
    ApplicationShellDashboardCanvasProps,
    "editMode" | "showReadonlyPreviewLabel"
  >
) {
  return (
    <ApplicationShell {...shellArgs}>
      <ApplicationShellDashboardCanvas {...canvasArgs} />
    </ApplicationShell>
  );
}
