import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockResolveActionOperatingContext,
  mockUpdateUser,
  mockSyncAuthMirrorUser,
  mockCreatePinoLogger,
} = vi.hoisted(() => ({
  mockResolveActionOperatingContext: vi.fn(),
  mockUpdateUser: vi.fn(),
  mockSyncAuthMirrorUser: vi.fn(),
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

vi.mock("@afenda/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/auth")>();
  return {
    ...actual,
    syncAuthMirrorUser: mockSyncAuthMirrorUser,
  };
});

vi.mock("@afenda/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/database")>();
  return {
    ...actual,
    getDb: vi.fn(() => ({
      select: vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            limit: vi.fn(async () => [{ email: "user@example.com" }]),
          })),
        })),
      })),
    })),
    updateUser: mockUpdateUser,
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
import {
  UPDATE_USER_PROFILE_SETTINGS_INTENT,
  updateUserProfileSettingsAction,
} from "@/lib/user-settings/update-user-profile-settings.action";
import { USER_SETTINGS_AUDIT_EVENTS } from "@/lib/user-settings/user-settings-audit.registry";

const sampleOperatingContext = {
  actor: { userId: "user-001" },
  correlationId: "corr-profile",
} as const;

function createFormData(displayName: string): FormData {
  const formData = new FormData();
  formData.set("intent", UPDATE_USER_PROFILE_SETTINGS_INTENT);
  formData.set("displayName", displayName);
  return formData;
}

describe("updateUserProfileSettingsAction", () => {
  beforeEach(() => {
    mockResolveActionOperatingContext.mockReset();
    mockUpdateUser.mockReset();
    mockSyncAuthMirrorUser.mockReset();
    vi.mocked(recordActionAudit).mockClear();
    mockUpdateUser.mockResolvedValue({ id: "user-001" });
    mockSyncAuthMirrorUser.mockResolvedValue({
      authUserId: "auth-001",
      createdAuthUser: false,
      createdIdentityLink: false,
      updatedAuthUser: true,
    });
  });

  it("rejects invalid intent", async () => {
    const formData = new FormData();
    formData.set("intent", "invalid");
    formData.set("displayName", "Alex");

    const result = await updateUserProfileSettingsAction(null, formData);

    expect(result?.ok).toBe(false);
  });

  it("rejects unauthenticated requests", async () => {
    mockResolveActionOperatingContext.mockResolvedValueOnce({
      ok: false,
      error: { code: "UNAUTHORIZED", userMessage: "Sign in required." },
    });

    const result = await updateUserProfileSettingsAction(
      null,
      createFormData("Alex")
    );

    expect(result?.ok).toBe(false);
  });

  it("persists display name for the linked actor only", async () => {
    mockResolveActionOperatingContext.mockResolvedValueOnce({
      ok: true,
      operatingContext: sampleOperatingContext,
      session: {
        user: { userId: "user-001" },
      },
    });

    const result = await updateUserProfileSettingsAction(
      null,
      createFormData("Alex Example")
    );

    expect(result).toEqual({
      ok: true,
      data: { acknowledged: true, userId: "user-001" },
    });
    expect(mockUpdateUser).toHaveBeenCalledWith(
      "user-001",
      expect.objectContaining({
        displayName: "Alex Example",
        audit: expect.objectContaining({ actorUserId: "user-001" }),
      })
    );
    expect(mockSyncAuthMirrorUser).toHaveBeenCalledWith({
      userId: "user-001",
      email: "user@example.com",
      displayName: "Alex Example",
    });
    expect(recordActionAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        action: USER_SETTINGS_AUDIT_EVENTS.profileUpdated,
        actorUserId: "user-001",
        result: "success",
      })
    );
  });
});
