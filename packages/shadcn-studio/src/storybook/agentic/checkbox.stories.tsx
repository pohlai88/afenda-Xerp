import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent } from "storybook/test";

import { Checkbox } from "../../components-ui/checkbox.js";
import { checkboxStoryArgTypes } from "../colocated-argtypes.js";
import { agenticCenteredMetaParameters } from "./agentic-story-parameters.js";

const meta = {
  title: "Agentic/Checkbox",
  component: Checkbox,
  tags: ["autodocs", "ai-generated"],
  argTypes: checkboxStoryArgTypes,
  parameters: agenticCenteredMetaParameters,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Toggle: Story = {
  tags: ["lab-smoke"],
  args: {
    "aria-label": "Remember device",
    onCheckedChange: fn(),
  },
  play: async ({ args, canvas }) => {
    const checkbox = canvas.getByRole("checkbox", { name: /remember device/i });
    await expect(checkbox).toBeVisible();
    await expect(checkbox).toHaveAttribute("aria-checked", "false");
    await userEvent.click(checkbox);
    await expect(checkbox).toHaveAttribute("aria-checked", "true");
    await expect(args.onCheckedChange).toHaveBeenCalledTimes(1);
  },
};
