/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-primitive-stories.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";

import { SidebarDefaultSample } from "../storybook/primitive-story.compositions.js";

const meta = {
  component: SidebarDefaultSample,
  tags: ["autodocs", "colocated"],
  parameters: {
    docs: {
      description: {
        component:
          "Composition-backed primitive story — fixture in storybook/primitive-story.compositions.tsx.",
      },
    },
  },
} satisfies Meta<typeof SidebarDefaultSample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <SidebarDefaultSample />,
};
