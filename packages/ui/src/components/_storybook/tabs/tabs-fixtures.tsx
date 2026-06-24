import type { ReactNode } from "react";

export interface StorybookAnimatedTabsItem {
  readonly content: ReactNode;
  readonly label: string;
  readonly value: string;
}

export const ANIMATED_TABS_ITEMS: readonly StorybookAnimatedTabsItem[] = [
  {
    label: "Operations",
    value: "operations",
    content: (
      <>
        Monitor{" "}
        <span className="afenda-storybook-tabs__emphasis">
          operating context
        </span>
        , tenant scope, and legal entity switches across your workspace.
      </>
    ),
  },
  {
    label: "Governance",
    value: "governance",
    content: (
      <>
        Review{" "}
        <span className="afenda-storybook-tabs__emphasis">role grants</span>,
        membership changes, and audit events before they reach production.
      </>
    ),
  },
  {
    label: "Release",
    value: "release",
    content: (
      <>
        <span className="afenda-storybook-tabs__emphasis">Foundation</span>{" "}
        delivery notes, TIP status, and runtime truth matrix updates for this
        sprint.
      </>
    ),
  },
] as const;

export const ANIMATED_TABS_DEFAULT_VALUE =
  ANIMATED_TABS_ITEMS[0]?.value ?? "operations";

export interface StorybookLineTabsItem {
  readonly content: string;
  readonly label: string;
  readonly value: string;
}

/** Static line tabs (tabs-11) — simple copy for pseudo-element underline demo. */
export const LINE_TABS_ITEMS: readonly StorybookLineTabsItem[] = [
  {
    label: "Explore",
    value: "explore",
    content:
      "Discover fresh ideas, trending topics, and curated foundation notes.",
  },
  {
    label: "Favorites",
    value: "favorites",
    content:
      "Your saved content, pinned TIPs, and recently opened delivery docs.",
  },
  {
    label: "Release",
    value: "release",
    content:
      "Sprint release notes, runtime truth matrix updates, and gate evidence.",
  },
] as const;

export const LINE_TABS_DEFAULT_VALUE = LINE_TABS_ITEMS[0]?.value ?? "explore";
