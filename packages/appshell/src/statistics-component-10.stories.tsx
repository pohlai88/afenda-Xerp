import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { StatisticsActivityCard } from "./shadcn-studio/blocks/statistics-activity-card";
import { StatisticsLeadsCard } from "./shadcn-studio/blocks/statistics-leads-card";
import { StatisticsProfileTrafficCard } from "./shadcn-studio/blocks/statistics-profile-traffic-card";
import { StatisticsRevenueCard } from "./shadcn-studio/blocks/statistics-revenue-card";
import { DEFAULT_STATISTICS_COMPONENT_10_LABEL } from "./shadcn-studio/data/statistics-component-10.data";

function StatisticsComponent10Preview() {
  return (
    <section
      aria-label={DEFAULT_STATISTICS_COMPONENT_10_LABEL}
      className="app-shell-statistics-metric-section"
    >
      <div className="app-shell-statistics-metric-grid">
        <StatisticsRevenueCard />
        <StatisticsLeadsCard />
        <StatisticsActivityCard />
        <StatisticsProfileTrafficCard />
      </div>
    </section>
  );
}

const meta = {
  title: "ERP/ApplicationShell/Statistics/Component 10",
  component: StatisticsComponent10Preview,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Governed adaptation of shadcn/studio `statistics-component-10` — revenue, leads, activity, and profile traffic metric cards with embedded charts. Layout chrome in `afenda-appshell.css`; `@afenda/ui` primitives without consumer `className` (TIP-004).",
      },
    },
  },
} satisfies Meta<typeof StatisticsComponent10Preview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
