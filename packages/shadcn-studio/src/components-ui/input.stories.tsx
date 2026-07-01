import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import { Input } from "./input.js";

const meta = {
  component: Input,
  tags: ["autodocs", "lab-smoke", "colocated"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { placeholder: "Email address", type: "email" },
  play: async ({ canvas }) => {
    const field = canvas.getByPlaceholderText("Email address");
    await expect(field).toHaveAttribute("data-slot", "input");
    await expect(field).toHaveAttribute("type", "email");
  },
};

export const Disabled: Story = {
  args: { placeholder: "Read only", disabled: true },
};

export const Password: Story = {
  args: { placeholder: "Password", type: "password" },
};
