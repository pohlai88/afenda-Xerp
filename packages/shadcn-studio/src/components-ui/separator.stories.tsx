import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import {
  shadcnStudioChromaticSmokeParameters,
  shadcnStudioPrimitiveFigmaDesignFromEnv,
} from "../storybook/story-parameters.js";
import { Separator } from "./separator.js";

const meta = {
  component: Separator,
  tags: ["autodocs", "lab-smoke", "colocated"],
  parameters: {
    ...shadcnStudioPrimitiveFigmaDesignFromEnv("separator"),
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  tags: ["a11y-smoke"],
  ...shadcnStudioChromaticSmokeParameters,
  args: { className: "w-full max-w-xs" },
  play: async ({ canvas }) => {
    const separator = canvas.getByRole("separator");
    await expect(separator).toBeVisible();
    await expect(separator).toHaveAttribute("data-slot", "separator");
    await expect(separator).toHaveAttribute("aria-orientation", "horizontal");
  },
};

export const Vertical: Story = {
  args: { orientation: "vertical", className: "h-8" },
};

export const Wide: Story = {
  args: { className: "my-4 w-full max-w-md" },
};
