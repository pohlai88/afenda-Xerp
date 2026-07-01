import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import StatisticsActivityCardBlock from "../components-layouts/statistics-activity-card.js";
import StatisticsLeadsCardBlock from "../components-layouts/statistics-leads-card.js";
import StatisticsProfileTrafficCardBlock from "../components-layouts/statistics-profile-traffic-card.js";
import StatisticsRevenueCardBlock from "../components-layouts/statistics-revenue-card.js";
import {
  STATISTICS_ACTIVITY_CHART_DATA,
  STATISTICS_LEADS_CHART_DATA,
  STATISTICS_PROFILE_TRAFFIC_CHART_DATA,
  STATISTICS_REVENUE_CHART_DATA,
} from "../storybook/block-flat-story-fixtures.js";

/**
 * PAS-005A B42k — MCP statistics blocks expose article + footnote a11y contract
 * required for appshell delegating flip.
 */
describe("statistics metric MCP blocks a11y contract (B42k)", () => {
  it.each([
    {
      block: (
        <StatisticsRevenueCardBlock
          amount="$3,234"
          changePercentage={15}
          chartData={[...STATISTICS_REVENUE_CHART_DATA]}
          title="Revenue growth"
        />
      ),
      title: "Revenue growth",
      amount: "$3,234",
      change: "+15%",
    },
    {
      block: (
        <StatisticsLeadsCardBlock
          amount="4,350"
          changePercentage={18.2}
          chartCenterLabel="$23K"
          chartData={[...STATISTICS_LEADS_CHART_DATA]}
          title="Generated leads"
        />
      ),
      title: "Generated leads",
      amount: "4,350",
      change: "+18.2%",
    },
    {
      block: (
        <StatisticsActivityCardBlock
          amount="82%"
          changePercentage={38}
          chartData={[...STATISTICS_ACTIVITY_CHART_DATA]}
          title="Activity"
        />
      ),
      title: "Activity",
      amount: "82%",
      change: "+38%",
    },
    {
      block: (
        <StatisticsProfileTrafficCardBlock
          amount="2.84k"
          changePercentage={15}
          chartData={[...STATISTICS_PROFILE_TRAFFIC_CHART_DATA]}
          title="Average profile traffic"
        />
      ),
      title: "Average profile traffic",
      amount: "2.84k",
      change: "+15%",
    },
  ])("$title exposes article with amount described by change footnote", ({
    block,
    title,
    amount,
    change,
  }) => {
    render(block);

    expect(screen.getByRole("article", { name: title })).toBeInTheDocument();
    expect(screen.getByText(amount)).toHaveAttribute("aria-describedby");

    const changeNode = screen.getByText(change);
    const amountNode = screen.getByText(amount);
    expect(changeNode.id).toBe(amountNode.getAttribute("aria-describedby"));
  });
});
