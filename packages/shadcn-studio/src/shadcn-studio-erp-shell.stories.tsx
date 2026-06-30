import type { Meta, StoryObj } from "@storybook/react";

import { ErpDashboardShell } from "./components/erp-shell/erp-dashboard-shell.js";
import { ErpPresentationProviders } from "./theme/erp-presentation-providers.js";
import {
  shadcnStudioFullscreenLayout,
  shadcnStudioStoryA11y,
} from "./_storybook/story-parameters.js";

const sampleNavGroups = [
  {
    label: "Platform",
    items: [
      {
        href: "/metadata-workspace",
        label: "Metadata Workspace",
        isActive: true,
      },
    ],
  },
  {
    label: "System Admin",
    items: [
      { href: "/system-admin/users", label: "Users" },
      { href: "/system-admin/roles", label: "Roles" },
    ],
  },
] as const;

const sampleOperatingContext = {
  tenantLabel: "Acme Holdings",
  legalEntityLabel: "Acme US LLC",
  workspaceLabel: "Acme US LLC · Operations",
} as const;

const meta: Meta<typeof ErpDashboardShell> = {
  title: "Shadcn Studio/ERP Shell",
  component: ErpDashboardShell,
  tags: ["autodocs"],
  parameters: {
    ...shadcnStudioFullscreenLayout,
    a11y: shadcnStudioStoryA11y,
  },
  decorators: [
    (Story) => (
      <ErpPresentationProviders>
        <Story />
      </ErpPresentationProviders>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const OperatorDashboardShell: Story = {
  args: {
    navGroups: sampleNavGroups,
    operatingContext: sampleOperatingContext,
    children: (
      <div className="rounded-lg border bg-card p-6 text-card-foreground">
        <h2 className="font-semibold text-lg">Shell content region</h2>
        <p className="text-muted-foreground text-sm">
          Protected ERP routes render inside this inset panel.
        </p>
      </div>
    ),
  },
};
