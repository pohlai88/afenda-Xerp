import { describe, expect, it } from "vitest";

import {
  ACCOUNTING_READINESS_PHASE_9_APPROVAL_STATUS,
  resolveAccountingReadinessDiagnosticsOverall,
} from "@/lib/system-admin/resolve-accounting-readiness-gate-presentation.server";
import type { AccountingReadinessGateRequirementStatus } from "@/lib/system-admin/resolve-accounting-readiness-gate-status.server";

function requirement(
  overrides: Partial<AccountingReadinessGateRequirementStatus> &
    Pick<AccountingReadinessGateRequirementStatus, "id" | "number">
): AccountingReadinessGateRequirementStatus {
  return {
    requirement: "Requirement",
    delegatedGates: [],
    testFiles: [],
    checkedAt: "2026-06-24T12:00:00.000Z",
    runMode: "structure-only",
    evidencePassed: true,
    liveKind: "pass",
    messages: [],
    delegatedResults: [],
    ...overrides,
  };
}

describe("resolveAccountingReadinessDiagnosticsOverall", () => {
  it("never reports automated pass on structure-only runs", () => {
    const requirements = [
      requirement({
        id: "multi-company-model",
        number: 1,
        liveKind: "skipped",
        delegatedResults: [
          {
            gate: "check:multi-tenancy-glossary-first",
            kind: "skipped",
            message: null,
          },
        ],
      }),
    ];

    expect(
      resolveAccountingReadinessDiagnosticsOverall({
        snapshot: {
          checkedAt: "2026-06-24T12:00:00.000Z",
          runMode: "structure-only",
          overallKind: "pass",
          requirements: [],
        },
        requirements,
      })
    ).toBe("evidence-pass");
  });

  it("reports automated pass only after a full delegated run", () => {
    expect(
      resolveAccountingReadinessDiagnosticsOverall({
        snapshot: {
          checkedAt: "2026-06-24T12:00:00.000Z",
          runMode: "full",
          overallKind: "pass",
          requirements: [],
        },
        requirements: [
          requirement({
            id: "documentation-synchronized",
            number: 10,
            liveKind: "pass",
            runMode: "full",
          }),
        ],
      })
    ).toBe("automated-pass");
  });

  it("records Phase 9 approval status after Architecture Authority sign-off", () => {
    expect(ACCOUNTING_READINESS_PHASE_9_APPROVAL_STATUS).toBe(
      "architecture-authority-signed-off-2026-06-24"
    );
  });
});
