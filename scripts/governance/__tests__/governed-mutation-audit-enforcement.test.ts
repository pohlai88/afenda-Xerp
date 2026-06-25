import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  GOVERNED_MUTATION_API_AUDIT_MODULES,
  GOVERNED_MUTATION_AUDIT_EMISSION_SYMBOLS,
  GOVERNED_MUTATION_SERVER_ACTION_MODULES,
} from "../../../packages/observability/src/surface/governed-mutation-audit-registry.ts";
import {
  collectGovernedMutationAuditViolations,
  collectUnregisteredServerActionMutationViolations,
  discoverGovernedServerActionMutationPaths,
} from "../lib/governed-mutation-audit-enforcement.mts";

const repoRoot = new URL("../../../", import.meta.url).pathname.replace(
  /^\/([A-Za-z]:)/,
  "$1"
);

describe("governed-mutation-audit-enforcement", () => {
  it("declares audit emission symbols and governed surfaces", () => {
    expect(GOVERNED_MUTATION_AUDIT_EMISSION_SYMBOLS).toContain(
      "recordActionAudit"
    );
    expect(GOVERNED_MUTATION_API_AUDIT_MODULES.length).toBeGreaterThan(0);
    expect(GOVERNED_MUTATION_SERVER_ACTION_MODULES.length).toBeGreaterThan(0);
  });

  it("passes on the current ERP governed mutation wiring", () => {
    const violations = collectGovernedMutationAuditViolations(repoRoot);
    expect(violations).toEqual([]);
  });

  it("discovers only registered server action mutation paths (fail-closed subset)", () => {
    const discovered = discoverGovernedServerActionMutationPaths(repoRoot);
    const registeredPaths = new Set(
      GOVERNED_MUTATION_SERVER_ACTION_MODULES.map((module) => module.path)
    );

    for (const path of discovered) {
      expect(registeredPaths.has(path), path).toBe(true);
    }
  });

  it("flags unregistered server action mutations (fail-closed inventory rule)", () => {
    const tempRoot = mkdtempSync(join(tmpdir(), "afenda-audit-enforcement-"));
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
      const violations =
        collectUnregisteredServerActionMutationViolations(tempRoot);

      expect(violations).toEqual([
        {
          rule: "server-action-unregistered-mutation",
          file: unregisteredPath,
          message: `${unregisteredPath} contains "use server" and serverActionSuccess but is not listed in GOVERNED_MUTATION_SERVER_ACTION_MODULES — register with auditRequired or auditExemptionReason`,
        },
      ]);

      expect(
        collectGovernedMutationAuditViolations(tempRoot).some(
          (violation) =>
            violation.rule === "server-action-unregistered-mutation"
        )
      ).toBe(true);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
