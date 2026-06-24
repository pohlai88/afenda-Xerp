import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  ACCOUNTING_READINESS_GATE_REQUIREMENTS,
  ACCOUNTING_READINESS_GATE_SURFACE_RULE,
} from "../accounting-readiness-gate-registry.mts";
import {
  checkAccountingReadinessGate,
  formatAccountingReadinessGateViolations,
} from "../check-accounting-readiness-gate.mts";
import { evaluateAccountingReadinessGateLiveStatus } from "../lib/accounting-readiness-gate-live-status.mts";

const repoRoot = join(import.meta.dirname, "../../..");

describe("check-accounting-readiness-gate script", () => {
  it("passes structural validation on the current repository state", () => {
    const violations = checkAccountingReadinessGate({
      runDelegatedGates: false,
    });

    expect(
      violations,
      formatAccountingReadinessGateViolations(violations)
    ).toEqual([]);
  });

  it("defines 10 Phase 9 roadmap requirements", () => {
    expect(ACCOUNTING_READINESS_GATE_REQUIREMENTS).toHaveLength(10);
    expect(
      ACCOUNTING_READINESS_GATE_REQUIREMENTS.map((entry) => entry.number)
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("exports the accounting readiness surface rule", () => {
    expect(ACCOUNTING_READINESS_GATE_SURFACE_RULE).toBe(
      "accounting-readiness-gate-is-canonical-phase-9-matrix"
    );
  });

  it("maps each requirement to delegated gates and/or contract tests", () => {
    for (const requirement of ACCOUNTING_READINESS_GATE_REQUIREMENTS) {
      const hasGate = (requirement.delegatedGates?.length ?? 0) > 0;
      const hasTests = (requirement.testFiles?.length ?? 0) > 0;
      expect(hasGate || hasTests).toBe(true);
    }
  });

  it("documents Phase 9 markers in the pre-accounting roadmap", () => {
    const roadmapDoc = readFileSync(
      join(repoRoot, "docs/architecture/pre-accounting-foundation-roadmap.md"),
      "utf8"
    );

    for (const requirement of ACCOUNTING_READINESS_GATE_REQUIREMENTS) {
      expect(roadmapDoc).toContain(requirement.roadmapMarker);
    }
  });

  it("keeps ERP diagnostics copy aligned with the governance registry", () => {
    const violations = checkAccountingReadinessGate({
      runDelegatedGates: false,
    }).filter((violation) => violation.rule === "erp-copy-parity");

    expect(violations).toEqual([]);
  });

  it("does not recurse into itself when collecting delegated gates", () => {
    const violations = checkAccountingReadinessGate({
      runDelegatedGates: false,
    });

    const recursionViolation = violations.find((violation) =>
      violation.message.includes("check:accounting-readiness-gate failed")
    );
    expect(recursionViolation).toBeUndefined();
  });

  it("evaluates live status snapshots with ten requirements", () => {
    const snapshot = evaluateAccountingReadinessGateLiveStatus({
      repoRoot,
      runDelegatedGates: false,
      structureViolations: [],
    });

    expect(snapshot.requirements).toHaveLength(10);
    expect(snapshot.runMode).toBe("structure-only");
    expect(snapshot.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(snapshot.requirements.every((entry) => entry.kind === "pass")).toBe(
      true
    );
  });
});
