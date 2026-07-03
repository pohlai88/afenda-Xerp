import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "../../components-ui/button.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components-ui/dropdown-menu.js";
import { agenticCenteredMetaParameters } from "./agentic-story-parameters.js";

const DropdownDemo = () => (
  <DropdownMenu>
    <DropdownMenuTrigger render={<Button variant="outline" />}>
      Actions
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>Duplicate</DropdownMenuItem>
      <DropdownMenuItem>Archive</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const meta = {
  title: "Agentic/DropdownMenu",
  component: DropdownDemo,
  tags: ["autodocs", "ai-generated"],
  parameters: agenticCenteredMetaParameters,
} satisfies Meta<typeof DropdownDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Standard action menu to expose contextual item-level operations.
 *
 * @summary for contextual menu actions on compact surfaces
 */
export const OpenMenu: Story = {
  tags: ["lab-smoke"],
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole("button", { name: /^actions$/i });
    await expect(trigger).toBeVisible();
    await userEvent.click(trigger);

    // Portaled content renders outside canvas; query ownerDocument.body.
    const body = within(canvasElement.ownerDocument.body);
    await body.findByRole("menuitem", { name: /duplicate/i });
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  },
};

/**
 * Menu variant including destructive action copy for risk-signaling workflows.
 *
 * @summary for contextual menus with dangerous actions
 */
export const WithDangerItem: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Actions
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem>Archive</DropdownMenuItem>
        <DropdownMenuItem>Delete permanently</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
