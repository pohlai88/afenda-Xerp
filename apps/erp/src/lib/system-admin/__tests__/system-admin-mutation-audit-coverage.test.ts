import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  SYSTEM_ADMIN_API_MUTATION_AUDIT_ENTRIES,
  SYSTEM_ADMIN_MUTATION_AUDIT_SURFACE_RULE,
  SYSTEM_ADMIN_OBSERVABILITY_REGISTRY_PARITY_TEST,
  SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES,
  SYSTEM_ADMIN_SUPPLEMENTARY_MUTATION_AUDIT_ENTRIES,
} from "../system-admin-mutation-audit.registry";

const appRoot = join(import.meta.dirname, "../../../..");

function readAppSource(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

describe("system-admin-mutation-audit.registry", () => {
  it("exports the canonical surface rule", () => {
    expect(SYSTEM_ADMIN_MUTATION_AUDIT_SURFACE_RULE).toBe(
      "system-admin-governed-mutations-emit-audit-evidence"
    );
  });

  it("lists every governed API mutation with audit.enabled contracts", () => {
    const contractSource = readAppSource(
      "src/server/api/contracts/system-admin/system-admin.contract.ts"
    );

    for (const entry of SYSTEM_ADMIN_API_MUTATION_AUDIT_ENTRIES) {
      expect(contractSource).toContain(entry.contractExport);
      expect(contractSource).toContain(`action: "${entry.auditAction}"`);
      expect(contractSource).toContain("enabled: true");
    }
  });

  it("lists every governed server action with recordActionAudit wiring", () => {
    const delegatedExecutorSource = readAppSource(
      "src/lib/system-admin/execute-tenant-settings-section-update.server.ts"
    );
    const readinessGateExecutorSource = readAppSource(
      "src/lib/system-admin/execute-refresh-accounting-readiness-gate-full.server.ts"
    );

    for (const entry of SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES) {
      const actionSource = readAppSource(
        entry.actionModule.replace("apps/erp/", "")
      );

      expect(actionSource).toContain('"use server"');

      const idSource = actionSource.includes(
        "executeRefreshAccountingReadinessGateFull"
      )
        ? readinessGateExecutorSource
        : actionSource;
      expect(idSource).toContain(`"${entry.id}"`);

      const auditSource = actionSource.includes(
        "executeTenantSettingsSectionUpdate"
      )
        ? delegatedExecutorSource
        : actionSource.includes("executeRefreshAccountingReadinessGateFull")
          ? readinessGateExecutorSource
          : actionSource;

      expect(actionSource).toContain("resolveActionOperatingContext");
      expect(auditSource).toContain("recordActionAudit");
    }
  });

  it("lists supplementary denial audit paths", () => {
    for (const entry of SYSTEM_ADMIN_SUPPLEMENTARY_MUTATION_AUDIT_ENTRIES) {
      const moduleSource = readAppSource(entry.module.replace("apps/erp/", ""));

      expect(moduleSource).toContain("recordErpAuditEvent");
      expect(moduleSource).toContain(`"${entry.auditAction}"`);
    }
  });

  it("declares PKG013 cross-package parity test path", () => {
    expect(SYSTEM_ADMIN_OBSERVABILITY_REGISTRY_PARITY_TEST).toBe(
      "apps/erp/src/lib/system-admin/__tests__/system-admin-observability-registry-parity.test.ts"
    );
  });
});
