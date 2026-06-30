import type { Meta, StoryObj } from "@storybook/react";

import { createFlatBlockStoryPairs } from "./_storybook/block-flat-story.helpers.js";
import { FLAT_BLOCK_STORY_REGISTRY } from "./_storybook/block-flat-story.registry.js";
import { shadcnStudioThemeDecorator } from "./_storybook/shadcn-studio-theme.decorator.js";
import {
  shadcnStudioBlockDocs,
  shadcnStudioCenteredLayout,
  shadcnStudioStoryA11y,
} from "./_storybook/story-parameters.js";

const meta = {
  title: "Shadcn Studio/Blocks Flat",
  tags: ["autodocs"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    docs: {
      description: {
        component:
          "Curated CSF3 stories for prop-driven MCP flat blocks (manualStoryRequired manifest). Fixtures live in _storybook/block-flat-story.compositions.tsx.",
      },
    },
    a11y: shadcnStudioStoryA11y,
  },
  decorators: [shadcnStudioThemeDecorator],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function storyPair(
  storyName: (typeof FLAT_BLOCK_STORY_REGISTRY)[number]["storyName"]
) {
  const entry = FLAT_BLOCK_STORY_REGISTRY.find(
    (row) => row.storyName === storyName
  );

  if (!entry) {
    throw new Error(`Missing flat block story registry entry: ${storyName}`);
  }

  return createFlatBlockStoryPairs(entry);
}

export const ChartEarningReport: Story = storyPair("ChartEarningReport").light;
export const ChartEarningReportDark: Story =
  storyPair("ChartEarningReport").dark;

export const ChartSalesMetrics: Story = storyPair("ChartSalesMetrics").light;
export const ChartSalesMetricsDark: Story = storyPair("ChartSalesMetrics").dark;

export const ChartTotalRevenue: Story = storyPair("ChartTotalRevenue").light;
export const ChartTotalRevenueDark: Story = storyPair("ChartTotalRevenue").dark;

export const DashboardDialog03: Story = storyPair("DashboardDialog03").light;
export const DashboardDialog03Dark: Story = storyPair("DashboardDialog03").dark;

export const DashboardDialog09: Story = storyPair("DashboardDialog09").light;
export const DashboardDialog09Dark: Story = storyPair("DashboardDialog09").dark;

export const DatatableInvoice: Story = storyPair("DatatableInvoice").light;
export const DatatableInvoiceDark: Story = storyPair("DatatableInvoice").dark;

export const DialogActivity: Story = storyPair("DialogActivity").light;
export const DialogActivityDark: Story = storyPair("DialogActivity").dark;

export const DialogSearch: Story = storyPair("DialogSearch").light;
export const DialogSearchDark: Story = storyPair("DialogSearch").dark;

export const DropdownLanguage: Story = storyPair("DropdownLanguage").light;
export const DropdownLanguageDark: Story = storyPair("DropdownLanguage").dark;

export const DropdownNotification: Story = storyPair(
  "DropdownNotification"
).light;
export const DropdownNotificationDark: Story = storyPair(
  "DropdownNotification"
).dark;

export const DropdownProfile: Story = storyPair("DropdownProfile").light;
export const DropdownProfileDark: Story = storyPair("DropdownProfile").dark;

export const MenuTrigger: Story = storyPair("MenuTrigger").light;
export const MenuTriggerDark: Story = storyPair("MenuTrigger").dark;

export const SidebarUserDropdown: Story = storyPair(
  "SidebarUserDropdown"
).light;
export const SidebarUserDropdownDark: Story = storyPair(
  "SidebarUserDropdown"
).dark;

export const StatisticsActivityCard: Story = storyPair(
  "StatisticsActivityCard"
).light;
export const StatisticsActivityCardDark: Story = storyPair(
  "StatisticsActivityCard"
).dark;

export const StatisticsCard01: Story = storyPair("StatisticsCard01").light;
export const StatisticsCard01Dark: Story = storyPair("StatisticsCard01").dark;

export const StatisticsCard02: Story = storyPair("StatisticsCard02").light;
export const StatisticsCard02Dark: Story = storyPair("StatisticsCard02").dark;

export const StatisticsCard03: Story = storyPair("StatisticsCard03").light;
export const StatisticsCard03Dark: Story = storyPair("StatisticsCard03").dark;

export const StatisticsCard04: Story = storyPair("StatisticsCard04").light;
export const StatisticsCard04Dark: Story = storyPair("StatisticsCard04").dark;

export const StatisticsExpenseCard: Story = storyPair(
  "StatisticsExpenseCard"
).light;
export const StatisticsExpenseCardDark: Story = storyPair(
  "StatisticsExpenseCard"
).dark;

export const StatisticsIncomeCard: Story = storyPair(
  "StatisticsIncomeCard"
).light;
export const StatisticsIncomeCardDark: Story = storyPair(
  "StatisticsIncomeCard"
).dark;

export const StatisticsLeadsCard: Story = storyPair(
  "StatisticsLeadsCard"
).light;
export const StatisticsLeadsCardDark: Story = storyPair(
  "StatisticsLeadsCard"
).dark;

export const StatisticsLineTrendsCard: Story = storyPair(
  "StatisticsLineTrendsCard"
).light;
export const StatisticsLineTrendsCardDark: Story = storyPair(
  "StatisticsLineTrendsCard"
).dark;

export const StatisticsOrdersProgressCard: Story = storyPair(
  "StatisticsOrdersProgressCard"
).light;
export const StatisticsOrdersProgressCardDark: Story = storyPair(
  "StatisticsOrdersProgressCard"
).dark;

export const StatisticsProfileTrafficCard: Story = storyPair(
  "StatisticsProfileTrafficCard"
).light;
export const StatisticsProfileTrafficCardDark: Story = storyPair(
  "StatisticsProfileTrafficCard"
).dark;

export const StatisticsRevenueCard: Story = storyPair(
  "StatisticsRevenueCard"
).light;
export const StatisticsRevenueCardDark: Story = storyPair(
  "StatisticsRevenueCard"
).dark;

export const StatisticsSalesOverviewCard: Story = storyPair(
  "StatisticsSalesOverviewCard"
).light;
export const StatisticsSalesOverviewCardDark: Story = storyPair(
  "StatisticsSalesOverviewCard"
).dark;

export const StatisticsTrendCard: Story = storyPair(
  "StatisticsTrendCard"
).light;
export const StatisticsTrendCardDark: Story = storyPair(
  "StatisticsTrendCard"
).dark;

export const WidgetPaymentHistory: Story = storyPair(
  "WidgetPaymentHistory"
).light;
export const WidgetPaymentHistoryDark: Story = storyPair(
  "WidgetPaymentHistory"
).dark;

export const WidgetSalesByCountries: Story = storyPair(
  "WidgetSalesByCountries"
).light;
export const WidgetSalesByCountriesDark: Story = storyPair(
  "WidgetSalesByCountries"
).dark;

export const WidgetTotalEarning: Story = storyPair("WidgetTotalEarning").light;
export const WidgetTotalEarningDark: Story =
  storyPair("WidgetTotalEarning").dark;

export const WidgetTransactions: Story = storyPair("WidgetTransactions").light;
export const WidgetTransactionsDark: Story =
  storyPair("WidgetTransactions").dark;

/** Registry count guard — visible in Storybook docs for lab operators. */
export const FlatBlockCatalog: Story = {
  render: () => (
    <p className="text-muted-foreground text-sm">
      {FLAT_BLOCK_STORY_REGISTRY.length} curated flat blocks · see{" "}
      <code>block-story-manifest.generated.json</code>
    </p>
  ),
  parameters: {
    docs: {
      description: {
        story: shadcnStudioBlockDocs.component,
      },
    },
  },
};
