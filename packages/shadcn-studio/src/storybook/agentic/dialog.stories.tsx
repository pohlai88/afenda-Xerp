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
    <DialogTrigger render={<Button variant="outline" />}>
      Open settings
    </DialogTrigger>
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

/**
 * Standard dialog flow for settings edits with explicit open interaction.
 *
 * @summary for standard settings edit confirmation dialogs
 */
export const OpenClose: Story = {
  tags: ["lab-smoke"],
  // Portaled content renders outside the story canvas.
  // Query via canvasElement.ownerDocument.body for stable assertions.
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole("button", { name: /open settings/i });
    await expect(trigger).toBeVisible();
    await userEvent.click(trigger);

    const body = within(canvasElement.ownerDocument.body);
    await body.findByText(/review operator preferences before saving changes/i);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  },
};

/**
 * Dialog content without close icon where users must choose explicit footer action.
 *
 * @summary for confirm/cancel flows without top-right dismiss affordance
 */
export const WithoutCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Open settings
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
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
  ),
};

/**
 * Long-form dialog body for flows that require scrollable explanatory copy.
 *
 * @summary for long-content dialogs with explanatory context
 */
export const LongContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Open settings
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Workspace settings</DialogTitle>
          <DialogDescription>
            Review operator preferences before saving changes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 text-muted-foreground text-sm">
          <p>
            Retention policy changes affect all operators in this workspace.
          </p>
          <p>
            Audit logs are preserved even when profile-level preferences reset.
          </p>
          <p>
            Confirm the update window before saving to avoid in-progress
            conflicts.
          </p>
        </div>
        <DialogFooter>
          <Button type="button">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
