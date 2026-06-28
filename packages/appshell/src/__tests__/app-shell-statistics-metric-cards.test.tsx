import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatisticsActivityCard } from "../presentation/blocks/statistics-activity-card";
import { StatisticsLeadsCard } from "../presentation/blocks/statistics-leads-card";
import { StatisticsLineTrendsCard } from "../presentation/blocks/statistics-line-trends-card";
import { StatisticsProfileTrafficCard } from "../presentation/blocks/statistics-profile-traffic-card";
import { StatisticsRevenueCard } from "../presentation/blocks/statistics-revenue-card";
import { defaultStatisticsLineTrendsCards } from "../presentation/data/statistics-line-trends.data";

describe("statistics metric cards accessibility", () => {
  it.each([
    {
      Component: StatisticsRevenueCard,
      title: "Revenue growth",
      amount: "$3,234",
      change: "+15%",
    },
    {
      Component: StatisticsLeadsCard,
      title: "Generated leads",
      amount: "4,350",
      change: "+18.2%",
    },
    {
      Component: StatisticsActivityCard,
      title: "Activity",
      amount: "82%",
      change: "+38%",
    },
    {
      Component: StatisticsProfileTrafficCard,
      title: "Average profile traffic",
      amount: "2.84k",
      change: "+15%",
    },
  ])("$title links amount to change footnote", ({
    Component,
    title,
    amount,
    change,
  }) => {
    render(<Component />);

    expect(screen.getByRole("article", { name: title })).toBeInTheDocument();

    const changeNode = screen.getByText(change);
    const amountNode = screen.getByText(amount);

    expect(amountNode).toHaveAttribute("aria-describedby");
    expect(changeNode.id).toBe(amountNode.getAttribute("aria-describedby"));
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
