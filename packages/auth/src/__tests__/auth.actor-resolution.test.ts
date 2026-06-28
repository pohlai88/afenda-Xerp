import { describe, expect, it, vi } from "vitest";
import {
  clearPlatformUserIdCacheForTests,
  resolveEnterpriseUserIdFromPlatformUserId,
  resolvePlatformActorUserId,
} from "../auth.actor-resolution.js";
import { AUTH_TEST_PLATFORM_USER_ID } from "./auth-id-test-fixtures.js";

const mockFindPlatformUserId = vi.fn();
const mockFindUserEnterpriseId = vi.fn();

vi.mock("@afenda/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/database")>();
  return {
    ...actual,
    findPlatformUserIdByAuthUserId: (...args: unknown[]) =>
      mockFindPlatformUserId(...args),
    findUserEnterpriseIdByPlatformUserId: (...args: unknown[]) =>
      mockFindUserEnterpriseId(...args),
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

  it("resolves and caches enterprise user id from platform pk", async () => {
    clearPlatformUserIdCacheForTests();
    mockFindUserEnterpriseId.mockResolvedValue(AUTH_TEST_PLATFORM_USER_ID);

    await expect(
      resolveEnterpriseUserIdFromPlatformUserId(
        "018f9f8c-9f1a-7c2b-9c20-000000000003"
      )
    ).resolves.toBe(AUTH_TEST_PLATFORM_USER_ID);
    await expect(
      resolveEnterpriseUserIdFromPlatformUserId(
        "018f9f8c-9f1a-7c2b-9c20-000000000003"
      )
    ).resolves.toBe(AUTH_TEST_PLATFORM_USER_ID);

    expect(mockFindUserEnterpriseId).toHaveBeenCalledOnce();
  });
});
