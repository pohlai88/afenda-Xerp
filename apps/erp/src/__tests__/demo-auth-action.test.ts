import { describe, expect, it, vi } from "vitest";

const {
  mockResolveActionOperatingContext,
  mockRecordActionAudit,
  mockCreatePinoLogger,
} = vi.hoisted(() => ({
  mockResolveActionOperatingContext: vi.fn(),
  mockRecordActionAudit: vi.fn(),
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

vi.mock("@/lib/server-actions/record-action-audit", () => ({
  recordActionAudit: mockRecordActionAudit,
}));

vi.mock("@/lib/observability/create-request-bound-logger", () => ({
  createRequestBoundErpLogger: vi.fn(async () => mockCreatePinoLogger()),
}));

import { recordProtectedDemoAction } from "../app/(protected)/actions/demo-auth-action";

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

const sampleOperatingContext = {
  workspace: {
    tenantId: "tenant-001",
    companyId: "company-001",
    organizationId: null,
    projectId: null,
    teamId: null,
  },
} as const;

describe("recordProtectedDemoAction — server action security", () => {
  it("returns UNAUTHORIZED when operating context cannot be resolved", async () => {
    mockResolveActionOperatingContext.mockResolvedValueOnce({
      ok: false,
      error: {
        code: "UNAUTHORIZED",
        userMessage: "Sign in to continue.",
      },
    });

    await expect(
      recordProtectedDemoAction({ message: "demo" })
    ).resolves.toEqual({
      ok: false,
      code: "UNAUTHORIZED",
      userMessage: "Sign in to continue.",
    });
  });

  it("returns VALIDATION_ERROR for invalid input without reaching audit", async () => {
    mockResolveActionOperatingContext.mockResolvedValueOnce({
      ok: true,
      session: sampleSession,
      operatingContext: sampleOperatingContext,
    });

    await expect(
      recordProtectedDemoAction({ message: "   " })
    ).resolves.toEqual({
      ok: false,
      code: "VALIDATION_ERROR",
      userMessage: "Please check the highlighted fields.",
      fields: expect.arrayContaining([
        expect.objectContaining({ path: "message" }),
      ]),
    });

    expect(mockRecordActionAudit).not.toHaveBeenCalled();
  });

  it("rejects untrusted authority fields in the payload", async () => {
    mockResolveActionOperatingContext.mockResolvedValueOnce({
      ok: true,
      session: sampleSession,
      operatingContext: sampleOperatingContext,
    });

    await expect(
      recordProtectedDemoAction({
        message: "demo",
        tenantId: "other-tenant",
      })
    ).resolves.toEqual({
      ok: false,
      code: "VALIDATION_ERROR",
      userMessage: "Please check the highlighted fields.",
      fields: expect.arrayContaining([
        expect.objectContaining({ path: "tenantId" }),
      ]),
    });

    expect(mockRecordActionAudit).not.toHaveBeenCalled();
  });

  it("returns shaped success data without internal session fields", async () => {
    mockResolveActionOperatingContext.mockResolvedValueOnce({
      ok: true,
      session: sampleSession,
      operatingContext: sampleOperatingContext,
    });
    mockRecordActionAudit.mockResolvedValueOnce(undefined);

    await expect(
      recordProtectedDemoAction({ message: "demo" })
    ).resolves.toEqual({
      ok: true,
      data: { message: "demo" },
    });

    expect(mockRecordActionAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "demo.protected.record",
        actorUserId: "user_1",
        result: "success",
        targetId: "company-001",
      })
    );
  });

  it("rejects untrusted raw string input", async () => {
    mockResolveActionOperatingContext.mockResolvedValueOnce({
      ok: true,
      session: sampleSession,
      operatingContext: sampleOperatingContext,
    });

    await expect(recordProtectedDemoAction("demo")).resolves.toEqual({
      ok: false,
      code: "VALIDATION_ERROR",
      userMessage: "Please check the highlighted fields.",
      fields: expect.any(Array),
    });
  });
});
