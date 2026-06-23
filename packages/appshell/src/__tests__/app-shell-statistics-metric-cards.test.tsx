import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatisticsActivityCard } from "../shadcn-studio/blocks/statistics-activity-card";
import { StatisticsLeadsCard } from "../shadcn-studio/blocks/statistics-leads-card";
import { StatisticsLineTrendsCard } from "../shadcn-studio/blocks/statistics-line-trends-card";
import { StatisticsProfileTrafficCard } from "../shadcn-studio/blocks/statistics-profile-traffic-card";
import { StatisticsRevenueCard } from "../shadcn-studio/blocks/statistics-revenue-card";
import { defaultStatisticsLineTrendsCards } from "../shadcn-studio/data/statistics-line-trends.data";

describe("statistics metric cards accessibility", () => {
  it.each([
    {
      Component: StatisticsRevenueCard,
      title: "Revenue growth",
      change: "+15%",
    },
    {
      Component: StatisticsLeadsCard,
      title: "Generated leads",
      change: "+18.2%",
    },
    { Component: StatisticsActivityCard, title: "Activity", change: "+38%" },
    {
      Component: StatisticsProfileTrafficCard,
      title: "Average profile traffic",
      change: "+15%",
    },
  ])("$title links amount to change footnote", ({
    Component,
    title,
    change,
  }) => {
    render(<Component />);

    expect(screen.getByRole("article", { name: title })).toBeInTheDocument();

    const changeNode = screen.getByText(change);
    const amountNode = changeNode
      .closest(".app-shell-statistics-metric-value-stack")
      ?.querySelector(".app-shell-statistics-metric-amount");

    expect(amountNode).toHaveAttribute("aria-describedby");
    expect(changeNode.id).toBe(amountNode?.getAttribute("aria-describedby"));
  });

  it("line trends card exposes titled article and labelled series values", () => {
    const card = defaultStatisticsLineTrendsCards[0];
    if (card === undefined) {
      throw new Error("Expected default line trends card fixture.");
    }

    render(<StatisticsLineTrendsCard {...card} />);

    expect(
      screen.getByRole("article", { name: "Daily orders" })
    ).toBeInTheDocument();
    expect(screen.getByText("This week")).toHaveAttribute("id");
    expect(screen.getByText("574")).toHaveAttribute("aria-labelledby");
  });
});
