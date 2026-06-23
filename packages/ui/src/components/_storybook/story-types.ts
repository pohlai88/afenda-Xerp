import type {
  Density,
  GovernedPanelRadius,
  GovernedPanelShadow,
  GovernedSize,
  GovernedState,
  GovernedToggleSize,
  GovernedToggleVariant,
} from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";

/** Controls used by governance playground stories (not always on the CSF `component`). */
export interface GovernanceDemoArgs {
  readonly collapsible?: string;
  readonly defaultOpen?: boolean;
  readonly density?: string;
  readonly height?: string;
  readonly orientation?: string;
  readonly radius?: string;
  readonly shadow?: string;
  readonly side?: string;
  readonly size?: string;
  readonly spacing?: number;
  readonly state?: string;
  readonly variant?: string;
  readonly width?: string;
}

/**
 * CSF story type for composition demos where `render` owns required component props.
 * Storybook 10 otherwise requires `args` when `Meta` is bound to a component with
 * required fields (e.g. `children`, `table`).
 */
export type RenderStory<TMeta extends Meta> = Omit<
  StoryObj<TMeta>,
  "args" | "argTypes" | "render"
> & {
  args?: StoryObj<TMeta>["args"] | GovernanceDemoArgs;
  argTypes?: Record<string, unknown>;
  render?: (args: GovernanceDemoArgs) => ReactNode;
};

export function governedTableStoryProps(args: GovernanceDemoArgs) {
  return {
    density: args.density as Density | undefined,
    size: args.size as GovernedSize | undefined,
    state: args.state as GovernedState | undefined,
  };
}

export function governedPanelStoryProps(args: GovernanceDemoArgs) {
  return {
    density: args.density as Density | undefined,
    radius: args.radius as GovernedPanelRadius | undefined,
    shadow: args.shadow as GovernedPanelShadow | undefined,
    state: args.state as GovernedState | undefined,
  };
}

export function sheetStoryProps(args: GovernanceDemoArgs) {
  return {
    ...governedPanelStoryProps(args),
    side: args.side as "top" | "right" | "bottom" | "left" | undefined,
  };
}

export function governedInputStoryProps(args: GovernanceDemoArgs) {
  return {
    density: args.density as Density | undefined,
    size: args.size as GovernedSize | undefined,
    state: args.state as GovernedState | undefined,
  };
}

export function tabsStoryProps(args: GovernanceDemoArgs) {
  return {
    orientation: args.orientation as "horizontal" | "vertical" | undefined,
    state: args.state as GovernedState | undefined,
  };
}

export function toggleGroupStoryProps(args: GovernanceDemoArgs) {
  return {
    orientation: args.orientation as "horizontal" | "vertical" | undefined,
    size: args.size as GovernedToggleSize | undefined,
    spacing: args.spacing,
    state: args.state as GovernedState | undefined,
    type: "single" as const,
    variant: args.variant as GovernedToggleVariant | undefined,
  };
}

export function sidebarChromeStoryProps(args: GovernanceDemoArgs) {
  return {
    collapsible: args.collapsible as "offcanvas" | "icon" | "none" | undefined,
    defaultOpen: args.defaultOpen,
    side: args.side as "left" | "right" | undefined,
    variant: args.variant as "sidebar" | "floating" | "inset" | undefined,
  };
}

export function tooltipStoryProps(args: GovernanceDemoArgs) {
  return {
    side: args.side as "top" | "right" | "bottom" | "left" | undefined,
    state: args.state as GovernedState | undefined,
  };
}

export function governedStateOnly(args: GovernanceDemoArgs) {
  return {
    state: args.state as GovernedState | undefined,
  };
}
