import type { Meta, StoryObj } from "@storybook/react";
import { StoryFrame, StoryStack } from "../story-frame";
import { StorybookScrollAreaDemo } from "./scroll-area-demo";
import { StorybookScrollAreaReleaseTags } from "./scroll-area-release-tags";
import {
  SCROLL_AREA_DEMO_PARAGRAPHS,
  SCROLL_AREA_DEMO_TITLE,
} from "./scroll-area-fixtures";

const meta = {
  title: "Storybook / Scroll Area",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * ScrollAreaDemo — normalized from shadcn-studio scroll-area-01.
 *
 * Patterns applied:
 *   - Fixed 16rem square panel with token border + radius
 *   - Heading + stacked paragraphs inside governed viewport
 *   - Zero className on ScrollArea (dimensions in preview CSS)
 *
 * Compare with Primitives/ScrollArea → ScrollArea — Fixed Height.
 */
export const ScrollAreaDemo: Story = {
  render: () => (
    <StoryFrame width="sm">
      <div className="afenda-docs-preview">
        <StorybookScrollAreaDemo />
      </div>
    </StoryFrame>
  ),
};

/** Release tag list — monospace tabular-nums scroller variant. */
export const ReleaseTagList: Story = {
  render: () => (
    <StoryFrame width="sm">
      <div className="afenda-docs-preview">
        <StorybookScrollAreaReleaseTags />
      </div>
    </StoryFrame>
  ),
};

/**
 * VsPrimitiveFixedHeight — points to governed primitive story equivalent.
 *
 * Primitives/ScrollArea → ScrollArea — Fixed Height uses the same h-64 constraint.
 */
export const VsPrimitiveFixedHeight: Story = {
  render: () => (
    <StoryFrame width="md">
      <div className="afenda-docs-preview">
        <StoryStack gap="lg">
          <StorybookScrollAreaDemo
            paragraphs={SCROLL_AREA_DEMO_PARAGRAPHS.slice(0, 3)}
            title={SCROLL_AREA_DEMO_TITLE}
          />
          <p className="text-muted-foreground text-sm">
            Primitive equivalent: Primitives / ScrollArea → ScrollArea — Fixed
            Height
          </p>
        </StoryStack>
      </div>
    </StoryFrame>
  ),
};
