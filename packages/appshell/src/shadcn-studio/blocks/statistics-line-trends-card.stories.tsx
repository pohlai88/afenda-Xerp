import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  compactDensityDecorator,
  renderDashboardBlockStory,
} from "../../_storybook/dashboard-block-story.compositions";
import { defaultStatisticsLineTrendsCards } from "../data/statistics-line-trends.data";
import {
  StatisticsLineTrendsCard,
  type StatisticsLineTrendsCardGovernedComponents,
} from "./statistics-line-trends-card";
import {
  createDashboardBlockMeta,
  dashboardBlockDarkThemeGlobals,
} from "../../_storybook/dashboard-block-story.shared";
import type { StatisticsLineTrendsCardProps } from "./statistics-line-trends-card";

function resolveLineTrendsCard(
  title: StatisticsLineTrendsCardProps["title"]
): StatisticsLineTrendsCardProps {
  const card = defaultStatisticsLineTrendsCards.find(
    (entry) => entry.title === title
  );
  if (card === undefined) {
    throw new Error(`Missing line trends card fixture: ${title}`);
  }

  return card;
}

const defaultCard = defaultStatisticsLineTrendsCards[0];
if (defaultCard === undefined) {
  throw new Error("Expected at least one line trends card fixture.");
}

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Blocks/Statistics/LineTrendsCard",
    component: StatisticsLineTrendsCard,
    args: defaultCard,
  }),
  render: (args) => renderDashboardBlockStory(StatisticsLineTrendsCard, args),
} satisfies Meta<typeof StatisticsLineTrendsCard>;

export type LineTrendsCardStoriesGovernedComponents =
  StatisticsLineTrendsCardGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Orders line trend — dual series legend, tabular-nums metric values.",
      },
    },
  },
};

export const Revenue: Story = {
  args: resolveLineTrendsCard("Revenue"),
  parameters: {
    docs: {
      description: {
        story: "Revenue comparison card with larger magnitude series values.",
      },
    },
  },
};

export const DarkTheme: Story = {
  globals: dashboardBlockDarkThemeGlobals,
};

export const Compact: Story = {
  decorators: [compactDensityDecorator],
};
