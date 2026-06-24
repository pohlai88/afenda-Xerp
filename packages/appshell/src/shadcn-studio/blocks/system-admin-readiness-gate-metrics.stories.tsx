import type { Meta, StoryObj } from "@storybook/react";

import {
  compactDensityDecorator,
  renderDashboardBlockStory,
} from "../../_storybook/dashboard-block-story.compositions";
import {
  createDashboardBlockMeta,
  dashboardBlockDarkThemeGlobals,
} from "../../_storybook/dashboard-block-story.shared";
import {
  SystemAdminReadinessGateMetrics,
  type SystemAdminReadinessGateMetricsGovernedComponents,
} from "./system-admin-readiness-gate-metrics";

const defaultMetrics = [
  {
    id: "multi-company-model",
    requirementNumber: 1,
    title: "Multi-company model documented",
    badge: "Requirement 1",
    value: "Passing",
    liveStatus: "pass" as const,
    gateSummary: "check:multi-tenancy-glossary-first (pass)",
    emphasis: "default" as const,
  },
  {
    id: "ci-quality-gates",
    requirementNumber: 9,
    title: "CI quality gates passing",
    badge: "Requirement 9",
    value: "Failing",
    liveStatus: "fail" as const,
    gateSummary:
      "quality:release-gate (fail), check:documentation-drift (pass)",
    emphasis: "primary" as const,
  },
  {
    id: "feature-manifest",
    requirementNumber: 7,
    title: "Feature manifest governance proven",
    badge: "Requirement 7",
    value: "Not checked on this run",
    liveStatus: "skipped" as const,
    gateSummary: "feature-manifest-acceptance.test.ts",
    emphasis: "default" as const,
  },
] as const;

const meta = {
  ...createDashboardBlockMeta({
    title: "ERP/ApplicationShell/Blocks/SystemAdmin/ReadinessGateMetrics",
    component: SystemAdminReadinessGateMetrics,
    args: {
      metrics: defaultMetrics,
    },
  }),
  render: (args) =>
    renderDashboardBlockStory(SystemAdminReadinessGateMetrics, args),
} satisfies Meta<typeof SystemAdminReadinessGateMetrics>;

export type ReadinessGateMetricsStoriesGovernedComponents =
  SystemAdminReadinessGateMetricsGovernedComponents;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkTheme: Story = {
  globals: dashboardBlockDarkThemeGlobals,
};

export const Compact: Story = {
  decorators: [compactDensityDecorator],
};
