/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-primitive-stories.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";

import { ChartContainer } from "./chart.js";

const meta = {
  tags: ["autodocs", "colocated"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ChartContainer config={{ desktop: { label: "Desktop", color: "var(--primary)" } }} className="h-48 w-full max-w-sm">
      <p className="text-muted-foreground text-sm">Chart container shell — add Recharts children in curated stories.</p>
    </ChartContainer>
  ),
};
