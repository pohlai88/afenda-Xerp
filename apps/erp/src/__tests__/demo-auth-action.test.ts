import { describe, expect, it, vi } from "vitest";

const { mockRequireSession } = vi.hoisted(() => ({
  mockRequireSession: vi.fn(),
}));

vi.mock("@/lib/auth/require-session", () => ({
  requireSession: mockRequireSession,
}));

import { recordProtectedDemoAction } from "../app/(protected)/actions/demo-auth-action";

describe("recordProtectedDemoAction", () => {
  it("returns unauthenticated when requireSession fails", async () => {
    const { UnauthenticatedError } = await import("@afenda/auth");
    mockRequireSession.mockRejectedValueOnce(new UnauthenticatedError());

    await expect(recordProtectedDemoAction("demo")).resolves.toEqual({
      ok: false,
      code: "unauthenticated",
    });
  });

  it("returns success payload when session exists", async () => {
    mockRequireSession.mockResolvedValueOnce({
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
    });

    await expect(recordProtectedDemoAction("demo")).resolves.toEqual({
      ok: true,
      message: "demo",
      userId: "user_1",
    });
  });
});
