import type { Meta, StoryObj } from "@storybook/react";
import { StoryFrame, StoryStack } from "../story-frame";
import { StorybookCommandFilterSearch } from "./command-filter-search";
import {
  COMMAND_FILTER_ERP_SURFACES,
  COMMAND_FILTER_FOUNDATION_MODULES,
} from "./command-fixtures";

const meta = {
  title: "Storybook / Command (Filter Search)",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * CommandFilterSearch — normalized from shadcn-studio command-11.
 *
 * Patterns applied:
 *   - CommandDialog with nested RadioGroup filter sections (category, sort, time)
 *   - Checkbox multi-select rows inside CommandItem
 *   - Outline trigger via governed Button props (no stock variant strings)
 *
 * Compare with Primitives/Command → ERP — Workflow Command Palette for cmdk-only palette.
 */
export const CommandFilterSearch: Story = {
  render: () => (
    <StoryFrame width="md">
      <div className="afenda-docs-preview">
        <StorybookCommandFilterSearch />
      </div>
    </StoryFrame>
  ),
};

/** Dialog open by default — verify filter sections and checkbox toggles. */
export const DefaultOpen: Story = {
  render: () => (
    <StoryFrame width="md">
      <div className="afenda-docs-preview">
        <StorybookCommandFilterSearch defaultOpen />
      </div>
    </StoryFrame>
  ),
};

/** Custom ERP fixture — foundation delivery modules only. */
export const FoundationModulesOnly: Story = {
  render: () => (
    <StoryFrame width="md">
      <div className="afenda-docs-preview">
        <StorybookCommandFilterSearch
          defaultOpen
          erpSurfaces={[]}
          foundationModules={COMMAND_FILTER_FOUNDATION_MODULES.slice(0, 5)}
        />
      </div>
    </StoryFrame>
  ),
};

/**
 * VsPrimitiveWorkflow — points to the governed primitive story equivalent.
 *
 * Primitives/Command → ERP — Workflow Command Palette uses cmdk without nested form controls.
 */
export const VsPrimitiveWorkflow: Story = {
  render: () => (
    <StoryFrame width="lg">
      <div className="afenda-docs-preview">
        <StoryStack gap="lg">
          <StorybookCommandFilterSearch
            erpSurfaces={[...COMMAND_FILTER_ERP_SURFACES.slice(0, 2)]}
            foundationModules={[
              ...COMMAND_FILTER_FOUNDATION_MODULES.slice(0, 3),
            ]}
          />
          <p className="text-muted-foreground text-sm">
            Cmdk-only workflow palette: Primitives / Command → ERP — Workflow
            Command Palette
          </p>
        </StoryStack>
      </div>
    </StoryFrame>
  ),
};
