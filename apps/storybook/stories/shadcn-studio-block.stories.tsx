import type { Meta, StoryObj } from "@storybook/react";

import {
  PlaceholderHeroBlock,
  shadcnStudioBlockDocs,
  shadcnStudioCenteredLayout,
  shadcnStudioDarkThemeGlobals,
  shadcnStudioStoryA11y,
} from "@afenda/shadcn-studio";
import { shadcnStudioThemeDecorator } from "./_storybook/shadcn-studio-decorators";

const meta = {
  title: "Shadcn Studio/Blocks",
  component: PlaceholderHeroBlock,
  tags: ["autodocs"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component: shadcnStudioBlockDocs.component,
      },
    },
    a11y: shadcnStudioStoryA11y,
  },
  decorators: [shadcnStudioThemeDecorator],
  args: {
    title: "Studio presentation seed",
    description:
      "B40 MCP inventory placeholder — replace via /cui when MCP is available.",
    actionLabel: "Explore presets",
  },
} satisfies Meta<typeof PlaceholderHeroBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlaceholderHero: Story = {};

export const PlaceholderHeroDark: Story = {
  globals: shadcnStudioDarkThemeGlobals,
};

export const PlaceholderHeroCustomCopy: Story = {
  args: {
    title: "Lab verification block",
    description: "PAS-005A B41 — Storybook renders MCP placeholder-hero block.",
    actionLabel: "Open theme lab",
  },
};
