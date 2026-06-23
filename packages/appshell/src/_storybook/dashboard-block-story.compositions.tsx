import React from "react";
import type { ComponentType, ReactNode } from "react";
import { densityToAttribute } from "@afenda/ui/governance";

import { AppShellDashboardInvoiceTable } from "../shadcn-studio/blocks/app-shell-dashboard-invoice-table";
import { AppShellDashboardRegionalSales } from "../shadcn-studio/blocks/app-shell-dashboard-regional-sales";

/** Pads a single dashboard block the same way the shell main region does in Storybook. */
export function DashboardBlockStoryCanvas({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <div
      className="app-shell-root"
      data-afenda-density={densityToAttribute("standard")}
    >
      <div className="app-shell-content">{children}</div>
    </div>
  );
}

export function renderDashboardBlockStory<P extends object>(
  Block: ComponentType<P>,
  props: P
) {
  return <Block {...props} />;
}

export function compactDensityDecorator(Story: ComponentType) {
  return (
    <div
      className="contents"
      data-afenda-density={densityToAttribute("compact")}
    >
      <Story />
    </div>
  );
}

export function renderEmptyInvoicesBlockStory() {
  return (
    <DashboardBlockStoryCanvas>
      {renderDashboardBlockStory(AppShellDashboardInvoiceTable, { rows: [] })}
    </DashboardBlockStoryCanvas>
  );
}

export function renderEmptyRegionalSalesBlockStory() {
  return (
    <DashboardBlockStoryCanvas>
      {renderDashboardBlockStory(AppShellDashboardRegionalSales, { rows: [] })}
    </DashboardBlockStoryCanvas>
  );
}
