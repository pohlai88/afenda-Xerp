import { describe, expect, it, vi } from "vitest";

const {
  mockResolveActionOperatingContext,
  mockGuardSystemAdminSection,
  mockUpdateTenant,
  mockCreatePinoLogger,
} = vi.hoisted(() => ({
  mockResolveActionOperatingContext: vi.fn(),
  mockGuardSystemAdminSection: vi.fn(),
  mockUpdateTenant: vi.fn(),
  mockCreatePinoLogger: vi.fn(() => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  })),
}));

vi.mock("@/lib/server-actions/resolve-action-operating-context.server", () => ({
  resolveActionOperatingContext: mockResolveActionOperatingContext,
}));

vi.mock("@/lib/system-admin/guard-system-admin-section.server", () => ({
  guardSystemAdminSection: mockGuardSystemAdminSection,
}));

vi.mock("@afenda/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/database")>();
  return {
    ...actual,
    updateTenant: mockUpdateTenant,
  };
});

vi.mock("@/lib/observability/create-request-bound-logger", () => ({
  createRequestBoundErpLogger: vi.fn(async () => mockCreatePinoLogger()),
}));

vi.mock("@/lib/server-actions/record-action-audit", () => ({
  recordActionAudit: vi.fn(async () => undefined),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { recordActionAudit } from "@/lib/server-actions/record-action-audit";
import { SYSTEM_ADMIN_SETTINGS_SAVE_DENIED_MESSAGE } from "@/lib/system-admin/system-admin-settings.copy.contract";
import { UPDATE_SYSTEM_ADMIN_SETTINGS_INTENT } from "@/lib/system-admin/system-admin-settings.schema";
import { updateSystemAdminSettingsAction } from "@/lib/system-admin/update-system-admin-settings.action";

const sampleOperatingContext = {
  actor: { userId: "user_1" },
  correlationId: "corr_1",
  tenant: { tenantId: "tenant-001" },
  permissionScope: {
    tenantId: "tenant-001",
    companyId: "company-001",
    organizationId: null,
  },
  workspace: {
    tenantId: "tenant-001",
    companyId: "company-001",
    organizationId: null,
    projectId: null,
  },
} as const;

function createFormData(intent: string | null, companyName?: string): FormData {
  const formData = new FormData();
  if (intent !== null) {
    formData.set("intent", intent);
  }
  if (companyName !== undefined) {
    formData.set("companyName", companyName);
  }
  return formData;
}

describe("updateSystemAdminSettingsAction", () => {
  it("returns VALIDATION_ERROR when intent is missing or invalid", async () => {
    const missingIntentResult = await updateSystemAdminSettingsAction(
      null,
      createFormData(null)
    );

    expect(missingIntentResult).toEqual({
      ok: false,
      code: "VALIDATION_ERROR",
      userMessage: "Please check the highlighted fields.",
      fields: expect.arrayContaining([
        expect.objectContaining({ path: "intent" }),
      ]),
    });

    const invalidIntentResult = await updateSystemAdminSettingsAction(
      null,
      createFormData("delete-tenant")
    );

    expect(invalidIntentResult?.ok).toBe(false);
    if (!invalidIntentResult || invalidIntentResult.ok) {
      throw new Error("Expected validation failure");
    }
    expect(invalidIntentResult.code).toBe("VALIDATION_ERROR");
  });

  it("returns UNAUTHORIZED when operating context cannot be resolved", async () => {
    mockResolveActionOperatingContext.mockResolvedValueOnce({
      ok: false,
      error: {
        code: "UNAUTHORIZED",
        userMessage: "Sign in to continue.",
      },
    });

    await expect(
      updateSystemAdminSettingsAction(
        null,
        createFormData(UPDATE_SYSTEM_ADMIN_SETTINGS_INTENT)
      )
    ).resolves.toEqual({
      ok: false,
      code: "UNAUTHORIZED",
      userMessage: "Sign in to continue.",
    });
  });

  it("returns FORBIDDEN with denied audit when settings section access is denied", async () => {
    mockResolveActionOperatingContext.mockResolvedValueOnce({
      ok: true,
      session: {
        user: { userId: "user_1" },
      },
      operatingContext: sampleOperatingContext,
    });
    mockGuardSystemAdminSection.mockResolvedValueOnce({
      kind: "forbidden",
      permissionKey: "system_admin.settings.manage",
      sectionId: "settings",
    });

    await expect(
      updateSystemAdminSettingsAction(
        null,
        createFormData(UPDATE_SYSTEM_ADMIN_SETTINGS_INTENT)
      )
    ).resolves.toEqual({
      ok: false,
      code: "FORBIDDEN",
      userMessage: SYSTEM_ADMIN_SETTINGS_SAVE_DENIED_MESSAGE,
    });

    expect(recordActionAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "system_admin.settings.update",
        actorUserId: "user_1",
        module: "system_admin",
        result: "denied",
        targetType: "system_admin_settings",
      })
    );
  });

  it("persists tenant name and records success audit when guard allows", async () => {
    mockResolveActionOperatingContext.mockResolvedValueOnce({
      ok: true,
      session: {
        user: { userId: "user_1" },
      },
      operatingContext: sampleOperatingContext,
    });
    mockGuardSystemAdminSection.mockResolvedValueOnce({
      kind: "allowed",
      section: { sectionId: "settings" },
    });
    mockUpdateTenant.mockResolvedValueOnce(undefined);

    await expect(
      updateSystemAdminSettingsAction(
        null,
        createFormData(UPDATE_SYSTEM_ADMIN_SETTINGS_INTENT, "Acme Corp")
      )
    ).resolves.toEqual({
      ok: true,
      data: {
        acknowledged: true,
        tenantId: "tenant-001",
      },
    });

    expect(mockUpdateTenant).toHaveBeenCalledWith(
      "tenant-001",
      expect.objectContaining({
        name: "Acme Corp",
        audit: expect.objectContaining({
          actorUserId: "user_1",
          correlationId: "corr_1",
        }),
      })
    );

    expect(recordActionAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "system_admin.settings.update",
        actorUserId: "user_1",
        module: "system_admin",
        result: "success",
        targetType: "system_admin_settings",
      })
    );
  });
});
