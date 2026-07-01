/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-primitive-stories.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";

import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "./empty.js";

const meta = {
  component: Empty,
  tags: ["autodocs", "colocated"],
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No records</EmptyTitle>
        <EmptyDescription>Auto-generated empty state scaffold.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};
