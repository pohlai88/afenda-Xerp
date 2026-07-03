import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent } from "storybook/test";

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
