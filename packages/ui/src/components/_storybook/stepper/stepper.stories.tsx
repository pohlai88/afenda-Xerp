import type { Meta, StoryObj } from "@storybook/react";
import { StoryFrame } from "../story-frame";
import { StorybookStepperVerticalDemo } from "./stepper-vertical-demo";

const meta = {
  title: "Storybook / Stepper (Vertical)",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * StepperVertical — normalized from shadcn-studio stepper-09.
 *
 * Patterns applied:
 *   - Vertical StepperNav + StepperPanel content swap
 *   - Governed Button via intent/emphasis props (Back / Next)
 *   - Dashed content panel with token border + muted surface
 *   - Keyboard tablist navigation on step triggers
 */
export const StepperVertical: Story = {
  render: () => (
    <StoryFrame width="lg">
      <div className="afenda-docs-preview">
        <StorybookStepperVerticalDemo />
      </div>
    </StoryFrame>
  ),
};

/** Default step pinned to operating context (first step). */
export const DefaultStepContext: Story = {
  render: () => (
    <StoryFrame width="lg">
      <div className="afenda-docs-preview">
        <StorybookStepperVerticalDemo />
      </div>
    </StoryFrame>
  ),
};
