/**
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate: pnpm storybook generate
 * Source: scripts/storybook/generate-primitive-stories.mjs
 */
import type { Meta, StoryObj } from "@storybook/react";

import { RadioGroup, RadioGroupItem } from "./radio-group.js";

const meta = {
  component: RadioGroup,
  tags: ["autodocs", "colocated"],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup className="flex flex-col gap-2" defaultValue="standard">
      <label className="flex items-center gap-2 text-sm">
        <RadioGroupItem aria-label="Standard shipping" value="standard" />
        Standard shipping
      </label>
      <label className="flex items-center gap-2 text-sm">
        <RadioGroupItem aria-label="Express shipping" value="express" />
        Express shipping
      </label>
    </RadioGroup>
  ),
};
