import { GOVERNED_MUTATION_SERVER_ACTION_MODULES } from "@afenda/observability/surface";
import { describe, expect, it } from "vitest";

import {
  SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES,
  SYSTEM_ADMIN_SETTINGS_OBSERVABILITY_WAIVER_ID,
} from "../system-admin-mutation-audit.registry";

const PKG013_SETTINGS_EXEMPTION_REASON =
  "scaffold-failure-only-no-successful-mutation-path" as const;

describe("system-admin PKG007 ↔ PKG013 observability registry parity", () => {
  it("maps every PKG007 server-action actionModule to PKG013 with matching action id", () => {
    for (const entry of SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES) {
      const pkg013Entry = GOVERNED_MUTATION_SERVER_ACTION_MODULES.find(
        (module) => module.path === entry.actionModule
      );

      expect(
        pkg013Entry,
        `${entry.actionModule} must exist in GOVERNED_MUTATION_SERVER_ACTION_MODULES`
      ).toBeDefined();
      expect(pkg013Entry?.action).toBe(entry.id);
    }
  });

  it("documents settings action PKG013 auditRequired false under waiver", () => {
    const settingsEntry =
      SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES.find(
        (entry) => entry.id === "system_admin.settings.update"
      );
    expect(settingsEntry).toBeDefined();

    const pkg013Entry = GOVERNED_MUTATION_SERVER_ACTION_MODULES.find(
      (module) => module.path === settingsEntry?.actionModule
    );
    expect(pkg013Entry).toBeDefined();
    expect(pkg013Entry?.auditRequired).toBe(false);
    if (pkg013Entry?.auditRequired !== false) {
      throw new Error(
        "Expected settings PKG013 entry with auditRequired false"
      );
    }
    expect(pkg013Entry.auditExemptionReason).toBe(
      PKG013_SETTINGS_EXEMPTION_REASON
    );
    expect(SYSTEM_ADMIN_SETTINGS_OBSERVABILITY_WAIVER_ID).toBe(
      "system-admin-settings-observability-exempt"
    );
  });

  it("requires audit on diagnostics refresh action in PKG013", () => {
    const refreshEntry = SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES.find(
      (entry) =>
        entry.id === "system_admin.diagnostics.refresh_readiness_gate_full"
    );
    expect(refreshEntry).toBeDefined();

    const pkg013Entry = GOVERNED_MUTATION_SERVER_ACTION_MODULES.find(
      (module) => module.path === refreshEntry?.actionModule
    );
    expect(pkg013Entry).toBeDefined();
    expect(pkg013Entry?.auditRequired).toBe(true);
    if (pkg013Entry?.auditRequired !== true) {
      throw new Error("Expected refresh PKG013 entry with auditRequired true");
    }
    expect(pkg013Entry.requiredSymbols).toContain("recordActionAudit");
  });
});
