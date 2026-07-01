/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-primitive-stories.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";

import { Toggle } from "./toggle.js";

const meta = {
  component: Toggle,
  tags: ["autodocs", "colocated"],
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Toggle", type: "button", "aria-label": "Toggle" },
};
