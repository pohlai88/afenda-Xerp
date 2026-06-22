import type { Meta, StoryObj } from "@storybook/react";

import type { GovernedUiComponentName } from "@afenda/ui/governance";

import { ApplicationShell } from "./app-shell";
import { DEFAULT_APPLICATION_SHELL_PROPS } from "./app-shell.types";
import {
  renderInventoryWorkspaceStory,
  storySignOutAccessory,
} from "./_storybook/app-shell-story.compositions";
import { renderDashboardInShellStory } from "./_storybook/app-shell-dashboard-story.compositions";
import {
  FINANCE_DASHBOARD_ARGS,
  MODERN_DASHBOARD_ARGS,
} from "./_storybook/app-shell-dashboard-story.fixtures";
import {
  ERP_STORY_BASE_ARGS,
  ERP_STORY_SESSION_IDENTITY,
  FINANCE_MODULE_ARGS,
  HUMAN_RESOURCES_ARGS,
  WHITE_LABEL_ARGS,
} from "./_storybook/app-shell-story.fixtures";
import React from "react";

const meta = {
  title: "ERP/ApplicationShell",
  component: ApplicationShell,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Enterprise ERP application shell from `@afenda/appshell`. Composes governed AppShell* blocks with `@afenda/ui` primitives. Shell layout uses plain HTML wrappers and `@afenda/appshell/afenda-appshell.css` (TIP-004). Visual recipe slots wire through `@afenda/ui/governance` — see ERP/ApplicationShell/Authority Preview before integration.",
      },
    },
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  args: ERP_STORY_BASE_ARGS,
  argTypes: {
    brandName: {
      control: "text",
      description: "Sidebar brand label beside the logo.",
      table: { defaultValue: { summary: DEFAULT_APPLICATION_SHELL_PROPS.brandName } },
    },
    userName: {
      control: "text",
      description:
        "Header greeting name. Falls back to `identity.displayName` when omitted.",
    },
    welcomeMessage: {
      control: "text",
      description: "Secondary header line shown from the `sm` breakpoint.",
    },
    avatarSrc: {
      control: "text",
      description: "User avatar image URL. Falls back to the default CDN avatar.",
    },
    footerBrand: {
      control: "text",
      description: 'Footer company name. Pass an empty string to hide the link.',
      table: { defaultValue: { summary: DEFAULT_APPLICATION_SHELL_PROPS.footerBrand } },
    },
    footerBrandHref: {
      control: "text",
      description: "Href for the footer brand link.",
    },
    navigationLabel: {
      control: "text",
      description: "Sidebar primary section label.",
      table: {
        defaultValue: { summary: DEFAULT_APPLICATION_SHELL_PROPS.navigationLabel },
      },
    },
    teamLabel: {
      control: "text",
      description: "Sidebar team section label.",
      table: { defaultValue: { summary: DEFAULT_APPLICATION_SHELL_PROPS.teamLabel } },
    },
    roleLabel: {
      control: "text",
      description: "Role line under the sidebar user name.",
    },
    searchTriggerLabel: {
      control: "text",
      description: "Compact label on the desktop header search trigger.",
    },
    children: {
      control: false,
      description:
        "Main workspace content. Defaults to the governed ERP overview dashboard.",
    },
    identity: { control: false },
    identityAccessory: { control: false },
    navigationPages: { control: false },
    teamRecipients: { control: false },
  },
} satisfies Meta<typeof ApplicationShell>;

/** Governed primitives referenced in ERP story compositions (TIP-004 traceability). */
export type ApplicationShellStoriesGovernedComponents = Extract<
  GovernedUiComponentName,
  "Badge" | "Button"
>;

export default meta;
type Story = StoryObj<typeof meta>;

/** ERP baseline — floating sidebar, module navigation, full overview dashboard. */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Default shell chrome with the governed ERP dashboard (sparkline metrics, KPI row, statistics metrics, line trend metrics, revenue chart, module earnings, regional sales, transactions, payment history, legacy module widgets, and accounts receivable).",
      },
    },
  },
};

