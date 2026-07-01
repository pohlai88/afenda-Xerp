/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-primitive-stories.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";

import { Avatar, AvatarFallback } from "./avatar.js";

const meta = {
  component: Avatar,
  tags: ["autodocs", "colocated"],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>AF</AvatarFallback>
    </Avatar>
  ),
};
