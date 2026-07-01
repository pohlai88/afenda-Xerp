/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-primitive-stories.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";

import { AspectRatio } from "./aspect-ratio.js";

const meta = {
  component: AspectRatio,
  tags: ["autodocs", "colocated"],
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <AspectRatio {...args}>
      <div className="flex h-full items-center justify-center text-sm">16:9</div>
    </AspectRatio>
  ),
  args: { ratio: 16 / 9, className: "w-48 overflow-hidden rounded-md bg-muted" },
};
