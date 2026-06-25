import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  USER_SETTINGS_AUDIT_EVENTS,
  USER_SETTINGS_MUTATION_AUDIT_COVERAGE_TEST,
  USER_SETTINGS_MUTATION_AUDIT_SURFACE_RULE,
  USER_SETTINGS_SERVER_ACTION_MUTATION_AUDIT_ENTRIES,
} from "../user-settings-audit.registry";

const appRoot = join(import.meta.dirname, "../../../..");

function readAppSource(relativePath: string): string {
  return readFileSync(join(appRoot, relativePath), "utf8");
}

describe("user-settings-mutation-audit.registry", () => {
  it("exports the canonical surface rule", () => {
    expect(USER_SETTINGS_MUTATION_AUDIT_SURFACE_RULE).toBe(
      "user-settings-governed-mutations-emit-audit-evidence"
    );
  });

  it("lists every governed server action with audit wiring", () => {
    for (const entry of USER_SETTINGS_SERVER_ACTION_MUTATION_AUDIT_ENTRIES) {
      const actionSource = readAppSource(
        entry.actionModule.replace("apps/erp/", "")
      );

      expect(Object.values(USER_SETTINGS_AUDIT_EVENTS)).toContain(
        entry.auditEvent
      );
      expect(USER_SETTINGS_AUDIT_EVENTS[entry.auditEventKey]).toBe(
        entry.auditEvent
      );
      expect(actionSource).toContain('"use server"');
      expect(actionSource).toContain("resolveActionOperatingContext");
      expect(actionSource).toContain("recordActionAudit");
      expect(actionSource).toContain(`"${entry.id}"`);
      expect(actionSource).toContain(
        `USER_SETTINGS_AUDIT_EVENTS.${entry.auditEventKey}`
      );
    }
  });

  it("declares mutation audit coverage test path", () => {
    expect(USER_SETTINGS_MUTATION_AUDIT_COVERAGE_TEST).toBe(
      "apps/erp/src/lib/user-settings/__tests__/user-settings-mutation-audit-coverage.test.ts"
    );
  });
});
