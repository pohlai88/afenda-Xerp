"use client";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@afenda/shadcn-studio-v2";
import {
  shadcnStudioCenteredLayout,
  shadcnStudioDarkThemeGlobals,
} from "@afenda/shadcn-studio-v2/lab";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";

function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button type="button">Open dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm workspace change</DialogTitle>
          <DialogDescription>
            Switching workspaces reloads operator context and clears unsaved
            filters.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Cancel
          </DialogClose>
          <Button type="button">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const meta = {
  title: "Shadcn Studio V2/Primitives/Overlay",
  component: Dialog,
  tags: ["autodocs", "manifest"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component:
          "Dialog overlay primitive — portaled content uses Storybook portal root.",
      },
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DialogDefault: Story = {
  tags: ["lab-smoke"],
  render: () => <DialogDemo />,
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole("button", { name: "Open dialog" });
    await userEvent.click(trigger);
    const body = within(canvasElement.ownerDocument.body);
    await expect(
      body.getByRole("dialog", { name: "Confirm workspace change" })
    ).toBeVisible();
  },
};

export const DialogDark: Story = {
  globals: shadcnStudioDarkThemeGlobals,
  render: () => <DialogDemo />,
};
