import {
  defaultUserDisplayPreferences,
  type UserDisplayPreferences,
} from "@afenda/database";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  mockResolveActionOperatingContext,
  mockUpsertUserPreferencesSection,
  mockCreatePinoLogger,
} = vi.hoisted(() => ({
  mockResolveActionOperatingContext: vi.fn(),
  mockUpsertUserPreferencesSection: vi.fn(),
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

vi.mock("@afenda/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/database")>();
  return {
    ...actual,
    upsertUserPreferencesSection: mockUpsertUserPreferencesSection,
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

import { revalidatePath } from "next/cache";

import { recordActionAudit } from "@/lib/server-actions/record-action-audit";
import {
  UPDATE_USER_PREFERENCES_SETTINGS_INTENT,
  updateUserPreferencesSettingsAction,
} from "@/lib/user-settings/update-user-preferences-settings.action";
import { USER_SETTINGS_AUDIT_EVENTS } from "@/lib/user-settings/user-settings-audit.registry";

const sampleOperatingContext = {
  actor: { userId: "user-001" },
  correlationId: "corr-preferences",
} as const;

function createFormData(payload: UserDisplayPreferences): FormData {
  const formData = new FormData();
  formData.set("intent", UPDATE_USER_PREFERENCES_SETTINGS_INTENT);
  formData.set("payload", JSON.stringify(payload));
  return formData;
}

describe("updateUserPreferencesSettingsAction", () => {
  beforeEach(() => {
    mockResolveActionOperatingContext.mockReset();
    mockUpsertUserPreferencesSection.mockReset();
    vi.mocked(recordActionAudit).mockClear();
    vi.mocked(revalidatePath).mockClear();
    mockUpsertUserPreferencesSection.mockResolvedValue({
      id: "pref-001",
      userId: "user-001",
    });
  });

  it("rejects invalid intent", async () => {
    const formData = new FormData();
    formData.set("intent", "invalid");
    formData.set("payload", JSON.stringify(defaultUserDisplayPreferences));

    const result = await updateUserPreferencesSettingsAction(null, formData);

    expect(result?.ok).toBe(false);
    expect(mockUpsertUserPreferencesSection).not.toHaveBeenCalled();
  });

  it("rejects unauthenticated requests", async () => {
    mockResolveActionOperatingContext.mockResolvedValueOnce({
      ok: false,
      error: { code: "UNAUTHORIZED", userMessage: "Sign in required." },
    });

    const result = await updateUserPreferencesSettingsAction(
      null,
      createFormData(defaultUserDisplayPreferences)
    );

    expect(result?.ok).toBe(false);
    expect(mockUpsertUserPreferencesSection).not.toHaveBeenCalled();
  });

  it("persists display preferences for the linked actor", async () => {
    mockResolveActionOperatingContext.mockResolvedValueOnce({
      ok: true,
      operatingContext: sampleOperatingContext,
      session: {
        user: { userId: "user-001" },
      },
    });

    const payload: UserDisplayPreferences = {
      theme: "dark",
      locale: "de",
      density: "compact",
      timezone: "Europe/Berlin",
    };

    const result = await updateUserPreferencesSettingsAction(
      null,
      createFormData(payload)
    );

    expect(result).toEqual({
      ok: true,
      data: { acknowledged: true, userId: "user-001" },
    });
    expect(mockUpsertUserPreferencesSection).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-001",
        section: "display",
        value: payload,
        audit: expect.objectContaining({ actorUserId: "user-001" }),
      })
    );
    expect(revalidatePath).toHaveBeenCalledWith("/settings/preferences");
    expect(recordActionAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        action: USER_SETTINGS_AUDIT_EVENTS.preferencesUpdated,
        actorUserId: "user-001",
        result: "success",
      })
    );
  });
});
