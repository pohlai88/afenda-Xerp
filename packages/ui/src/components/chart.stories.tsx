import { GOVERNED_STATES } from "@afenda/ui/governance";
import type { Meta, StoryObj } from "@storybook/react";
import { TrendingUpIcon } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { StoryFrame, StoryRow, StoryStack } from "./_storybook/story-frame";
import { Badge } from "./badge";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./chart";

const REVENUE_TREND = [
  { month: "Jan", revenue: 420_000, orders: 312 },
  { month: "Feb", revenue: 455_000, orders: 328 },
  { month: "Mar", revenue: 498_000, orders: 341 },
  { month: "Apr", revenue: 512_000, orders: 355 },
  { month: "May", revenue: 538_000, orders: 368 },
  { month: "Jun", revenue: 562_000, orders: 382 },
] as const;

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--primary)",
  },
  orders: {
    label: "Orders",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;

const meta = {
  title: "Primitives/Chart",
  component: ChartContainer,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Governed Recharts wrapper for ERP time-series and categorical metrics. Wrap charts in `ChartContainer`, use token-based `ChartConfig` colors, and provide an accessible figure label.",
      },
    },
  },
  args: {
    config: revenueChartConfig,
    children: null,
  },
  argTypes: {
    state: {
      control: "select",
      options: [...GOVERNED_STATES],
      table: { defaultValue: { summary: "ready" } },
    },
  },
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

const CHART_STORY_ARGS = {
  config: revenueChartConfig,
  children: null,
} as const;

export const GovernanceDataAuthority: Story = {
  name: "Governance — Data Authority",
  args: CHART_STORY_ARGS,
  parameters: {
    docs: {
      description: {
        story:
          'Consumer passes `data-chart="override"` and `data-state="fake"` — governed `id` and `state` must win on the container root.',
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <figure aria-label="Governed chart data authority probe">
        <ChartContainer
          config={revenueChartConfig}
          data-chart="override"
          data-state="fake"
          id="authority-probe"
          state="ready"
        >
          <AreaChart accessibilityLayer data={[...REVENUE_TREND]}>
            <XAxis dataKey="month" hide />
            <Area
              dataKey="revenue"
              fill="var(--color-revenue)"
              fillOpacity={0.15}
              stroke="var(--color-revenue)"
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </figure>
    </StoryFrame>
  ),
};

export const GovernanceStates: Story = {
  name: "Governance — All States",
  args: CHART_STORY_ARGS,
  parameters: { layout: "padded" },
  render: () => (
    <StoryStack gap="md">
      {GOVERNED_STATES.map((state) => (
        <StoryFrame key={state} width="lg">
          <p className="font-mono text-muted-foreground text-xs">
            state=&quot;{state}&quot;
          </p>
          <figure aria-label={`Chart governed state ${state}`}>
            <ChartContainer
              className="h-40 w-full"
              config={revenueChartConfig}
              state={state}
            >
              <AreaChart accessibilityLayer data={[...REVENUE_TREND]}>
                <XAxis dataKey="month" hide />
                <Area
                  dataKey="revenue"
                  fill="var(--color-revenue)"
                  fillOpacity={0.15}
                  stroke="var(--color-revenue)"
                  type="monotone"
                />
              </AreaChart>
            </ChartContainer>
          </figure>
        </StoryFrame>
      ))}
    </StoryStack>
  ),
};

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Area chart with accessible figure label and token-driven series colors.",
      },
    },
    a11y: { test: "off" },
  },
  args: CHART_STORY_ARGS,
  render: () => (
    <StoryFrame width="lg">
      <figure aria-label="Monthly revenue trend">
        <ChartContainer className="h-64 w-full" config={revenueChartConfig}>
          <AreaChart accessibilityLayer data={[...REVENUE_TREND]}>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="month"
              tickLine={false}
              tickMargin={8}
            />
            <YAxis
              axisLine={false}
              tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
              tickLine={false}
              tickMargin={8}
              width={48}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent indicator="line" nameKey="revenue" />
              }
            />
            <Area
              dataKey="revenue"
              fill="var(--color-revenue)"
              fillOpacity={0.15}
              stroke="var(--color-revenue)"
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </figure>
    </StoryFrame>
  ),
};

