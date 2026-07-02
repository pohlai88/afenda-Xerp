import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";

import {
  shadcnStudioChromaticSmokeParameters,
  shadcnStudioPrimitiveFigmaDesignFromEnv,
} from "../storybook/story-parameters.js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog.js";

const meta = {
  component: AlertDialog,
  tags: ["autodocs", "lab-smoke", "colocated"],
  parameters: {
    ...shadcnStudioPrimitiveFigmaDesignFromEnv("alert-dialog"),
  },
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  tags: ["a11y-smoke"],
  ...shadcnStudioChromaticSmokeParameters,
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger>Delete purchase order</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete PO-1042?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the draft purchase order from the workspace queue.
            Finance approvals will be cancelled.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete order</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole("button", {
      name: /delete purchase order/i,
    });
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("data-slot", "alert-dialog-trigger");

    await userEvent.click(trigger);

    const body = within(canvasElement.ownerDocument.body);
    const alertDialog = await body.findByRole("alertdialog");
    await expect(alertDialog).toBeVisible();
    await expect(
      body.getByText(/finance approvals will be cancelled/i)
    ).toBeVisible();
  },
};
