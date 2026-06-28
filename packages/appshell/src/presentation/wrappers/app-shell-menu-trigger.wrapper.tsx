"use client";

import { Button, useSidebar } from "@afenda/ui";
import {
  type GovernedUiComponentName,
  mapStockButtonVisualToGoverned,
  type StockButtonVisual,
} from "@afenda/ui/governance";
import { PanelLeftCloseIcon, PanelRightCloseIcon } from "lucide-react";

import { createPresentationMcpWrapper } from "./create-presentation-mcp-wrapper";

const DEFAULT_EXPAND_LABEL = "Expand sidebar";
const DEFAULT_COLLAPSE_LABEL = "Collapse sidebar";

export type AppShellMenuTriggerGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button"
>;

export interface AppShellMenuTriggerProps {
  /** Layout class on the plain HTML wrapper around the trigger button. */
  readonly className?: string;
  readonly collapseLabel?: string;
  readonly expandLabel?: string;
  /** Overrides dynamic expand/collapse labels when set. */
  readonly toggleLabel?: string;
  readonly variant?: StockButtonVisual;
}

function joinClassNames(...values: readonly (string | undefined)[]): string {
  return values
    .filter((value) => value !== undefined && value.length > 0)
    .join(" ");
}

function GovernedAppShellMenuTrigger({
  className,
  variant = "ghost",
  toggleLabel,
  expandLabel = DEFAULT_EXPAND_LABEL,
  collapseLabel = DEFAULT_COLLAPSE_LABEL,
}: AppShellMenuTriggerProps) {
  const { open, isMobile, openMobile, toggleSidebar } = useSidebar();
  const isOpen = isMobile ? openMobile : open;
  const accessibleLabel = toggleLabel ?? (isOpen ? collapseLabel : expandLabel);

  const button = (
    <Button
      {...mapStockButtonVisualToGoverned(variant, "lg")}
      aria-expanded={isOpen}
      data-sidebar="trigger"
      onClick={toggleSidebar}
      presentation="icon"
      size="lg"
      type="button"
    >
      {isOpen ? (
        <PanelLeftCloseIcon
          aria-hidden
          className="app-shell-menu-trigger-icon"
        />
      ) : (
        <PanelRightCloseIcon
          aria-hidden
          className="app-shell-menu-trigger-icon"
        />
      )}
      <span className="sr-only">{accessibleLabel}</span>
    </Button>
  );

  if (className === undefined) {
    return button;
  }

  return <div className={joinClassNames(className)}>{button}</div>;
}

export const AppShellMenuTrigger = createPresentationMcpWrapper({
  status: "governed-compose",
  GovernedComponent: GovernedAppShellMenuTrigger,
});