export const WithLegend: Story = {
  name: "Chart — With Legend",
  args: CHART_STORY_ARGS,
  render: () => (
    <StoryFrame width="lg">
      <figure aria-label="Revenue and orders comparison">
        <ChartContainer className="h-72 w-full" config={revenueChartConfig}>
          <BarChart accessibilityLayer data={[...REVENUE_TREND]}>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="month"
              tickLine={false}
              tickMargin={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              width={48}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            <Bar dataKey="orders" fill="var(--color-orders)" radius={4} />
          </BarChart>
        </ChartContainer>
      </figure>
    </StoryFrame>
  ),
};

export const ErpKpiTrend: Story = {
  name: "ERP — KPI Trend",
  args: CHART_STORY_ARGS,
  render: () => (
    <StoryFrame width="md">
      <StoryStack gap="sm">
        <StoryRow align="center" justify="between">
          <StoryStack gap="xs">
            <span className="text-muted-foreground text-xs">Revenue MTD</span>
            <span className="font-semibold text-2xl tabular-nums tracking-tight">
              $562,000
            </span>
          </StoryStack>
          <Badge emphasis="soft" size="sm" tone="success">
            <TrendingUpIcon aria-hidden="true" />
            <span className="tabular-nums">+12.4%</span>
          </Badge>
        </StoryRow>
        <figure aria-label="Revenue month-to-date sparkline">
          <ChartContainer className="h-32 w-full" config={revenueChartConfig}>
            <AreaChart accessibilityLayer data={[...REVENUE_TREND]}>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    indicator="dot"
                    nameKey="revenue"
                  />
                }
              />
              <Area
                dataKey="revenue"
                fill="var(--color-revenue)"
                fillOpacity={0.15}
                stroke="var(--color-revenue)"
                type="monotone"
              />
            </AreaChart>
          </ChartContainer>
        </figure>
        <span className="text-muted-foreground text-xs">
          Compared to prior six months · values in USD
        </span>
      </StoryStack>
    </StoryFrame>
  ),
};

export const GovernanceAccessibility: Story = {
  name: "Governance — Accessibility",
  args: CHART_STORY_ARGS,
  parameters: {
    docs: {
      description: {
        story:
          "Charts must use `<figure aria-label>` for context, token colors in `ChartConfig`, and `accessibilityLayer` on Recharts roots. Numeric tooltips use locale formatting.",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <figure aria-label="Quarterly revenue with accessible tooltip values">
        <ChartContainer className="h-64 w-full" config={revenueChartConfig}>
          <AreaChart accessibilityLayer data={[...REVENUE_TREND]}>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="month"
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    typeof value === "number" ? (
                      <span className="tabular-nums">
                        {value.toLocaleString()}
                      </span>
                    ) : (
                      value
                    )
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="revenue"
              fill="var(--color-revenue)"
              fillOpacity={0.15}
              stroke="var(--color-revenue)"
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </figure>
    </StoryFrame>
  ),
};

export const KeyboardNavigation: Story = {
  name: "Governance — Keyboard Navigation",
  args: CHART_STORY_ARGS,
  parameters: {
    docs: {
      description: {
        story:
          "Recharts `accessibilityLayer` enables keyboard focus on chart geometry. Verify tab order reaches the chart region in Storybook.",
      },
    },
  },
  render: () => (
    <StoryFrame width="lg">
      <figure aria-label="Keyboard navigable revenue chart">
        <ChartContainer className="h-64 w-full" config={revenueChartConfig}>
          <AreaChart accessibilityLayer data={[...REVENUE_TREND]}>
            <XAxis dataKey="month" hide />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="revenue"
              fill="var(--color-revenue)"
              fillOpacity={0.15}
              stroke="var(--color-revenue)"
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </figure>
    </StoryFrame>
  ),
};

export const ReducedMotion: Story = {
  name: "Governance — Reduced Motion",
  args: CHART_STORY_ARGS,
  parameters: {
    docs: {
      description: {
        story:
          "Chart tooltips and hover states should remain usable when motion is reduced. Parent `prefers-reduced-motion` is honored by governed motion tokens.",
      },
    },
  },
  render: () => (
    <div style={{ animation: "none" }}>
      <StoryFrame width="lg">
        <figure aria-label="Revenue chart with reduced motion preference">
          <ChartContainer className="h-64 w-full" config={revenueChartConfig}>
            <AreaChart accessibilityLayer data={[...REVENUE_TREND]}>
              <XAxis dataKey="month" hide />
              <ChartTooltip
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="revenue"
                fill="var(--color-revenue)"
                fillOpacity={0.15}
                isAnimationActive={false}
                stroke="var(--color-revenue)"
                type="monotone"
              />
            </AreaChart>
          </ChartContainer>
        </figure>
      </StoryFrame>
    </div>
  ),
};
