import type { Meta, StoryObj } from "@storybook/react";
import { DocsTabbedPanel } from "../../afenda-docs/docs-tabbed-panel";
import { StoryFrame } from "../story-frame";
import { StorybookTabsAnimatedUnderline } from "./tabs-animated-underline-demo";
import { StorybookTabsLine } from "./tabs-line-demo";
import { ANIMATED_TABS_ITEMS } from "./tabs-fixtures";

const meta = {
  title: "Storybook / Tabs",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * LineTabs — normalized from shadcn-studio tabs-11.
 *
 * Patterns applied:
 *   - TabsList variant="line" — bottom border only, no background pill
 *   - Governed pseudo-element underline flush against list border
 *   - Zero className on governed tabs primitives
 */
export const LineTabs: Story = {
  render: () => (
    <StoryFrame width="md">
      <div className="afenda-docs-preview">
        <StorybookTabsLine />
      </div>
    </StoryFrame>
  ),
};

/**
 * AnimatedUnderline — normalized from shadcn-studio tabs-29.
 *
 * Patterns applied:
 *   - motion/react spring underline tracking active trigger
 *   - TabsList variant="line" — zero className on governed tabs primitives
 *   - useReducedMotion disables spring transition
 */
export const AnimatedUnderline: Story = {
  render: () => (
    <StoryFrame width="md">
      <div className="afenda-docs-preview">
        <StorybookTabsAnimatedUnderline />
      </div>
    </StoryFrame>
  ),
};

/**
 * VsLineTabs — static line tabs (tabs-11 / DocsTabbedPanel) for comparison.
 */
export const VsLineTabs: Story = {
  render: () => (
    <StoryFrame width="md">
      <div className="afenda-docs-preview">
        <DocsTabbedPanel
          items={ANIMATED_TABS_ITEMS.map((item) => ({
            label: item.label,
            value: item.value,
            content: (
              <p className="afenda-storybook-tabs__content">{item.content}</p>
            ),
          }))}
          tabsVariant="line"
        />
      </div>
    </StoryFrame>
  ),
};
