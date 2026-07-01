/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-primitive-stories.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";

import { NumberTicker } from "./number-ticker.js";

const meta = {
  component: NumberTicker,
  tags: ["autodocs", "colocated"],
} satisfies Meta<typeof NumberTicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 1284 },
};
