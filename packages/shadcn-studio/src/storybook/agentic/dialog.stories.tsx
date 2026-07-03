import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "../../components-ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components-ui/dialog.js";
import { agenticCenteredMetaParameters } from "./agentic-story-parameters.js";

const DialogDemo = () => (
  <Dialog>
    <DialogTrigger render={<Button variant="outline" />}>Open settings</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Workspace settings</DialogTitle>
        <DialogDescription>
          Review operator preferences before saving changes.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button type="button">Save</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const meta = {
  title: "Agentic/Dialog",
  component: DialogDemo,
  tags: ["autodocs", "ai-generated"],
  parameters: agenticCenteredMetaParameters,
} satisfies Meta<typeof DialogDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OpenClose: Story = {
  tags: ["lab-smoke"],
  // SB 10.4 play — portal queries via canvasElement.ownerDocument.body
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole("button", { name: /open settings/i });
    await expect(trigger).toBeVisible();
    await userEvent.click(trigger);

    const body = within(canvasElement.ownerDocument.body);
    await body.findByText(/review operator preferences before saving changes/i);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  },
};
