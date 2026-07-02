import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";

import {
  shadcnStudioChromaticSmokeParameters,
  shadcnStudioPrimitiveFigmaDesignFromEnv,
} from "../storybook/story-parameters.js";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog.js";

const meta = {
  component: Dialog,
  tags: ["autodocs", "lab-smoke", "colocated"],
  parameters: {
    ...shadcnStudioPrimitiveFigmaDesignFromEnv("dialog"),
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  tags: ["a11y-smoke"],
  ...shadcnStudioChromaticSmokeParameters,
  render: () => (
    <Dialog>
      <DialogTrigger>View PO-1042 details</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase order PO-1042</DialogTitle>
          <DialogDescription>
            Approval workflow, line items, and vendor terms for Acme Supplies.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole("button", {
      name: /view PO-1042 details/i,
    });
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("data-slot", "dialog-trigger");

    await userEvent.click(trigger);

    const body = within(canvasElement.ownerDocument.body);
    const dialog = await body.findByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("data-slot", "dialog-content");
    await expect(body.getByText(/approval workflow/i)).toBeVisible();
  },
};
