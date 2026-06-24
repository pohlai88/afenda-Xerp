import {
  type SystemAdminReadinessGateMetric,
  SystemAdminReadinessGateMetrics,
} from "@afenda/appshell";
import { SystemAdminReadinessGateRefreshForm } from "@/components/system-admin/system-admin-readiness-gate-refresh.client";
import {
  ACCOUNTING_READINESS_GATE_FOOTNOTE_LABEL,
  ACCOUNTING_READINESS_GATE_OVERALL_LABELS,
  ACCOUNTING_READINESS_GATE_PANEL_DESCRIPTION,
  ACCOUNTING_READINESS_GATE_PANEL_TITLE,
  ACCOUNTING_READINESS_GATE_RUN_MODE_LABELS,
  ACCOUNTING_READINESS_GATE_SIGNOFF_BANNER_BODY,
  ACCOUNTING_READINESS_GATE_SIGNOFF_BANNER_TITLE,
  ACCOUNTING_READINESS_GATE_STATUS_LABELS,
} from "@/lib/system-admin/accounting-readiness-gate.copy.contract";
import type { AccountingReadinessDiagnosticsOverallKind } from "@/lib/system-admin/resolve-accounting-readiness-gate-presentation.server";
import type { AccountingReadinessGateRequirementStatus } from "@/lib/system-admin/resolve-accounting-readiness-gate-status.server";

function formatGateSummary(
  requirement: AccountingReadinessGateRequirementStatus
): string {
  if (requirement.delegatedResults.length > 0) {
    return requirement.delegatedResults
      .map((result) => {
        const suffix =
          result.kind === "pass"
            ? "pass"
            : result.kind === "fail"
              ? "fail"
              : "skipped";
        return `${result.gate} (${suffix})`;
      })
      .join(", ");
  }

  return requirement.testFiles
    .map((file) => file.split("/").at(-1))
    .filter((file): file is string => Boolean(file))
    .join(", ");
}

function toReadinessMetric(
  requirement: AccountingReadinessGateRequirementStatus
): SystemAdminReadinessGateMetric {
  const liveStatus =
    requirement.liveKind === "pass"
      ? "pass"
      : requirement.liveKind === "fail"
        ? "fail"
        : "skipped";

  return {
    id: requirement.id,
    requirementNumber: requirement.number,
    title: requirement.requirement,
    badge: `Requirement ${requirement.number}`,
    value: ACCOUNTING_READINESS_GATE_STATUS_LABELS[liveStatus],
    liveStatus,
    gateSummary: formatGateSummary(requirement),
    emphasis: liveStatus === "pass" ? "default" : "primary",
  };
}

export interface SystemAdminReadinessGatePanelProps {
  readonly checkedAt: string;
  readonly diagnosticsOverall: AccountingReadinessDiagnosticsOverallKind;
  readonly requirements: readonly AccountingReadinessGateRequirementStatus[];
  readonly runMode: "structure-only" | "full";
}

export function SystemAdminReadinessGatePanel({
  checkedAt,
  diagnosticsOverall,
  requirements,
  runMode,
}: SystemAdminReadinessGatePanelProps) {
  const metrics = requirements.map(toReadinessMetric);
  const overallLabel =
    ACCOUNTING_READINESS_GATE_OVERALL_LABELS[diagnosticsOverall];
  const runModeLabel = ACCOUNTING_READINESS_GATE_RUN_MODE_LABELS[runMode];

  return (
    <section
      aria-labelledby="system-admin-readiness-gate-title"
      className="flex flex-col gap-6"
    >
      <div className="app-shell-readiness-gate-signoff-banner" role="status">
        <p className="app-shell-readiness-gate-signoff-banner__title">
          {ACCOUNTING_READINESS_GATE_SIGNOFF_BANNER_TITLE}
        </p>
        <p className="app-shell-readiness-gate-signoff-banner__body">
          {ACCOUNTING_READINESS_GATE_SIGNOFF_BANNER_BODY}
        </p>
      </div>

      <header className="flex flex-col gap-2">
        <h2 id="system-admin-readiness-gate-title">
          {ACCOUNTING_READINESS_GATE_PANEL_TITLE}
        </h2>
        <p className="text-muted-foreground text-sm">
          {ACCOUNTING_READINESS_GATE_PANEL_DESCRIPTION}
        </p>
        <p
          aria-live="polite"
          className="text-muted-foreground text-sm tabular-nums"
        >
          {overallLabel} · {runModeLabel} · Last checked{" "}
          <time dateTime={checkedAt}>{checkedAt}</time>
        </p>
        <SystemAdminReadinessGateRefreshForm />
      </header>

      <SystemAdminReadinessGateMetrics metrics={metrics} />

      <p className="text-muted-foreground text-sm">
        {ACCOUNTING_READINESS_GATE_FOOTNOTE_LABEL}
      </p>
    </section>
  );
}
