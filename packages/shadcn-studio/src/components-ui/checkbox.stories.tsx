import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent } from "storybook/test";

import {
  shadcnStudioChromaticSmokeParameters,
  shadcnStudioPrimitiveFigmaDesignFromEnv,
} from "../storybook/story-parameters.js";
import { checkboxStoryArgTypes } from "../storybook/colocated-argtypes.js";
import { Checkbox } from "./checkbox.js";

const meta = {
  component: Checkbox,
  tags: ["autodocs", "lab-smoke", "colocated"],
  argTypes: checkboxStoryArgTypes,
  parameters: {
    ...shadcnStudioPrimitiveFigmaDesignFromEnv("checkbox"),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  tags: ["a11y-smoke"],
  ...shadcnStudioChromaticSmokeParameters,
  args: {
    "aria-label": "Accept terms",
    onCheckedChange: fn(),
  },
  play: async ({ args, canvas }) => {
    const box = canvas.getByRole("checkbox", { name: /accept terms/i });
    await expect(box).toBeVisible();
    await expect(box).toHaveAttribute("data-slot", "checkbox");
    await expect(box).toHaveAttribute("aria-checked", "false");
    await userEvent.click(box);
    await expect(box).toHaveAttribute("aria-checked", "true");
    await expect(args.onCheckedChange).toHaveBeenCalled();
  },
};

export const Checked: Story = {
  args: {
    "aria-label": "Subscribe",
    defaultChecked: true,
    onCheckedChange: fn(),
  },
};

export const Disabled: Story = {
  args: { "aria-label": "Unavailable", disabled: true, onCheckedChange: fn() },
};
