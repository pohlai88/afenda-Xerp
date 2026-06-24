import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  type SystemAdminReadinessGateMetric,
  SystemAdminReadinessGateMetrics,
} from "../shadcn-studio/blocks/system-admin-readiness-gate-metrics";

const defaultMetrics = [
  {
    id: "multi-company-model",
    requirementNumber: 1,
    title: "Multi-company model documented",
    badge: "Requirement 1",
    value: "Passing",
    liveStatus: "pass",
    gateSummary: "check:multi-tenancy-glossary-first (pass)",
    emphasis: "default",
  },
  {
    id: "ci-quality-gates",
    requirementNumber: 9,
    title: "CI quality gates passing",
    badge: "Requirement 9",
    value: "Failing",
    liveStatus: "fail",
    gateSummary:
      "quality:release-gate (fail), check:documentation-drift (pass)",
    emphasis: "primary",
  },
  {
    id: "feature-manifest",
    requirementNumber: 7,
    title: "Feature manifest governance proven",
    badge: "Requirement 7",
    value: "Not checked on this run",
    liveStatus: "skipped",
    gateSummary: "feature-manifest-acceptance.test.ts",
    emphasis: "default",
  },
] as const satisfies readonly SystemAdminReadinessGateMetric[];

describe("SystemAdminReadinessGateMetrics", () => {
  it("renders the readiness requirements section landmark", () => {
    render(<SystemAdminReadinessGateMetrics metrics={defaultMetrics} />);

    expect(
      screen.getByRole("region", {
        name: "Accounting readiness requirements",
      })
    ).toBeInTheDocument();
  });

  it("links metric value to footnote via aria-describedby", () => {
    render(<SystemAdminReadinessGateMetrics metrics={defaultMetrics} />);

    const metric = screen.getByText("Passing").closest("p");
    const footnote = screen
      .getByText("check:multi-tenancy-glossary-first (pass)")
      .closest("p");

    expect(metric).toHaveAttribute("aria-describedby");
    expect(footnote?.id).toBe(metric?.getAttribute("aria-describedby"));
  });

  it("uses canonical studio metric classes and no legacy KPI prefixes", () => {
    const { container } = render(
      <SystemAdminReadinessGateMetrics metrics={defaultMetrics} />
    );

    expect(
      container.querySelector(".app-shell-studio-metric-card")
    ).not.toBeNull();
    expect(
      container.querySelector('[class*="app-shell-dashboard-kpi-"]')
    ).toBeNull();
  });

  it("applies primary emphasis and live status hooks on failing metrics", () => {
    const { container } = render(
      <SystemAdminReadinessGateMetrics metrics={defaultMetrics} />
    );

    expect(
      container.querySelector(
        '.app-shell-studio-metric-card[data-emphasis="primary"][data-live-status="fail"]'
      )
    ).not.toBeNull();
  });

  it("renders readiness status dots for pass and fail metrics", () => {
    const { container } = render(
      <SystemAdminReadinessGateMetrics metrics={defaultMetrics} />
    );

    expect(
      container.querySelectorAll(".app-shell-readiness-gate-status-dot")
    ).toHaveLength(3);
  });
});
