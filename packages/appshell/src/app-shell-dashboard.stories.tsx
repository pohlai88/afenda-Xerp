import type { Meta, StoryObj } from "@storybook/react";

import {
  DASHBOARD_STORY_BASE_ARGS,
  FINANCE_DASHBOARD_ARGS,
  FINANCE_GATED_DASHBOARD_ARGS,
  MODERN_DASHBOARD_ARGS,
} from "./_storybook/app-shell-dashboard-story.fixtures";
import {
  renderDashboardStory,
  renderEmptyInvoicesBlockStory,
  renderEmptyRegionalSalesBlockStory,
} from "./_storybook/app-shell-dashboard-story.compositions";
import {
  ApplicationShellDashboardDemo,
  type ApplicationShellDashboardDemoProps,
} from "./dashboard";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { compactDensityDecorator } from "./_storybook/dashboard-block-story.compositions";

const meta = {
  title: "ERP/ApplicationShell/Dashboard",
  component: ApplicationShellDashboardDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Governed ERP overview dashboard from `@afenda/appshell/dashboard`. Readonly canvas with 14 independently placed registry widgets (one metric card per grid cell). See Dashboard Canvas stories for edit mode and drag-resize.",
      },
    },
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  args: DASHBOARD_STORY_BASE_ARGS,
  render: renderDashboardStory,
  argTypes: {
    dashboardLabel: {
      control: "text",
      description: "Accessible region label for the dashboard surface.",
    },
    showReadonlyPreviewLabel: {
      control: "boolean",
      description: "When true, shows the readonly preview badge above the canvas.",
    },
    renderContext: { control: false },
  },
} satisfies Meta<ApplicationShellDashboardDemoProps>;

/** Governed primitives referenced across dashboard widgets (TIP-004 traceability). */
export type ApplicationShellDashboardStoriesGovernedComponents = Extract<
  GovernedUiComponentName,
  | "Avatar"
  | "Badge"
  | "Button"
  | "Card"
  | "Chart"
  | "Checkbox"
  | "DropdownMenu"
  | "InputGroup"
  | "Label"
  | "Pagination"
  | "Progress"
  | "Select"
  | "Separator"
  | "Table"
  | "Tooltip"
>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Full ERP overview on the governed readonly canvas. */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Default canvas with all 14 registry widgets — each KPI, sparkline, chart, and table is an independent grid cell.",
      },
    },
  },
};

/** Isolated widget review without ApplicationShell dependency. */
export const WidgetsOnly: Story = {
  render: renderDashboardStory,
  parameters: {
    docs: {
      description: {
        story:
          "Canvas-only review surface — widgets render without shell chrome.",
      },
    },
  },
};

/** Modern layout — registry widgets on the governed canvas. */
export const Modern: Story = {
  args: MODERN_DASHBOARD_ARGS,
  parameters: {
    docs: {
      description: {
        story: "Recommended production layout on the readonly dashboard canvas.",
      },
    },
  },
};

/** Finance close context — relabelled region. */
export const FinanceControlTower: Story = {
  args: FINANCE_DASHBOARD_ARGS,
  parameters: {
    docs: {
      description: {
        story:
          "Finance controller review — custom dashboard label while keeping the governed widget set.",
      },
    },
  },
};

/** Breakdown widgets visible; finance-gated tables hidden. */
export const FinanceGated: Story = {
  args: FINANCE_GATED_DASHBOARD_ARGS,
  parameters: {
    docs: {
      description: {
        story:
          "Capability-only render context — module earnings and regional sales remain; invoice, payment, and transaction widgets are hidden.",
      },
    },
  },
};

/** Empty receivables — invoice table rich empty state. */
export const EmptyInvoices: Story = {
  render: renderEmptyInvoicesBlockStory,
  parameters: {
    docs: {
      description: {
        story:
          "Accounts receivable block with no rows — validates bulk actions, sorting chrome, and the governed empty state.",
      },
    },
  },
};

/** Empty regional sales — ranked list empty state and summary insights. */
export const EmptyRegionalSales: Story = {
  render: renderEmptyRegionalSalesBlockStory,
  parameters: {
    docs: {
      description: {
        story:
          "Regional revenue block with no rows — validates ranked list empty state and summary insight copy.",
      },
    },
  },
};

export const DarkTheme: Story = {
  args: MODERN_DASHBOARD_ARGS,
  globals: {
    theme: "dark",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Review dashboard widgets under dark Afenda tokens. Toggle the Theme toolbar to compare light and dark.",
      },
    },
  },
};

export const Compact: Story = {
  args: MODERN_DASHBOARD_ARGS,
  decorators: [compactDensityDecorator],
};

export const Tablet: Story = {
  args: MODERN_DASHBOARD_ARGS,
  parameters: {
    viewport: { defaultViewport: "tablet" },
    docs: {
      description: {
        story:
          "Responsive react-grid-layout canvas at tablet width — widgets reflow per breakpoint presets.",
      },
    },
  },
};

export const Desktop: Story = {
  args: MODERN_DASHBOARD_ARGS,
  parameters: {
    viewport: { defaultViewport: "desktop" },
    docs: {
      description: {
        story:
          "Full desktop layout — independently sized widget cells with expanded table chrome.",
      },
    },
  },
};
