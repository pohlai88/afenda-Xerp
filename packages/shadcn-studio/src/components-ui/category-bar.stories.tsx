/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-primitive-stories.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";

import { CategoryBar } from "./category-bar.js";

const meta = {
  component: CategoryBar,
  tags: ["autodocs", "colocated"],
} satisfies Meta<typeof CategoryBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { values: [40, 35, 25] },
};