/** Modern dashboard inside the shell — legacy placeholder widgets hidden. */
export const DashboardModern: Story = {
  render: (args) => renderDashboardInShellStory(args, MODERN_DASHBOARD_ARGS),
  parameters: {
    docs: {
      description: {
        story:
          "Shell chrome unchanged with the upgraded dashboard only. Use when reviewing enterprise widgets without legacy module performance rows.",
      },
    },
  },
};

/** Finance module shell with finance-tuned dashboard labels. */
export const DashboardFinance: Story = {
  args: FINANCE_MODULE_ARGS,
  render: (args) => renderDashboardInShellStory(args, FINANCE_DASHBOARD_ARGS),
  parameters: {
    docs: {
      description: {
        story:
          "Finance navigation labels plus a finance control tower dashboard — useful for period-close and controller reviews.",
      },
    },
  },
};

/** Finance controller context — module labels and search tuned for GL/AP workflows. */
export const FinanceModule: Story = {
  args: FINANCE_MODULE_ARGS,
  parameters: {
    docs: {
      description: {
        story:
          "Finance module entry — use when reviewing ledger, AP/AR, or period-close surfaces.",
      },
    },
  },
};

/** HR business partner context — people-team labels and employee search. */
export const HumanResources: Story = {
  args: HUMAN_RESOURCES_ARGS,
  parameters: {
    docs: {
      description: {
        story:
          "Human Resources workspace — directory, payroll, and time-and-attendance navigation.",
      },
    },
  },
};

/** Authenticated session — identity boundary + optional auth chrome accessory. */
export const AuthenticatedSession: Story = {
  args: {
    identity: ERP_STORY_SESSION_IDENTITY,
    welcomeMessage: "Finance · signed-in session",
    roleLabel: "Controller",
    identityAccessory: storySignOutAccessory,
  },
  render: ({ userName: _explicitUserName, ...shellProps }) => {
    void _explicitUserName;
    return <ApplicationShell {...shellProps} />;
  },
  parameters: {
    docs: {
      description: {
        story:
          "Wires `ApplicationShellIdentity` from auth boundary. `userName` is omitted so the greeting uses `identity.displayName`. Governed `Button` for auth chrome — no `className` on primitives.",
      },
    },
  },
};

/**
 * Route layout pattern — `AppShellMain` with governed page chrome inside the shell.
 * Mirrors `apps/erp` protected route composition.
 */
export const InventoryWorkspace: Story = {
  args: {
    userName: "Taylor Kim",
    welcomeMessage: "Inventory · warehouse operations",
    roleLabel: "Warehouse lead",
    searchTriggerLabel: "Search stock…",
  },
  render: renderInventoryWorkspaceStory,
  parameters: {
    docs: {
      description: {
        story:
          "Recommended ERP route pattern: shell chrome unchanged, `AppShellMain` for page title, badge, and actions.",
      },
    },
  },
};

/** White-label branding via props — no fork of shell blocks required. */
export const CustomBranding: Story = {
  args: WHITE_LABEL_ARGS,
  parameters: {
    docs: {
      description: {
        story: "Customer-specific brand, footer, and section labels from props alone.",
      },
    },
  },
};

/** Footer brand suppressed — copyright line only. */
export const MinimalFooter: Story = {
  args: {
    footerBrand: "",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass `footerBrand=\"\"` to hide the footer brand link while keeping the copyright notice.",
      },
    },
  },
};

/** Dark Afenda tokens — uses the Storybook Theme toolbar global. */
export const DarkTheme: Story = {
  globals: {
    theme: "dark",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Review shell chrome under dark design tokens. Toggle the Theme toolbar to compare light and dark.",
      },
    },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile" },
    docs: {
      description: {
        story: "Icon-rail sidebar, compact header, and mobile search trigger.",
      },
    },
  },
};

export const Tablet: Story = {
  parameters: {
    viewport: { defaultViewport: "tablet" },
    docs: {
      description: {
        story:
          "Intermediate breakpoint — greeting visible; desktop search remains icon-only until `lg`.",
      },
    },
  },
};

export const Desktop: Story = {
  parameters: {
    viewport: { defaultViewport: "desktop" },
    docs: {
      description: {
        story:
          "Full desktop layout — expanded sidebar, centred search field, and complete greeting.",
      },
    },
  },
};
