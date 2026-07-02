import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent } from "storybook/test";

import {
  shadcnStudioChromaticSmokeParameters,
  shadcnStudioPrimitiveFigmaDesignFromEnv,
} from "../storybook/story-parameters.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs.js";

const meta = {
  component: Tabs,
  tags: ["autodocs", "lab-smoke", "colocated"],
  parameters: {
    ...shadcnStudioPrimitiveFigmaDesignFromEnv("tabs"),
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  tags: ["a11y-smoke"],
  ...shadcnStudioChromaticSmokeParameters,
  render: () => (
    <Tabs className="w-full max-w-md" defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Line items</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        Purchase order PO-1042 summary — vendor Acme Supplies, total MYR 12,480.
      </TabsContent>
      <TabsContent value="details">
        Tax, freight, and approval history for the procurement workspace.
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvas }) => {
    const overviewTab = canvas.getByRole("tab", { name: /overview/i });
    await expect(overviewTab).toBeVisible();
    await expect(overviewTab).toHaveAttribute("data-slot", "tabs-trigger");
    await expect(
      canvas.getByText(/purchase order PO-1042 summary/i)
    ).toBeVisible();

    await userEvent.click(canvas.getByRole("tab", { name: /line items/i }));
    await expect(
      canvas.getByText(/approval history for the procurement workspace/i)
    ).toBeVisible();
  },
};

export const Vertical: Story = {
  render: () => (
    <Tabs
      className="w-full max-w-md"
      defaultValue="billing"
      orientation="vertical"
    >
      <TabsList>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="inventory">Inventory</TabsTrigger>
      </TabsList>
      <TabsContent value="billing">Invoices and payment terms.</TabsContent>
      <TabsContent value="inventory">
        Warehouse stock and fulfillment.
      </TabsContent>
    </Tabs>
  ),
};
