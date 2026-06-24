import type { Meta, StoryObj } from "@storybook/react";
import { StoryFrame, StoryStack } from "../story-frame";
import {
  DIALOG_SUBSCRIBE_DESCRIPTION,
  DIALOG_SUBSCRIBE_TITLE,
} from "./dialog-fixtures";
import { StorybookDialogSubscribe } from "./dialog-subscribe-demo";

const meta = {
  title: "Storybook / Dialog (Subscribe)",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * DialogSubscribe — normalized from shadcn-studio dialog-09.
 *
 * Patterns applied:
 *   - Centered header + description in subscribe dialog
 *   - Inline email field + submit button row
 *   - Outline trigger via governed Button props (not stock variant strings)
 *
 * Compare with Primitives/Dialog → Default for standard ERP dialog patterns.
 */
export const DialogSubscribe: Story = {
  render: () => (
    <StoryFrame width="md">
      <div className="afenda-docs-preview">
        <StorybookDialogSubscribe />
      </div>
    </StoryFrame>
  ),
};

/** Dialog open by default — verify centered header and form layout. */
export const DefaultOpen: Story = {
  render: () => (
    <StoryFrame width="md">
      <div className="afenda-docs-preview">
        <StorybookDialogSubscribe defaultOpen />
      </div>
    </StoryFrame>
  ),
};

/** Custom ERP copy — runtime-truth matrix notifications. */
export const RuntimeTruthUpdates: Story = {
  render: () => (
    <StoryFrame width="md">
      <div className="afenda-docs-preview">
        <StorybookDialogSubscribe
          defaultOpen
          description="Receive weekly runtime-truth matrix diffs and TIP status index changes for Phase 0–9 foundation work."
          submitLabel="Notify me"
          title="Runtime truth notifications"
          triggerLabel="Get updates"
        />
      </div>
    </StoryFrame>
  ),
};

/**
 * VsPrimitiveDefault — points to the governed primitive story equivalent.
 *
 * Primitives/Dialog → Default uses the same dialog shell without subscribe form layout.
 */
export const VsPrimitiveDefault: Story = {
  render: () => (
    <StoryFrame width="lg">
      <div className="afenda-docs-preview">
        <StoryStack gap="lg">
          <StorybookDialogSubscribe
            description={DIALOG_SUBSCRIBE_DESCRIPTION}
            title={DIALOG_SUBSCRIBE_TITLE}
          />
          <p className="text-muted-foreground text-sm">
            Standard ERP dialog patterns: Primitives / Dialog → Default
          </p>
        </StoryStack>
      </div>
    </StoryFrame>
  ),
};
