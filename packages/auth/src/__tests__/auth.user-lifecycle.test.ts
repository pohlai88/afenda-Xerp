import { beforeEach, describe, expect, it, vi } from "vitest";

import { deactivatePlatformUserWithSessionRevoke } from "../auth.user-lifecycle.js";

const deactivateUser = vi.fn();
const revokeAuthSessionsForPlatformUser = vi.fn();

vi.mock("@afenda/database", () => ({
  deactivateUser: (...args: unknown[]) => deactivateUser(...args),
}));

vi.mock("../auth.session-revoke.js", () => ({
  revokeAuthSessionsForPlatformUser: (...args: unknown[]) =>
    revokeAuthSessionsForPlatformUser(...args),
}));

describe("deactivatePlatformUserWithSessionRevoke", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    deactivateUser.mockResolvedValue({ id: "platform-user-1" });
    revokeAuthSessionsForPlatformUser.mockResolvedValue(2);
  });

  it("deactivates platform user then revokes linked auth sessions", async () => {
    const input = {
      audit: {
        actorType: "user" as const,
        correlationId: "corr-deactivate-1",
      },
      reason: "Offboarded",
    };

    await expect(
      deactivatePlatformUserWithSessionRevoke("platform-user-1", input)
    ).resolves.toEqual({ id: "platform-user-1" });

    expect(deactivateUser).toHaveBeenCalledWith("platform-user-1", input);
    expect(revokeAuthSessionsForPlatformUser).toHaveBeenCalledWith({
      correlationId: "corr-deactivate-1",
      platformUserId: "platform-user-1",
    });
  });
});
