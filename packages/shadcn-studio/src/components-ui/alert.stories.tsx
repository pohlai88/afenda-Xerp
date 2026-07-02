import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import {
  shadcnStudioChromaticSmokeParameters,
  shadcnStudioPrimitiveFigmaDesignFromEnv,
} from "../storybook/story-parameters.js";
import { Alert, AlertDescription, AlertTitle } from "./alert.js";

const meta = {
  component: Alert,
  tags: ["autodocs", "lab-smoke", "colocated"],
  parameters: {
    ...shadcnStudioPrimitiveFigmaDesignFromEnv("alert"),
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  tags: ["a11y-smoke"],
  ...shadcnStudioChromaticSmokeParameters,
  render: () => (
    <Alert>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>Review your procurement settings.</AlertDescription>
    </Alert>
  ),
  play: async ({ canvas }) => {
    const alert = canvas.getByRole("alert");
    await expect(alert).toHaveAttribute("data-slot", "alert");
    await expect(canvas.getByText("Heads up")).toBeVisible();
  },
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Unable to save purchase order.</AlertDescription>
    </Alert>
  ),
};

export const DefaultCopy: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Scheduled maintenance</AlertTitle>
      <AlertDescription>
        ERP read-only mode starts at 22:00 UTC.
      </AlertDescription>
    </Alert>
  ),
};
