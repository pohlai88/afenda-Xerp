import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { ApplicationShell } from "./app-shell";
import { ApplicationShellDashboardCanvas } from "./dashboard/app-shell-dashboard-canvas.client";
import {
  renderDashboardCanvasInShellStory,
  renderDashboardCanvasStory,
} from "./_storybook/app-shell-dashboard-story.compositions";
import {
  DASHBOARD_STORY_BASE_ARGS,
  FINANCE_GATED_DASHBOARD_ARGS,
} from "./_storybook/app-shell-dashboard-story.fixtures";
import { ERP_STORY_BASE_ARGS } from "./_storybook/app-shell-story.fixtures";
import { compactDensityDecorator } from "./_storybook/dashboard-block-story.compositions";

const meta = {
  title: "ERP/ApplicationShell/Dashboard Canvas",
  component: ApplicationShellDashboardCanvas,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Governed dashboard canvas from `@afenda/appshell/dashboard`. Each registry widget occupies one grid cell with independent drag-resize in edit mode. Supports capability-aware widget resolution and versioned layout presets.",
      },
    },
  },
  args: {
    editMode: false,
    ...DASHBOARD_STORY_BASE_ARGS,
  },
} satisfies Meta<typeof ApplicationShellDashboardCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WidgetsOnly: Story = {
  render: () =>
    renderDashboardCanvasStory({
      editMode: true,
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
  parameters: {
    docs: {
      description: {
        story:
          "Canvas without ApplicationShell — fastest path for widget grid QA.",
      },
    },
  },
};

export const CanvasReadonly: Story = {
  render: () =>
    renderDashboardCanvasInShellStory(ERP_STORY_BASE_ARGS, {
      editMode: false,
      showReadonlyPreviewLabel: true,
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
};

export const CanvasEditable: Story = {
  render: () =>
    renderDashboardCanvasInShellStory(ERP_STORY_BASE_ARGS, {
      editMode: true,
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
};

export const FinanceGated: Story = {
  render: () =>
    renderDashboardCanvasStory({
      editMode: false,
      ...FINANCE_GATED_DASHBOARD_ARGS,
    }),
  parameters: {
    docs: {
      description: {
        story:
          "Finance permission-gated widgets hidden — validates capability-only render context on the canvas.",
      },
    },
  },
};

export const EmptyCanvas: Story = {
  render: () =>
    renderDashboardCanvasStory({
      editMode: false,
      layout: { version: 1, columns: 12, rowHeight: 80, items: [] },
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
  parameters: {
    docs: {
      description: {
        story:
          "Zero layout items — aria-live empty state region with status copy.",
      },
    },
  },
};

export const Mobile: Story = {
  render: () =>
    renderDashboardCanvasInShellStory(ERP_STORY_BASE_ARGS, {
      editMode: true,
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
  parameters: {
    viewport: { defaultViewport: "mobile" },
  },
};

export const Tablet: Story = {
  render: () =>
    renderDashboardCanvasInShellStory(ERP_STORY_BASE_ARGS, {
      editMode: false,
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
  parameters: {
    viewport: { defaultViewport: "tablet" },
  },
};

export const Compact: Story = {
  render: () =>
    renderDashboardCanvasStory({
      editMode: false,
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
  decorators: [compactDensityDecorator],
};

export const DarkTheme: Story = {
  render: () =>
    renderDashboardCanvasInShellStory(ERP_STORY_BASE_ARGS, {
      editMode: false,
      ...DASHBOARD_STORY_BASE_ARGS,
    }),
  globals: {
    theme: "dark",
  },
};
