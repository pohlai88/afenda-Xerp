import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";

import {
  shadcnStudioChromaticSmokeParameters,
  shadcnStudioPrimitiveFigmaDesignFromEnv,
} from "../storybook/story-parameters.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion.js";

const meta = {
  component: Accordion,
  tags: ["autodocs", "lab-smoke", "colocated"],
  parameters: {
    ...shadcnStudioPrimitiveFigmaDesignFromEnv("accordion"),
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  tags: ["a11y-smoke"],
  ...shadcnStudioChromaticSmokeParameters,
  render: () => (
    <Accordion className="w-full max-w-md">
      <AccordionItem>
        <AccordionTrigger>What is Afenda ERP?</AccordionTrigger>
        <AccordionContent>
          Afenda ERP is a governed enterprise platform built on shadcn/studio
          primitives and PAS-006 presentation standards.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvasElement.querySelector('[data-slot="accordion"]')
    ).toBeInTheDocument();

    const trigger = canvas.getByRole("button", { name: /what is afenda erp/i });
    await expect(trigger).toHaveAttribute("data-slot", "accordion-trigger");
    await userEvent.click(trigger);
    await expect(
      canvas.getByText(/governed enterprise platform/i)
    ).toBeVisible();
  },
};

export const MultipleSections: Story = {
  render: () => (
    <Accordion className="w-full max-w-md" defaultValue={["billing"]}>
      <AccordionItem value="billing">
        <AccordionTrigger>Billing</AccordionTrigger>
        <AccordionContent>
          Invoices, payment terms, and receivables live in the accounting
          module.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="inventory">
        <AccordionTrigger>Inventory</AccordionTrigger>
        <AccordionContent>
          Track stock levels, warehouses, and fulfillment workflows.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const CustomInnerPadding: Story = {
  render: () => (
    <Accordion className="w-full max-w-md" defaultValue={["notes"]}>
      <AccordionItem value="notes">
        <AccordionTrigger>Release notes</AccordionTrigger>
        <AccordionContent innerClassName="border-t border-border pt-4">
          Panel inner slot accepts <code>innerClassName</code> for layout-only
          overrides.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
