import { GOVERNED_MUTATION_SERVER_ACTION_MODULES } from "@afenda/observability/surface";
import { describe, expect, it } from "vitest";

import { SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES } from "../system-admin-mutation-audit.registry";

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

  it("requires audit on settings server actions in PKG013", () => {
    const settingsActionIds = [
      "system_admin.settings.update",
      "system_admin.settings.notifications.update",
      "system_admin.settings.workspace.update",
      "system_admin.settings.billing.update",
      "system_admin.settings.integrations.update",
    ] as const;

    for (const actionId of settingsActionIds) {
      const entry = SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES.find(
        (row) => row.id === actionId
      );
      expect(entry).toBeDefined();

      const pkg013Entry = GOVERNED_MUTATION_SERVER_ACTION_MODULES.find(
        (module) => module.path === entry?.actionModule
      );
      expect(pkg013Entry).toBeDefined();
      expect(pkg013Entry?.auditRequired).toBe(true);
      if (pkg013Entry?.auditRequired !== true) {
        throw new Error(
          `Expected ${actionId} PKG013 entry with auditRequired true`
        );
      }
      expect(pkg013Entry.requiredSymbols).toContain("recordActionAudit");
    }
  });

  it("requires audit on security MFA policy action in PKG013", () => {
    const mfaEntry = SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES.find(
      (entry) => entry.id === "system_admin.settings.security.mfa_policy.update"
    );
    expect(mfaEntry).toBeDefined();

    const pkg013Entry = GOVERNED_MUTATION_SERVER_ACTION_MODULES.find(
      (module) => module.path === mfaEntry?.actionModule
    );
    expect(pkg013Entry).toBeDefined();
    expect(pkg013Entry?.auditRequired).toBe(true);
    expect(pkg013Entry?.requiredSymbols).toContain("recordActionAudit");
  });

  it("requires audit on members invite resend/revoke actions in PKG013", () => {
    const inviteActionIds = [
      "system_admin.settings.members.invite.resend",
      "system_admin.settings.members.invite.revoke",
    ] as const;

    for (const actionId of inviteActionIds) {
      const entry = SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES.find(
        (row) => row.id === actionId
      );
      expect(entry).toBeDefined();

      const pkg013Entry = GOVERNED_MUTATION_SERVER_ACTION_MODULES.find(
        (module) => module.path === entry?.actionModule
      );
      expect(pkg013Entry).toBeDefined();
      expect(pkg013Entry?.auditRequired).toBe(true);
      if (pkg013Entry?.auditRequired !== true) {
        throw new Error(
          `Expected ${actionId} PKG013 entry with auditRequired true`
        );
      }
      expect(pkg013Entry.requiredSymbols).toContain("recordActionAudit");
    }
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
