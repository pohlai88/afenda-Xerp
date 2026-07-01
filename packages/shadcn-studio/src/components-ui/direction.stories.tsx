/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-primitive-stories.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";

import { DirectionProvider } from "./direction.js";

const meta = {
  component: DirectionProvider,
  tags: ["autodocs", "colocated"],
} satisfies Meta<typeof DirectionProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { direction: "ltr", children: "LTR content" },
};
