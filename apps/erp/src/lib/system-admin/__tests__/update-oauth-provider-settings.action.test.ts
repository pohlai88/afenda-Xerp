import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@afenda/auth", () => ({
  AUTH_EVENT: {
    oauthProviderConfigured: "auth.oauth.provider_configured",
  },
  persistAuthAuditEvent: vi.fn(),
}));

vi.mock("@afenda/database", () => ({
  mergeTenantOAuthProviderSettings: vi.fn(),
  TENANT_OAUTH_CLIENT_SECRET_ENV_KEY: "clientSecretEnvKey",
  TENANT_OAUTH_PROVIDER_IDS: ["google", "microsoft"],
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("@/lib/server-actions/resolve-action-operating-context.server", () => ({
  resolveActionOperatingContext: vi.fn(),
}));

vi.mock("@/lib/system-admin/guard-system-admin-section.server", () => ({
  guardSystemAdminSection: vi.fn(),
}));

vi.mock("@/lib/server-actions/record-action-audit", () => ({
  recordActionAudit: vi.fn(),
}));

import { persistAuthAuditEvent } from "@afenda/auth";
import { mergeTenantOAuthProviderSettings } from "@afenda/database";
import { recordActionAudit } from "@/lib/server-actions/record-action-audit";
import { resolveActionOperatingContext } from "@/lib/server-actions/resolve-action-operating-context.server";
import { guardSystemAdminSection } from "../guard-system-admin-section.server";
import { updateOauthProviderSettingsAction } from "../update-oauth-provider-settings.action";

describe("updateOauthProviderSettingsAction", () => {
  beforeEach(() => {
    vi.mocked(resolveActionOperatingContext).mockReset();
    vi.mocked(guardSystemAdminSection).mockReset();
    vi.mocked(mergeTenantOAuthProviderSettings).mockReset();
    vi.mocked(recordActionAudit).mockReset();
    vi.mocked(persistAuthAuditEvent).mockReset();
  });

  it("denies when system-admin settings guard fails", async () => {
    vi.mocked(resolveActionOperatingContext).mockResolvedValue({
      ok: true,
      operatingContext: {
        actor: { userId: "user-1" },
        correlationId: "corr-1",
        tenant: { tenantId: "tenant-1" },
      },
    } as never);
    vi.mocked(guardSystemAdminSection).mockResolvedValue({
      kind: "forbidden",
      sectionId: "settings",
      permissionKey: "system_admin.settings.manage",
    } as never);

    const formData = new FormData();
    formData.set("mode", "toggle");
    formData.set("providerId", "google");
    formData.set("enabled", "true");

    const result = await updateOauthProviderSettingsAction(null, formData);

    expect(result?.ok).toBe(false);
    expect(recordActionAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "system_admin.settings.integrations.oauth.update",
        result: "denied",
      })
    );
  });

  it("persists OAuth toggle and emits auth audit on success", async () => {
    vi.mocked(resolveActionOperatingContext).mockResolvedValue({
      ok: true,
      operatingContext: {
        actor: { userId: "user-1" },
        correlationId: "corr-1",
        tenant: { tenantId: "tenant-1" },
      },
    } as never);
    vi.mocked(guardSystemAdminSection).mockResolvedValue({
      kind: "allowed",
      section: { sectionId: "settings" },
    } as never);
    vi.mocked(mergeTenantOAuthProviderSettings).mockResolvedValue({
      clientId: "",
      displayName: "Google",
      enabled: true,
    });

    const formData = new FormData();
    formData.set("mode", "toggle");
    formData.set("providerId", "google");
    formData.set("enabled", "true");

    const result = await updateOauthProviderSettingsAction(null, formData);

    expect(result?.ok).toBe(true);
    expect(mergeTenantOAuthProviderSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        patch: { enabled: true },
        providerId: "google",
        tenantId: "tenant-1",
      })
    );
    expect(persistAuthAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "auth.oauth.provider_configured",
        result: "success",
      })
    );
    expect(recordActionAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "system_admin.settings.integrations.oauth.update",
        result: "success",
      })
    );
  });
});
