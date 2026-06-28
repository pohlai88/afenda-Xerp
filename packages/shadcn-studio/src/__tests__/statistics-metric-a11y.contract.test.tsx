import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import StatisticsActivityCardBlock from "../components/shadcn-studio/blocks/statistics-activity-card.js";
import StatisticsLeadsCardBlock from "../components/shadcn-studio/blocks/statistics-leads-card.js";
import StatisticsProfileTrafficCardBlock from "../components/shadcn-studio/blocks/statistics-profile-traffic-card.js";
import StatisticsRevenueCardBlock from "../components/shadcn-studio/blocks/statistics-revenue-card.js";

/**
 * PAS-005A B42k — MCP statistics blocks expose article + footnote a11y contract
 * required for appshell delegating flip.
 */
describe("statistics metric MCP blocks a11y contract (B42k)", () => {
  it.each([
    {
      Block: StatisticsRevenueCardBlock,
      title: "Revenue growth",
      amount: "$3,234",
      change: "+15%",
    },
    {
      Block: StatisticsLeadsCardBlock,
      title: "Generated leads",
      amount: "4,350",
      change: "+18.2%",
    },
    {
      Block: StatisticsActivityCardBlock,
      title: "Activity",
      amount: "82%",
      change: "+38%",
    },
    {
      Block: StatisticsProfileTrafficCardBlock,
      title: "Average profile traffic",
      amount: "2.84k",
      change: "+15%",
    },
  ])("$title exposes article with amount described by change footnote", ({
    Block,
    title,
    amount,
    change,
  }) => {
    render(<Block />);

    expect(screen.getByRole("article", { name: title })).toBeInTheDocument();
    expect(screen.getByText(amount)).toHaveAttribute("aria-describedby");

    const changeNode = screen.getByText(change);
    const amountNode = screen.getByText(amount);
    expect(changeNode.id).toBe(amountNode.getAttribute("aria-describedby"));
  });
});
