import type { ReactNode } from "react";

import { ApplicationShell } from "../app-shell";
import {
  ApplicationShellDashboardCanvas,
  ApplicationShellDashboardDemo,
  type ApplicationShellDashboardDemoProps,
} from "../dashboard";
import type { ApplicationShellProps } from "../app-shell.types";
import type { ApplicationShellDashboardCanvasProps } from "../dashboard/app-shell-dashboard-canvas.client";
import {
  renderEmptyInvoicesBlockStory,
  renderEmptyRegionalSalesBlockStory,
} from "./dashboard-block-story.compositions";

/** Pads dashboard content the same way the shell main region does in Storybook. */
export function DashboardStoryCanvas({
  children,
}: {
  readonly children: ReactNode;
}) {
  return <div className="app-shell-content">{children}</div>;
}

export { renderEmptyInvoicesBlockStory, renderEmptyRegionalSalesBlockStory };

export function renderDashboardStory(
  args: ApplicationShellDashboardDemoProps = {}
) {
  return (
    <DashboardStoryCanvas>
      <ApplicationShellDashboardDemo {...args} />
    </DashboardStoryCanvas>
  );
}

export function renderDashboardInShellStory(
  shellArgs: ApplicationShellProps,
  dashboardArgs: ApplicationShellDashboardDemoProps
) {
  return (
    <ApplicationShell {...shellArgs}>
      <ApplicationShellDashboardDemo {...dashboardArgs} />
    </ApplicationShell>
  );
}

export function renderDashboardDemoInShellStory(
  shellArgs: ApplicationShellProps
) {
  return (
    <ApplicationShell {...shellArgs}>
      <ApplicationShellDashboardDemo />
    </ApplicationShell>
  );
}

export function renderDashboardCanvasInShellStory(
  shellArgs: ApplicationShellProps,
  canvasArgs: ApplicationShellDashboardCanvasProps = { editMode: false }
) {
  return (
    <ApplicationShell {...shellArgs}>
      <ApplicationShellDashboardCanvas {...canvasArgs} />
    </ApplicationShell>
  );
}

export function renderDashboardCanvasStory(
  canvasArgs: ApplicationShellDashboardCanvasProps = { editMode: false }
) {
  return (
    <DashboardStoryCanvas>
      <ApplicationShellDashboardCanvas {...canvasArgs} />
    </DashboardStoryCanvas>
  );
}
