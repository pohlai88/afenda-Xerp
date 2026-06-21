import { Badge, Button } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import { ApplicationShell } from "../app-shell";
import { AppShellMain } from "../app-shell-main";
import type { ApplicationShellProps } from "../app-shell.types";

export type AppShellStoryCompositionsGovernedComponents = Extract<
  GovernedUiComponentName,
  "Badge" | "Button"
>;

export const storySignOutAccessory = (
  <Button emphasis="ghost" intent="secondary" size="sm">
    Sign out
  </Button>
);

export function renderInventoryWorkspaceStory(args: ApplicationShellProps) {
  return (
    <ApplicationShell {...args}>
      <AppShellMain
        actions={
          <Button emphasis="solid" intent="primary" size="sm">
            New transfer
          </Button>
        }
        badge={
          <Badge emphasis="soft" tone="info">
            Live
          </Badge>
        }
        description="Real-time inventory across warehouses and distribution centres."
        title="Stock overview"
      >
        <p className="rounded-md border border-border-subtle bg-surface-panel p-4 text-foreground-muted text-sm">
          Module workspace — replace with inventory routes and data tables in
          `apps/erp`. Layout classes stay on plain HTML; governed primitives
          receive props only.
        </p>
      </AppShellMain>
    </ApplicationShell>
  );
}
