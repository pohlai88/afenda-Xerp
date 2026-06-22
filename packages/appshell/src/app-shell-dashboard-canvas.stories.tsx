import type { Meta, StoryObj } from "@storybook/react";

import { ApplicationShellDashboardCanvas } from "./dashboard/app-shell-dashboard-canvas.client";
import {
  renderDashboardCanvasInShellStory,
} from "./_storybook/app-shell-dashboard-story.compositions";
import { ERP_STORY_BASE_ARGS } from "./_storybook/app-shell-story.fixtures";
import { ApplicationShell } from "./app-shell";

const meta = {
  title: "ERP/ApplicationShell/Dashboard Canvas",
  component: ApplicationShellDashboardCanvas,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Governed dashboard canvas from `@afenda/appshell/dashboard`. Supports edit and readonly modes, capability-aware widget resolution, and versioned layout presets.",
      },
    },
  },
  args: {
    editMode: false,
  },
} satisfies Meta<typeof ApplicationShellDashboardCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CanvasReadonly: Story = {
  render: () => (
    <ApplicationShell {...ERP_STORY_BASE_ARGS}>
      <ApplicationShellDashboardCanvas
        editMode={false}
        showReadonlyPreviewLabel
      />
    </ApplicationShell>
  ),
};

export const CanvasEditable: Story = {
  render: () =>
    renderDashboardCanvasInShellStory(ERP_STORY_BASE_ARGS, { editMode: true }),
};

export const Mobile: Story = {
  render: () =>
    renderDashboardCanvasInShellStory(ERP_STORY_BASE_ARGS, { editMode: true }),
  parameters: {
    viewport: { defaultViewport: "mobile" },
  },
};

export const Tablet: Story = {
  render: () =>
    renderDashboardCanvasInShellStory(ERP_STORY_BASE_ARGS, { editMode: false }),
  parameters: {
    viewport: { defaultViewport: "tablet" },
  },
};

export const DarkTheme: Story = {
  render: () =>
    renderDashboardCanvasInShellStory(ERP_STORY_BASE_ARGS, { editMode: false }),
  globals: {
    theme: "dark",
  },
};
