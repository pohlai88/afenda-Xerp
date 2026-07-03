import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent } from "storybook/test";

import { Field, FieldError, FieldLabel } from "../../components-ui/field.js";
import {
  NativeSelect,
  NativeSelectOption,
} from "../../components-ui/native-select.js";
import { agenticCenteredMetaParameters } from "./agentic-story-parameters.js";

const meta = {
  title: "Agentic/NativeSelect",
  component: NativeSelect,
  tags: ["autodocs", "ai-generated"],
  parameters: agenticCenteredMetaParameters,
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Region selector for operator workspace context switching.
 *
 * @summary for workspace region selection
 */
export const Workspace: Story = {
  tags: ["lab-smoke"],
  render: () => (
    <NativeSelect aria-label="Workspace region" defaultValue="apac">
      <NativeSelectOption value="apac">Asia Pacific</NativeSelectOption>
      <NativeSelectOption value="emea">EMEA</NativeSelectOption>
      <NativeSelectOption value="amer">Americas</NativeSelectOption>
    </NativeSelect>
  ),
  play: async ({ canvas }) => {
    const select = canvas.getByRole("combobox", { name: /workspace region/i });
    await expect(select).toBeVisible();
    await userEvent.selectOptions(select, "emea");
    await expect(select).toHaveValue("emea");
  },
};

/**
 * Disabled state for read-only contexts where region cannot be changed.
 *
 * @summary for read-only region display
 */
export const Disabled: Story = {
  render: () => (
    <NativeSelect aria-label="Workspace region" defaultValue="apac" disabled>
      <NativeSelectOption value="apac">Asia Pacific</NativeSelectOption>
      <NativeSelectOption value="emea">EMEA</NativeSelectOption>
      <NativeSelectOption value="amer">Americas</NativeSelectOption>
    </NativeSelect>
  ),
};

/**
 * Validation state showing inline error guidance under the select control.
 *
 * @summary for invalid selection recovery guidance
 */
export const ValidationState: Story = {
  render: () => (
    <Field className="w-80">
      <FieldLabel htmlFor="agentic-region">Workspace region</FieldLabel>
      <NativeSelect aria-invalid defaultValue="" id="agentic-region">
        <NativeSelectOption value="">Choose a region</NativeSelectOption>
        <NativeSelectOption value="apac">Asia Pacific</NativeSelectOption>
        <NativeSelectOption value="emea">EMEA</NativeSelectOption>
        <NativeSelectOption value="amer">Americas</NativeSelectOption>
      </NativeSelect>
      <FieldError>
        Please select a workspace region before continuing.
      </FieldError>
    </Field>
  ),
};
