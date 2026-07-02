import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import {
  shadcnStudioChromaticSmokeParameters,
  shadcnStudioPrimitiveFigmaDesignFromEnv,
} from "../storybook/story-parameters.js";
import { Progress } from "./progress.js";

const meta = {
  component: Progress,
  tags: ["autodocs", "lab-smoke", "colocated"],
  parameters: {
    ...shadcnStudioPrimitiveFigmaDesignFromEnv("progress"),
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  tags: ["a11y-smoke"],
  ...shadcnStudioChromaticSmokeParameters,
  args: {
    value: 45,
    className: "w-full max-w-xs",
    "aria-label": "Batch import progress",
  },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole("progressbar");
    await expect(bar).toBeVisible();
    await expect(bar).toHaveAttribute("data-slot", "progress");
    await expect(bar).toHaveAttribute("aria-valuenow", "45");
  },
};

export const Empty: Story = {
  args: { value: 0, className: "w-full max-w-xs" },
};

export const Complete: Story = {
  args: { value: 100, className: "w-full max-w-xs" },
};
