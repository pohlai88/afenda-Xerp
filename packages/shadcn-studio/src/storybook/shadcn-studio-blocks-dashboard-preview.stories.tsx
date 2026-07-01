import type { Meta, StoryObj } from "@storybook/react";

import { DashboardBlocksPreviewSample } from "../storybook/block-flat-story.compositions.js";
import {
  shadcnStudioDarkThemeGlobals,
  shadcnStudioFullscreenLayout,
  shadcnStudioStoryA11y,
} from "../lab/index.js";

const meta = {
  title: "Shadcn Studio/Blocks Preview",
  tags: ["autodocs"],
  parameters: {
    ...shadcnStudioFullscreenLayout,
    docs: {
      description: {
        component:
          "Multi-block dashboard composition — validates theme tokens, spacing, and CSS chain when blocks are combined on one surface.",
      },
    },
    a11y: shadcnStudioStoryA11y,
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const DashboardTemplate: Story = {
  render: () => <DashboardBlocksPreviewSample />,
};

export const DashboardTemplateDark: Story = {
  globals: shadcnStudioDarkThemeGlobals,
  render: () => <DashboardBlocksPreviewSample />,
};
