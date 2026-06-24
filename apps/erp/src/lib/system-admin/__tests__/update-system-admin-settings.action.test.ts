import { describe, expect, it, vi } from "vitest";

const { mockResolveActionOperatingContext, mockCreatePinoLogger } = vi.hoisted(
  () => ({
    mockResolveActionOperatingContext: vi.fn(),
    mockCreatePinoLogger: vi.fn(() => ({
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    })),
  })
);

vi.mock("@/lib/server-actions/resolve-action-operating-context.server", () => ({
  resolveActionOperatingContext: mockResolveActionOperatingContext,
}));

vi.mock("@/lib/observability/create-request-bound-logger", () => ({
  createRequestBoundErpLogger: vi.fn(async () => mockCreatePinoLogger()),
}));

vi.mock("@/lib/server-actions/record-action-audit", () => ({
  recordActionAudit: vi.fn(async () => undefined),
}));

import { recordActionAudit } from "@/lib/server-actions/record-action-audit";
import { SYSTEM_ADMIN_SETTINGS_SCAFFOLD_FAILURE_MESSAGE } from "@/lib/system-admin/system-admin-settings.copy.contract";
import { UPDATE_SYSTEM_ADMIN_SETTINGS_INTENT } from "@/lib/system-admin/system-admin-settings.schema";
import { updateSystemAdminSettingsAction } from "@/lib/system-admin/update-system-admin-settings.action";

const sampleSession = {
  sessionId: "sess_1",
  user: {
    userId: "user_1",
    email: "user@example.com",
    name: "Test User",
    emailVerified: true,
  },
  metadata: {
    image: null,
    issuedAt: "2026-06-20T00:00:00.000Z",
    expiresAt: "2026-06-27T00:00:00.000Z",
    ipAddress: null,
    userAgent: null,
  },
} as const;

function createFormData(intent: string | null): FormData {
  const formData = new FormData();
  if (intent !== null) {
    formData.set("intent", intent);
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

  it("returns scaffold FORBIDDEN with denied audit when context resolves", async () => {
    mockResolveActionOperatingContext.mockResolvedValueOnce({
      ok: true,
      session: sampleSession,
      operatingContext: {
        workspace: {
          tenantId: "tenant-001",
          companyId: "company-001",
          organizationId: null,
          projectId: null,
        },
      },
    });

    await expect(
      updateSystemAdminSettingsAction(
        null,
        createFormData(UPDATE_SYSTEM_ADMIN_SETTINGS_INTENT)
      )
    ).resolves.toEqual({
      ok: false,
      code: "FORBIDDEN",
      userMessage: SYSTEM_ADMIN_SETTINGS_SCAFFOLD_FAILURE_MESSAGE,
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
});
