import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import {
  shadcnStudioChromaticSmokeParameters,
  shadcnStudioPrimitiveFigmaDesignFromEnv,
} from "../storybook/story-parameters.js";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card.js";

const meta = {
  component: Card,
  tags: ["autodocs", "lab-smoke", "colocated"],
  parameters: {
    ...shadcnStudioPrimitiveFigmaDesignFromEnv("card"),
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  tags: ["a11y-smoke"],
  ...shadcnStudioChromaticSmokeParameters,
  render: () => (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Purchase order</CardTitle>
        <CardDescription>PO-1042 awaiting approval</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Total: MYR 12,480.00</p>
      </CardContent>
    </Card>
  ),
  play: async ({ canvas }) => {
    const title = canvas.getByText("Purchase order");
    await expect(title).toBeVisible();
    await expect(canvas.getByText(/PO-1042/)).toBeVisible();
    await expect(title.closest('[data-slot="card"]')).toHaveAttribute(
      "data-slot",
      "card"
    );
  },
};

export const Small: Story = {
  render: () => (
    <Card className="w-full max-w-sm" size="sm">
      <CardHeader>
        <CardTitle>Compact card</CardTitle>
        <CardDescription>Dense layout for tables</CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-full max-w-sm">
      <CardContent>
        <p className="text-sm">Standalone card body without a header.</p>
      </CardContent>
    </Card>
  ),
};
