import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  GOVERNED_DIAGNOSTIC_API_MODULES,
  GOVERNED_DIAGNOSTIC_LOGGING_EMISSION_SYMBOLS,
  GOVERNED_DIAGNOSTIC_SERVER_ACTION_MODULES,
} from "../../../packages/observability/src/surface/governed-diagnostic-logging-registry.ts";
import { GOVERNED_MUTATION_SERVER_ACTION_MODULES } from "../../../packages/observability/src/surface/governed-mutation-audit-registry.ts";
import {
  collectGovernedDiagnosticLoggingViolations,
  discoverGovernedServerActionMutationPaths,
} from "../lib/governed-diagnostic-logging-enforcement.mts";

const repoRoot = new URL("../../../", import.meta.url).pathname.replace(
  /^\/([A-Za-z]:)/,
  "$1"
);

describe("governed-diagnostic-logging-enforcement", () => {
  it("declares diagnostic emission symbols and governed surfaces", () => {
    expect(GOVERNED_DIAGNOSTIC_LOGGING_EMISSION_SYMBOLS).toContain(
      "logServerActionError"
    );
    expect(GOVERNED_DIAGNOSTIC_API_MODULES.length).toBeGreaterThan(0);
    expect(GOVERNED_DIAGNOSTIC_SERVER_ACTION_MODULES.length).toBeGreaterThan(0);
  });

  it("byte-aligns server action paths with audit registry", () => {
    const auditPaths = GOVERNED_MUTATION_SERVER_ACTION_MODULES.map(
      (module) => module.path
    );
    const diagnosticPaths = GOVERNED_DIAGNOSTIC_SERVER_ACTION_MODULES.map(
      (module) => module.path
    );

    expect(diagnosticPaths).toEqual(auditPaths);
  });

  it("passes on the current ERP governed diagnostic logging wiring", () => {
    const violations = collectGovernedDiagnosticLoggingViolations(repoRoot);
    expect(violations).toEqual([]);
  });

  it("discovers every logging-required server action mutation path", () => {
    const discovered = discoverGovernedServerActionMutationPaths(repoRoot);
    const registeredPaths = GOVERNED_DIAGNOSTIC_SERVER_ACTION_MODULES.filter(
      (module) => module.loggingRequired
    ).map((module) => module.path);

    expect(discovered.sort()).toEqual(registeredPaths.sort());
  });

  it("flags unregistered server action mutations (fail-closed inventory rule)", () => {
    const tempRoot = mkdtempSync(
      join(tmpdir(), "afenda-diagnostic-enforcement-")
    );
    const erpActionDir = join(tempRoot, "apps/erp/src/lib/unregistered");
    mkdirSync(erpActionDir, { recursive: true });

    const unregisteredPath = "apps/erp/src/lib/unregistered/evil.action.ts";
    writeFileSync(
      join(tempRoot, unregisteredPath),
      [
        '"use server";',
        "import { serverActionSuccess } from '@/lib/server-actions/server-action-result';",
        "export async function evilAction() {",
        "  return serverActionSuccess({ ok: true });",
        "}",
      ].join("\n")
    );

    try {
      const violations = collectGovernedDiagnosticLoggingViolations(tempRoot);

      expect(
        violations.some(
          (violation) =>
            violation.rule === "server-action-unregistered-diagnostic-mutation"
        )
      ).toBe(true);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
