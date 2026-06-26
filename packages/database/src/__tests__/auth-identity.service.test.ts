import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  findPlatformUserIdByAuthUserId,
  listAuthUserIdsByPlatformUserId,
} from "../auth/auth-identity.service.js";

function createIdentityLinkDb(
  rows: Array<{ authUserId: string; userId: string }>
) {
  const select = vi.fn(() => ({
    from: vi.fn(() => ({
      where: vi.fn(async () => rows),
    })),
  }));

  return { select };
}

describe("auth-identity.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists auth user ids linked to a platform user", async () => {
    const platformUserId = randomUUID();
    const db = createIdentityLinkDb([
      { authUserId: "auth-1", userId: platformUserId },
      { authUserId: "auth-2", userId: platformUserId },
    ]);

    await expect(
      listAuthUserIdsByPlatformUserId(platformUserId, db as never)
    ).resolves.toEqual(["auth-1", "auth-2"]);
  });

  it("returns empty list when no links exist", async () => {
    const db = createIdentityLinkDb([]);

    await expect(
      listAuthUserIdsByPlatformUserId(randomUUID(), db as never)
    ).resolves.toEqual([]);
  });

  it("resolves platform user id from auth user id", async () => {
    const platformUserId = randomUUID();
    const db = {
      select: vi.fn(() => ({
        from: vi.fn(() => ({
          where: vi.fn(() => ({
            limit: vi.fn(async () => [{ userId: platformUserId }]),
          })),
        })),
      })),
    };

    await expect(
      findPlatformUserIdByAuthUserId("auth-1", db as never)
    ).resolves.toBe(platformUserId);
  });
});
