import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

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
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
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
    await expect(canvas.getByText("Purchase order")).toBeVisible();
    await expect(canvas.getByText(/PO-1042/)).toBeVisible();
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
