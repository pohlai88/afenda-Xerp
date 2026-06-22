import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import {
  StatisticsLineTrendsCard,
  type StatisticsLineTrendsCardGovernedComponents,
} from "./shadcn-studio/blocks/statistics-line-trends-card";
import {
  DEFAULT_STATISTICS_LINE_TRENDS_LABEL,
  defaultStatisticsLineTrendsCards,
} from "./shadcn-studio/data/statistics-line-trends.data";

function StatisticsLineTrendsPreview() {
  return (
    <section
      aria-label={DEFAULT_STATISTICS_LINE_TRENDS_LABEL}
      className="app-shell-statistics-trend-section"
    >
      <div className="app-shell-statistics-trend-grid">
        {defaultStatisticsLineTrendsCards.map((card) => (
          <StatisticsLineTrendsCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}

const meta = {
  title: "ERP/ApplicationShell/Statistics/Line Trends",
  component: StatisticsLineTrendsPreview,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Governed adaptation of shadcn/studio `statistics-component-21` — dual-series metric cards with inline totals and compact line charts. Uses `@afenda/ui` Card + Chart primitives without consumer `className` (TIP-004); layout chrome lives in `afenda-appshell.css`.",
      },
    },
  },
} satisfies Meta<typeof StatisticsLineTrendsPreview>;

export type StatisticsLineTrendsCardStoriesGovernedComponents =
  StatisticsLineTrendsCardGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
