import type { Meta, StoryObj } from "@storybook/react";
import { StoryFrame, StoryStack } from "../story-frame";
import { StorybookCollapsibleAnimated } from "./collapsible-animated-demo";
import {
  STARRED_REPOS_COLLAPSIBLE,
  STARRED_REPOS_PRIMARY,
  STARRED_REPOS_TITLE,
} from "./collapsible-fixtures";

const meta = {
  title: "Storybook / Collapsible (Animated)",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * CollapsibleAnimated — normalized from shadcn-studio collapsible-10.
 *
 * /rui patterns applied:
 *   - Height animation via CSS keyframes on [data-slot="collapsible-content"]
 *   - Ghost icon trigger via governed Button props (no stock variant strings)
 *   - Monospace repo rows with token borders
 *
 * Compare with Primitives/Collapsible → Default (RelatedOrdersDemo) for non-animated ERP pattern.
 */
export const CollapsibleAnimated: Story = {
  render: () => (
    <StoryFrame width="md">
      <div className="afenda-docs-preview">
        <StorybookCollapsibleAnimated />
      </div>
    </StoryFrame>
  ),
};

/** Default open — verify close animation. */
export const DefaultOpen: Story = {
  render: () => (
    <StoryFrame width="md">
      <div className="afenda-docs-preview">
        <StorybookCollapsibleAnimated defaultOpen />
      </div>
    </StoryFrame>
  ),
};

/** Custom ERP fixture — Afenda package registry disclosure pattern. */
export const PackageRegistry: Story = {
  render: () => (
    <StoryFrame width="md">
      <div className="afenda-docs-preview">
        <StorybookCollapsibleAnimated
          collapsibleRepos={[
            "@afenda/appshell",
            "@afenda/metadata-ui",
            "@afenda/execution",
          ]}
          primaryRepo="@afenda/ui"
          title="Foundation packages (4)"
        />
      </div>
    </StoryFrame>
  ),
};

/**
 * VsPrimitiveDefault — points to the governed primitive story equivalent.
 *
 * Primitives/Collapsible → Default uses the same starred-repos UX without CSS height animation.
 */
export const VsPrimitiveDefault: Story = {
  render: () => (
    <StoryFrame width="lg">
      <div className="afenda-docs-preview">
        <StoryStack gap="lg">
          <StorybookCollapsibleAnimated
            collapsibleRepos={[...STARRED_REPOS_COLLAPSIBLE]}
            primaryRepo={STARRED_REPOS_PRIMARY}
            title={`Animated — ${STARRED_REPOS_TITLE}`}
          />
          <p className="text-muted-foreground text-sm">
            Non-animated ERP variant: Primitives / Collapsible → Default
          </p>
        </StoryStack>
      </div>
    </StoryFrame>
  ),
};
