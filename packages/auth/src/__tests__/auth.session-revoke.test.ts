import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUTH_EVENT } from "../auth.contract.js";
import { revokeAuthSessionsForPlatformUser } from "../auth.session-revoke.js";

const persistAuthAuditEvent = vi.fn().mockResolvedValue(undefined);
const listAuthUserIdsByPlatformUserId = vi.fn();
const deleteMock = vi.fn();

const mockAuthDb = {
  delete: deleteMock,
};

vi.mock("../auth.audit.js", () => ({
  persistAuthAuditEvent: (...args: unknown[]) => persistAuthAuditEvent(...args),
}));

vi.mock("@afenda/database", () => ({
  authSession: { id: "id", userId: "userId" },
  getAuthDb: () => mockAuthDb,
  listAuthUserIdsByPlatformUserId: (...args: unknown[]) =>
    listAuthUserIdsByPlatformUserId(...args),
}));

describe("revokeAuthSessionsForPlatformUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    deleteMock.mockReturnValue({
      where: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([]),
      }),
    });
  });

  it("returns zero when no auth identities are linked", async () => {
    listAuthUserIdsByPlatformUserId.mockResolvedValueOnce([]);

    await expect(
      revokeAuthSessionsForPlatformUser({ platformUserId: "platform-user-1" })
    ).resolves.toBe(0);

    expect(deleteMock).not.toHaveBeenCalled();
    expect(persistAuthAuditEvent).not.toHaveBeenCalled();
  });

  it("deletes sessions and audits sessionInvalidated", async () => {
    listAuthUserIdsByPlatformUserId.mockResolvedValueOnce([
      "auth-user-1",
      "auth-user-2",
    ]);
    deleteMock.mockReturnValueOnce({
      where: vi.fn().mockReturnValue({
        returning: vi
          .fn()
          .mockResolvedValue([{ id: "sess-1" }, { id: "sess-2" }]),
      }),
    });

    await expect(
      revokeAuthSessionsForPlatformUser({
        correlationId: "corr-revoke-1",
        platformUserId: "platform-user-1",
      })
    ).resolves.toBe(2);

    expect(persistAuthAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: AUTH_EVENT.sessionInvalidated,
        result: "success",
        context: {
          correlationId: "corr-revoke-1",
          platformUserId: "platform-user-1",
        },
      })
    );
  });
});
