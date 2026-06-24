import type { Meta, StoryObj } from "@storybook/react";
import { HeartIcon } from "lucide-react";
import { Toggle } from "../../toggle";
import { StoryFrame } from "../story-frame";
import { StorybookToggleAnimated } from "./toggle-animated-demo";
import { TOGGLE_ANIMATED_ARIA_LABEL } from "./toggle-fixtures";

const meta = {
  title: "Storybook / Toggle (Animated)",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * AnimatedBookmark — normalized from shadcn-studio toggle-13.
 *
 * Patterns applied:
 *   - MotionToggle particle burst on press (destructive accent)
 *   - Zero className on governed Toggle
 *   - useReducedMotion skips burst animation
 */
export const AnimatedBookmark: Story = {
  render: () => (
    <StoryFrame width="sm">
      <div className="afenda-docs-preview">
        <StorybookToggleAnimated />
      </div>
    </StoryFrame>
  ),
};

/**
 * VsPrimitiveToggle — static governed toggle without motion burst.
 */
export const VsPrimitiveToggle: Story = {
  render: () => (
    <StoryFrame width="sm">
      <div className="afenda-docs-preview">
        <div className="afenda-storybook-toggle">
          <Toggle aria-label={TOGGLE_ANIMATED_ARIA_LABEL}>
            <HeartIcon
              aria-hidden="true"
              className="afenda-storybook-toggle__icon"
            />
            Foundation watchlist
          </Toggle>
        </div>
      </div>
    </StoryFrame>
  ),
};
