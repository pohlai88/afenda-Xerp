/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-block-auto-stories.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";

import AccountSettings01Block from "../components-layouts/account-settings-01/account-settings-01.js";
import HeroSection01Block from "../components-layouts/hero-section-01/hero-section-01.js";
import {
  shadcnStudioCenteredLayout,
  shadcnStudioPageBlockParameters,
  shadcnStudioStoryA11y,
} from "../lab/index.js";

const meta = {
  title: "Shadcn Studio/Blocks Auto",
  tags: ["autodocs"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component:
          "Auto-discovered self-contained MCP page blocks (folder entry files). Prop-driven flat components are listed in block-story-manifest.generated.json — add curated stories in shadcn-studio-blocks.stories.tsx.",
      },
    },
    a11y: shadcnStudioStoryA11y,
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AccountSettings01: Story = {
  render: () => <AccountSettings01Block />,
  parameters: {
    ...shadcnStudioPageBlockParameters,
  },
};

export const HeroSection01: Story = {
  render: () => <HeroSection01Block />,
};
