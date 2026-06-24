import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SystemAdminReadinessGatePanel } from "@/components/system-admin/system-admin-readiness-gate-panel";
import {
  ACCOUNTING_READINESS_GATE_OVERALL_LABELS,
  ACCOUNTING_READINESS_GATE_PANEL_TITLE,
  ACCOUNTING_READINESS_GATE_SIGNOFF_BANNER_BODY,
  ACCOUNTING_READINESS_GATE_SIGNOFF_BANNER_TITLE,
  ACCOUNTING_READINESS_GATE_STATUS_LABELS,
} from "@/lib/system-admin/accounting-readiness-gate.copy.contract";
import type { AccountingReadinessGateRequirementStatus } from "@/lib/system-admin/resolve-accounting-readiness-gate-status.server";

vi.mock(
  "@/components/system-admin/system-admin-readiness-gate-refresh.client",
  () => ({
    SystemAdminReadinessGateRefreshForm: () => (
      <button type="button">Run full delegated gate check</button>
    ),
  })
);

const mockRequirements: readonly AccountingReadinessGateRequirementStatus[] = [
  {
    id: "multi-company-model",
    number: 1,
    requirement: "Multi-company model documented",
    delegatedGates: ["check:multi-tenancy-glossary-first"],
    testFiles: [
      "apps/erp/src/lib/context/__tests__/resolve-legal-entity-context.test.ts",
    ],
    checkedAt: "2026-06-24T12:00:00.000Z",
    runMode: "structure-only",
    evidencePassed: true,
    liveKind: "skipped",
    messages: [],
    delegatedResults: [
      {
        gate: "check:multi-tenancy-glossary-first",
        kind: "skipped",
        message: null,
      },
    ],
  },
  {
    id: "documentation-synchronized",
    number: 10,
    requirement: "Documentation synchronized",
    delegatedGates: ["check:documentation-drift"],
    testFiles: [],
    checkedAt: "2026-06-24T12:00:00.000Z",
    runMode: "structure-only",
    evidencePassed: true,
    liveKind: "fail",
    messages: ["check:documentation-drift failed"],
    delegatedResults: [
      {
        gate: "check:documentation-drift",
        kind: "fail",
        message: "drift detected",
      },
    ],
  },
];

describe("SystemAdminReadinessGatePanel", () => {
  it("shows sign-off banner and evidence-only overall label on structure-only runs", () => {
    render(
      <SystemAdminReadinessGatePanel
        checkedAt="2026-06-24T12:00:00.000Z"
        diagnosticsOverall="evidence-pass"
        requirements={mockRequirements}
        runMode="structure-only"
      />
    );

    expect(
      screen.getByRole("heading", {
        name: ACCOUNTING_READINESS_GATE_PANEL_TITLE,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(ACCOUNTING_READINESS_GATE_SIGNOFF_BANNER_TITLE)
    ).toBeInTheDocument();
    expect(document.body.textContent).toContain(
      ACCOUNTING_READINESS_GATE_OVERALL_LABELS["evidence-pass"]
    );
    expect(
      screen.queryByText("All requirements passing")
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(
      screen.getByText(ACCOUNTING_READINESS_GATE_STATUS_LABELS.skipped)
    ).toBeInTheDocument();
    expect(
      screen.getByText(ACCOUNTING_READINESS_GATE_STATUS_LABELS.fail)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Run full delegated gate check" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(ACCOUNTING_READINESS_GATE_SIGNOFF_BANNER_BODY)
    ).toBeInTheDocument();
  });
});

describe("accounting readiness integration — prohibited accounting core", () => {
  it("does not import @afenda/accounting in readiness resolver wiring", async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const source = readFileSync(
      join(
        import.meta.dirname,
        "../lib/context/resolve-accounting-readiness.server.ts"
      ),
      "utf8"
    );

    expect(source).toContain("toAccountingReadinessContext");
    expect(source).not.toContain("@afenda/accounting");
  });
});
