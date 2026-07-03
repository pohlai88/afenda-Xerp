import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent } from "storybook/test";

import { Field, FieldLabel } from "../../components-ui/field.js";
import { Input } from "../../components-ui/input.js";
import { agenticCenteredMetaParameters } from "./agentic-story-parameters.js";

const FieldWithLabel = () => (
  <Field className="w-80">
    <FieldLabel htmlFor="agentic-field-email">Email</FieldLabel>
    <Input id="agentic-field-email" placeholder="operator@afenda.lab" type="email" />
  </Field>
);

const meta = {
  title: "Agentic/Field",
  component: FieldWithLabel,
  tags: ["autodocs", "ai-generated"],
  parameters: agenticCenteredMetaParameters,
} satisfies Meta<typeof FieldWithLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LabelForInput: Story = {
  tags: ["lab-smoke"],
  play: async ({ canvas }) => {
    const label = canvas.getByText("Email");
    const input = canvas.getByRole("textbox", { name: /email/i });
    await expect(label).toBeVisible();
    await expect(input).toBeVisible();
    await userEvent.click(label);
    await expect(input).toHaveFocus();
  },
};
