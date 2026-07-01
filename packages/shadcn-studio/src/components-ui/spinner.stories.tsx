import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import { Spinner } from "./spinner.js";

const meta = {
  component: Spinner,
  tags: ["autodocs", "lab-smoke", "colocated"],
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  play: async ({ canvas }) => {
    const status = canvas.getByRole("status", { name: /loading/i });
    await expect(status).toHaveAttribute("data-slot", "spinner");
    await expect(status).toHaveAttribute("aria-label", "Loading");
  },
};

export const Large: Story = {
  args: { className: "size-8" },
};

export const Muted: Story = {
  args: { className: "size-5 text-muted-foreground" },
};
