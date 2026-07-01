import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import { Badge } from "./badge.js";

const meta = {
  component: Badge,
  tags: ["autodocs", "lab-smoke", "colocated"],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { children: "New" },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("New")).toHaveAttribute("data-slot", "badge");
  },
};

export const Secondary: Story = {
  args: { children: "Draft", variant: "secondary" },
};

export const Outline: Story = {
  args: { children: "Beta", variant: "outline" },
};
