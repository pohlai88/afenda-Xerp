import { Card } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { ShieldCheckIcon } from "lucide-react";
import { useId } from "react";

import { createPresentationMcpWrapper } from "../create-presentation-mcp-wrapper";

export type SystemAdminReadinessGateLiveStatus = "pass" | "fail" | "skipped";

export type SystemAdminReadinessGateMetricsGovernedComponents = Extract<
  GovernedUiComponentName,
  "Card"
>;

export interface SystemAdminReadinessGateMetric {
  readonly badge: string;
  readonly emphasis?: "default" | "primary";
  readonly gateSummary: string;
  readonly id: string;
  readonly liveStatus: SystemAdminReadinessGateLiveStatus;
  readonly requirementNumber: number;
  readonly title: string;
  readonly value: string;
}

export interface SystemAdminReadinessGateMetricsProps {
  readonly metrics: readonly SystemAdminReadinessGateMetric[];
}

function GovernedSystemAdminReadinessGateMetrics({
  metrics,
}: SystemAdminReadinessGateMetricsProps) {
  return (
    <section
      aria-label="Accounting readiness requirements"
      className="app-shell-dashboard-statistics-metrics"
    >
      <div className="app-shell-statistics-metric-grid" role="list">
        {metrics.map((metric) => (
          <SystemAdminReadinessGateMetricCard key={metric.id} metric={metric} />
        ))}
      </div>
    </section>
  );
}

function SystemAdminReadinessGateMetricCard({
  metric,
}: {
  readonly metric: SystemAdminReadinessGateMetric;
}) {
  const titleId = useId();
  const footnoteId = useId();

  return (
    <article
      aria-labelledby={titleId}
      className="app-shell-dashboard-widget app-shell-studio-metric-card app-shell-readiness-gate-widget"
      data-emphasis={metric.emphasis ?? "default"}
      data-live-status={metric.liveStatus}
      role="listitem"
    >
      <Card>
        <div className="app-shell-studio-metric__body">
          <div className="app-shell-studio-metric__header">
            <div className="app-shell-studio-metric__heading">
              <span className="app-shell-studio-metric__title" id={titleId}>
                {metric.title}
              </span>
              <span className="app-shell-studio-metric__caption">
                {metric.badge}
              </span>
            </div>
            <div aria-hidden="true" className="app-shell-studio-icon-chip">
              <ShieldCheckIcon className="app-shell-studio-icon-chip__icon" />
            </div>
          </div>

          <p
            aria-describedby={footnoteId}
            className="app-shell-studio-metric__value-group"
          >
            <span className="app-shell-readiness-gate-status-row">
              <span
                aria-hidden="true"
                className="app-shell-readiness-gate-status-dot"
              />
              <span className="app-shell-studio-metric__value">
                {metric.value}
              </span>
            </span>
          </p>

          <p className="app-shell-studio-metric__footnote" id={footnoteId}>
            <span className="app-shell-studio-metric__comparison">
              {metric.gateSummary}
            </span>
          </p>
        </div>
      </Card>
    </article>
  );
}

export const SystemAdminReadinessGateMetrics = createPresentationMcpWrapper({
  status: "governed-compose",
  GovernedComponent: GovernedSystemAdminReadinessGateMetrics,
});
