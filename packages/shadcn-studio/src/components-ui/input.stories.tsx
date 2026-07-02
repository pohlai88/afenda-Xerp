import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent } from "storybook/test";

import {
  shadcnStudioChromaticSmokeParameters,
  shadcnStudioPrimitiveFigmaDesignFromEnv,
} from "../storybook/story-parameters.js";
import { inputStoryArgTypes } from "../storybook/colocated-argtypes.js";
import { Input } from "./input.js";

const meta = {
  component: Input,
  tags: ["autodocs", "lab-smoke", "colocated"],
  argTypes: inputStoryArgTypes,
  parameters: {
    ...shadcnStudioPrimitiveFigmaDesignFromEnv("input"),
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  tags: ["a11y-smoke"],
  ...shadcnStudioChromaticSmokeParameters,
  args: {
    placeholder: "Vendor email",
    type: "email",
    "aria-label": "Vendor email",
    onChange: fn(),
  },
  play: async ({ args, canvas }) => {
    const field = canvas.getByRole("textbox", { name: /vendor email/i });
    await expect(field).toBeVisible();
    await expect(field).toHaveAttribute("data-slot", "input");
    await userEvent.type(field, "procurement@afenda.test");
    await expect(field).toHaveValue("procurement@afenda.test");
    await expect(args.onChange).toHaveBeenCalled();
  },
};

export const Disabled: Story = {
  args: { placeholder: "Read only", disabled: true, onChange: fn() },
};

export const Password: Story = {
  args: { placeholder: "Password", type: "password", onChange: fn() },
};
