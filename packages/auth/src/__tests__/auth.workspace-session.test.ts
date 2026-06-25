import { beforeEach, describe, expect, it, vi } from "vitest";

const { updateMock, setMock, whereMock } = vi.hoisted(() => {
  const whereMock = vi.fn(async () => undefined);
  const setMock = vi.fn(() => ({ where: whereMock }));
  const updateMock = vi.fn(() => ({ set: setMock }));
  return { updateMock, setMock, whereMock };
});

vi.mock("@afenda/database", () => ({
  authSession: { id: "id", activeWorkspaceId: "active_workspace_id" },
  getDb: vi.fn(() => ({
    update: updateMock,
  })),
}));

import { persistAuthSessionActiveWorkspaceId } from "../auth.workspace-session.js";

describe("persistAuthSessionActiveWorkspaceId", () => {
  beforeEach(() => {
    updateMock.mockClear();
    setMock.mockClear();
    whereMock.mockClear();
  });

  it("persists trimmed workspace scope on the auth session row", async () => {
    await persistAuthSessionActiveWorkspaceId({
      sessionId: "sess-001",
      activeWorkspaceId: "tenant-001:company-001:root",
    });

    expect(updateMock).toHaveBeenCalled();
    expect(setMock).toHaveBeenCalledWith(
      expect.objectContaining({
        activeWorkspaceId: "tenant-001:company-001:root",
      })
    );
    expect(whereMock).toHaveBeenCalled();
  });

  it("normalizes whitespace-only workspace scope to null", async () => {
    await persistAuthSessionActiveWorkspaceId({
      sessionId: "sess-001",
      activeWorkspaceId: "   ",
    });

    expect(setMock).toHaveBeenCalledWith(
      expect.objectContaining({
        activeWorkspaceId: null,
      })
    );
  });

  it("rejects empty session id", async () => {
    await expect(
      persistAuthSessionActiveWorkspaceId({
        sessionId: "  ",
        activeWorkspaceId: null,
      })
    ).rejects.toThrow(/sessionId is required/i);
  });
});
