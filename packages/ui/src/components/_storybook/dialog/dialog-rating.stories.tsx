import type { Meta, StoryObj } from "@storybook/react";
import { StoryFrame, StoryStack } from "../story-frame";
import {
  DIALOG_RATING_LEGEND,
  DIALOG_RATING_TITLE,
} from "./dialog-rating-fixtures";
import { StorybookDialogRating } from "./dialog-rating-demo";
import { StorybookDialogSubscribe } from "./dialog-subscribe-demo";

const meta = {
  title: "Storybook / Dialog (Rating)",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * DialogRating — normalized from shadcn-studio dialog-11.
 *
 * Patterns applied:
 *   - Vertical mood list: visible radio + Lucide icon per row (matches Storybook screenshot)
 *   - Textarea + consent checkbox + cancel/submit footer (muted footer from Dialog recipe)
 *   - Outline trigger via governed Button props (not stock variant strings)
 *
 * Compare with Storybook / Dialog (Subscribe) for inline form layout variant.
 */
export const DialogRating: Story = {
  render: () => (
    <StoryFrame width="md">
      <div className="afenda-docs-preview">
        <StorybookDialogRating />
      </div>
    </StoryFrame>
  ),
};

/** Dialog open by default — verify rating selection and form layout. */
export const DefaultOpen: Story = {
  render: () => (
    <StoryFrame width="md">
      <div className="afenda-docs-preview">
        <StorybookDialogRating defaultOpen />
      </div>
    </StoryFrame>
  ),
};

/** Low default rating — verify first row radio is checked (visible control). */
export const DefaultLowRating: Story = {
  render: () => (
    <StoryFrame width="md">
      <div className="afenda-docs-preview">
        <StorybookDialogRating defaultOpen defaultRating="1" />
      </div>
    </StoryFrame>
  ),
};

/**
 * VsDialogSubscribe — compare rating feedback vs subscribe email capture.
 */
export const VsDialogSubscribe: Story = {
  render: () => (
    <StoryFrame width="lg">
      <div className="afenda-docs-preview">
        <StoryStack gap="lg">
          <StorybookDialogRating
            legend={DIALOG_RATING_LEGEND}
            title={DIALOG_RATING_TITLE}
          />
          <StorybookDialogSubscribe />
          <p className="text-muted-foreground text-sm">
            Subscribe variant: Storybook / Dialog (Subscribe) → DialogSubscribe
          </p>
        </StoryStack>
      </div>
    </StoryFrame>
  ),
};
