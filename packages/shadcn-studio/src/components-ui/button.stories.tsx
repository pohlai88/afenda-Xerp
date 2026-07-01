import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import { Button } from "./button.js";

const meta = {
  component: Button,
  // Mirror shadcnStudioLabColocatedTags in story-parameters.ts
  tags: ["autodocs", "lab-smoke", "colocated"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { children: "Order now", type: "button" },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: /order now/i });
    await expect(button).toHaveAttribute("data-slot", "button");
  },
};

export const Outline: Story = {
  args: { children: "Cancel", type: "button", variant: "outline" },
};

export const Destructive: Story = {
  args: { children: "Delete", type: "button", variant: "destructive" },
};

export const CssCheck: Story = {
  args: { children: "Submit", type: "button", variant: "default" },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: /submit/i });
    // buttonVariants default includes font-medium (500).
    await expect(getComputedStyle(button).fontWeight).toBe("500");
  },
};
