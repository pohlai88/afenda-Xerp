import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltipContent,
} from "../../index";
import {
  expectGovernedDataAuthority,
  expectGovernedPrimitive,
} from "../helpers/governance-assertions";

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--primary)" },
} as const;

describe("Chart governance", () => {
  it("keeps governed data attributes authoritative on ChartContainer", () => {
    render(
      <ChartContainer
        config={chartConfig}
        data-chart="override"
        data-component="Override"
        data-slot="override"
        data-state="fake"
        data-testid="chart-root"
        id="revenue"
      >
        <div aria-hidden="true">Chart body</div>
      </ChartContainer>
    );

    const root = screen.getByTestId("chart-root");

    expect(root).toHaveAttribute("data-chart", "chart-revenue");
    expectGovernedDataAuthority(root, {
      "data-component": "Chart",
      "data-recipe": "surface",
      "data-slot": "chart",
      "data-state": "ready",
    });
    expectGovernedPrimitive(root, {
      component: "Chart",
      slot: "chart",
      recipe: "surface",
      state: "ready",
    });
  });

  it("applies governed state to the chart root", () => {
    render(
      <ChartContainer
        config={chartConfig}
        data-testid="chart-root"
        state="loading"
      >
        <div aria-hidden="true">Chart body</div>
      </ChartContainer>
    );

    expect(screen.getByTestId("chart-root")).toHaveAttribute(
      "data-state",
      "loading"
    );
  });

  it("forwards ref to the chart container root", () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <ChartContainer config={chartConfig} ref={ref}>
        <div aria-hidden="true">Chart body</div>
      </ChartContainer>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders governed tooltip rows when active", () => {
    render(
      <ChartContainer config={chartConfig}>
        <ChartTooltipContent
          active
          indicator="dot"
          payload={[
            {
              color: "var(--primary)",
              dataKey: "revenue",
              name: "revenue",
              payload: {},
              type: undefined,
              value: 420_000,
            },
          ]}
        />
      </ChartContainer>
    );

    expect(screen.getByText("420,000")).toHaveAttribute(
      "data-slot",
      "chart-tooltip"
    );
    expect(
      document.querySelector('[data-slot="chart-tooltip-row"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="chart-tooltip-indicator"]')
    ).toBeInTheDocument();
  });

  it("returns null when tooltip is inactive", () => {
    render(
      <ChartContainer config={chartConfig}>
        <ChartTooltipContent
          active={false}
          payload={[
            {
              color: "var(--primary)",
              dataKey: "revenue",
              name: "revenue",
              payload: {},
              type: undefined,
              value: 420_000,
            },
          ]}
        />
      </ChartContainer>
    );

    expect(screen.queryByText("420,000")).not.toBeInTheDocument();
  });

  it("renders governed legend items with slot keys", () => {
    render(
      <ChartContainer config={chartConfig}>
        <ChartLegendContent
          payload={[
            {
              color: "var(--primary)",
              dataKey: "revenue",
              type: undefined,
              value: "revenue",
            },
          ]}
        />
      </ChartContainer>
    );

    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });

  it("exposes displayName on chart subcomponents", () => {
    expect(ChartContainer.displayName).toBe("ChartContainer");
    expect(ChartTooltipContent.displayName).toBe("ChartTooltipContent");
    expect(ChartLegendContent.displayName).toBe("ChartLegendContent");
  });
});
