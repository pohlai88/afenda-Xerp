import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import { Checkbox } from "./checkbox.js";

const meta = {
  component: Checkbox,
  tags: ["autodocs", "lab-smoke", "colocated"],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { "aria-label": "Accept terms" },
  play: async ({ canvas }) => {
    const box = canvas.getByRole("checkbox", { name: /accept terms/i });
    await expect(box).toHaveAttribute("data-slot", "checkbox");
    await expect(box).toHaveAttribute("aria-checked", "false");
  },
};

export const Checked: Story = {
  args: { "aria-label": "Subscribe", defaultChecked: true },
};

export const Disabled: Story = {
  args: { "aria-label": "Unavailable", disabled: true },
};
