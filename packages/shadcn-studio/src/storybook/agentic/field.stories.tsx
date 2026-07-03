import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent } from "storybook/test";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../../components-ui/field.js";
import { Input } from "../../components-ui/input.js";
import { agenticCenteredMetaParameters } from "./agentic-story-parameters.js";

const FieldWithLabel = () => (
  <Field className="w-80">
    <FieldLabel htmlFor="agentic-field-email">Email</FieldLabel>
    <Input
      id="agentic-field-email"
      placeholder="operator@afenda.lab"
      type="email"
    />
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

/**
 * Field-label association that confirms focus handoff and accessibility naming.
 *
 * @summary for label to input association checks
 */
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

/**
 * Required field presentation to communicate mandatory input intent.
 *
 * @summary for required field labeling
 */
export const Required: Story = {
  render: () => (
    <Field className="w-80">
      <FieldLabel htmlFor="agentic-required-email">Email *</FieldLabel>
      <Input
        id="agentic-required-email"
        placeholder="operator@afenda.lab"
        required
        type="email"
      />
    </Field>
  ),
};

/**
 * Field helper plus error state to guide correction after failed validation.
 *
 * @summary for description and inline error messaging
 */
export const DescriptionAndError: Story = {
  render: () => (
    <Field className="w-80">
      <FieldLabel htmlFor="agentic-field-with-error">Email</FieldLabel>
      <Input
        aria-invalid
        id="agentic-field-with-error"
        placeholder="operator@afenda.lab"
        type="email"
        value="invalid-format"
      />
      <FieldDescription>
        Use your assigned operator email address.
      </FieldDescription>
      <FieldError>Please enter a valid email format.</FieldError>
    </Field>
  ),
};
