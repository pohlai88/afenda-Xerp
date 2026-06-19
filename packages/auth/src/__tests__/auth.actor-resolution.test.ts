import { describe, expect, it, vi } from "vitest";
import {
  clearPlatformUserIdCacheForTests,
  resolvePlatformActorUserId,
} from "../auth.actor-resolution.js";

const mockFindPlatformUserId = vi.fn();

vi.mock("@afenda/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/database")>();
  return {
    ...actual,
    findPlatformUserIdByAuthUserId: (...args: unknown[]) =>
      mockFindPlatformUserId(...args),
  };
});

describe("auth.actor-resolution", () => {
  it("returns pre-resolved platformUserId without a database lookup", async () => {
    clearPlatformUserIdCacheForTests();
    mockFindPlatformUserId.mockClear();

    await expect(
      resolvePlatformActorUserId({
        authUserId: "auth_user_1",
        platformUserId: "platform_user_1",
      })
    ).resolves.toBe("platform_user_1");

    expect(mockFindPlatformUserId).not.toHaveBeenCalled();
  });

  it("caches identity-link lookups per auth user id", async () => {
    clearPlatformUserIdCacheForTests();
    mockFindPlatformUserId.mockResolvedValue("platform_user_1");

    await expect(
      resolvePlatformActorUserId({ authUserId: "auth_user_1" })
    ).resolves.toBe("platform_user_1");
    await expect(
      resolvePlatformActorUserId({ authUserId: "auth_user_1" })
    ).resolves.toBe("platform_user_1");

    expect(mockFindPlatformUserId).toHaveBeenCalledOnce();
  });

  it("returns null when no auth identity is present", async () => {
    clearPlatformUserIdCacheForTests();
    mockFindPlatformUserId.mockClear();

    await expect(resolvePlatformActorUserId()).resolves.toBeNull();
    expect(mockFindPlatformUserId).not.toHaveBeenCalled();
  });
});
