import type { ComponentProps, ComponentType } from "react";
import type { Decorator } from "@storybook/react";

import { DashboardBlockStoryCanvas } from "./dashboard-block-story.compositions";

export const dashboardBlockStoryParameters = {
  layout: "padded" as const,
  docs: {
    description: {
      component:
        "Governed dashboard block from `@afenda/appshell`. Layout chrome in `afenda-appshell.css`; `@afenda/ui` primitives without consumer `className` (TIP-004).",
    },
  },
  a11y: {
    config: {
      rules: [{ id: "color-contrast", enabled: true }],
    },
  },
};

export function dashboardBlockStoryDecorators(): Decorator[] {
  return [
    (Story) => (
      <DashboardBlockStoryCanvas>
        <Story />
      </DashboardBlockStoryCanvas>
    ),
  ];
}

export const dashboardBlockDarkThemeGlobals = {
  theme: "dark",
} as const;

export function createDashboardBlockMeta<C extends ComponentType<any>>(config: {
  title: string;
  component: C;
  args?: Partial<NonNullable<ComponentProps<C>>>;
}): {
  title: string;
  component: C;
  tags: string[];
  parameters: typeof dashboardBlockStoryParameters;
  decorators: Decorator[];
  args?: Partial<NonNullable<ComponentProps<C>>>;
} {
  return {
    title: config.title,
    component: config.component,
    tags: ["autodocs"],
    parameters: dashboardBlockStoryParameters,
    decorators: dashboardBlockStoryDecorators(),
    ...(config.args === undefined ? {} : { args: config.args }),
  };
}
