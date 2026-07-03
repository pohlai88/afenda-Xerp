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

/**
 * Default input for editable operator email entry.
 *
 * @summary for standard editable text entry
 */
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

/**
 * Disabled input to show read-only/locked form state.
 *
 * @summary for locked fields that remain visible but not editable
 */
export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
    value: "owner@afenda.lab",
  },
};

/**
 * Placeholder hint for examples where users need format guidance before typing.
 *
 * @summary for format-hint input entry
 */
export const WithPlaceholderHint: Story = {
  args: {
    ...Default.args,
    placeholder: "name@company.com",
  },
};
