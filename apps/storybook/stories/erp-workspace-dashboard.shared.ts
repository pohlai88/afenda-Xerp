import {
  ERP_WORKSPACE_DASHBOARD_PAGE_COPY,
  ErpWorkspaceDashboardPageSample,
  STORYBOOK_TIER_A_V1_WIDGET_IDS,
} from "@afenda/shadcn-studio/lab";
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

export const erpWorkspaceDashboardStoryTitle =
  "Presentation Lab/ERP Workspace Dashboard";

export const erpWorkspaceDashboardMeta = {
  title: erpWorkspaceDashboardStoryTitle,
  component: ErpWorkspaceDashboardPageSample,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Full ERP workspace home with AppShell and Tier A v1 dashboard grid (six MCP blocks). Compare AdminCN baseline vs scoped noir CSS staging.",
      },
    },
    globals: {
      theme: "light",
    },
    layout: "fullscreen",
    shadcnStudioPreset: "default",
  },
} satisfies Meta<typeof ErpWorkspaceDashboardPageSample>;

interface StoryCanvas {
  getByRole: (
    role: string,
    options?: { level?: number; name?: string | RegExp }
  ) => HTMLElement;
  getByTestId: (testId: string) => HTMLElement;
  getByText: (text: string | RegExp) => HTMLElement;
}

export async function runErpWorkspaceDashboardSmoke(
  canvas: StoryCanvas
): Promise<void> {
  await expect(
    canvas.getByRole("heading", {
      level: 1,
      name: ERP_WORKSPACE_DASHBOARD_PAGE_COPY.page.title,
    })
  ).toBeVisible();

  await expect(
    canvas.getByText(ERP_WORKSPACE_DASHBOARD_PAGE_COPY.page.description)
  ).toBeVisible();

  await expect(canvas.getByRole("link", { name: "Workspace" })).toBeVisible();

  for (const widgetId of STORYBOOK_TIER_A_V1_WIDGET_IDS) {
    await expect(
      canvas.getByTestId(`workspace-widget-${widgetId}`)
    ).toBeVisible();
  }
}

export type ErpWorkspaceDashboardStory = StoryObj<
  typeof erpWorkspaceDashboardMeta
>;
