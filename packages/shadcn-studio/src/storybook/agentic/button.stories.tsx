import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent } from "storybook/test";

import { Button } from "../../components-ui/button.js";
import { buttonStoryArgTypes } from "../colocated-argtypes.js";
import {
  agenticCenteredMetaParameters,
} from "./agentic-story-parameters.js";

const meta = {
  title: "Agentic/Button",
  component: Button,
  tags: ["autodocs", "ai-generated"],
  argTypes: buttonStoryArgTypes,
  parameters: agenticCenteredMetaParameters,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  tags: ["lab-smoke"],
  args: {
    children: "Continue",
    type: "button",
    onClick: fn(),
  },
  // SB 10.4 play — canvas scope + args/fn(): https://storybook.js.org/docs/writing-stories/play-function
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button", { name: /continue/i });
    await expect(button).toBeVisible();
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Outline: Story = {
  args: {
    ...Primary.args,
    variant: "outline",
    children: "Cancel",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Outline variant — story-level docs parameter merged with meta; args spread from Primary.",
      },
    },
  },
};
