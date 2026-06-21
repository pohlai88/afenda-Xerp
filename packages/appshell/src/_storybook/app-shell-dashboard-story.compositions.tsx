import type { ReactNode } from "react";

import { ApplicationShell } from "../app-shell";
import {
  ApplicationShellDashboardContent,
  type ApplicationShellDashboardProps,
} from "../app-shell-dashboard";
import type { ApplicationShellProps } from "../app-shell.types";

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
