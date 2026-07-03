import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent } from "storybook/test";

import { Input } from "../../components-ui/input.js";
import { inputStoryArgTypes } from "../colocated-argtypes.js";
import { agenticCenteredMetaParameters } from "./agentic-story-parameters.js";

const meta = {
  title: "Agentic/Input",
  component: Input,
  tags: ["autodocs", "ai-generated"],
  argTypes: inputStoryArgTypes,
  parameters: agenticCenteredMetaParameters,
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  tags: ["lab-smoke"],
  args: {
    "aria-label": "Workspace email",
    placeholder: "operator@afenda.lab",
    type: "email",
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: /workspace email/i });
    await expect(input).toBeVisible();
    await userEvent.clear(input);
    await userEvent.type(input, "ada@afenda.lab");
    await expect(input).toHaveValue("ada@afenda.lab");
  },
};
