import { beforeEach, describe, expect, it, vi } from "vitest";

import { AUTH_EVENT } from "../auth.contract.js";
import {
  AFENDA_PLATFORM_MIRROR_PROVIDER_ID,
  AuthMirrorSyncConflictError,
  syncAuthMirrorUser,
} from "../auth.mirror-sync.js";

const persistAuthAuditEvent = vi.fn().mockResolvedValue(undefined);
const findPlatformUserIdByAuthUserId = vi.fn();
const insertAuthIdentityLink = vi.fn().mockResolvedValue({ id: "link_1" });

const mockInternalAdapter = {
  createUser: vi.fn(),
  findUserByEmail: vi.fn(),
  updateUser: vi.fn(),
};

const mockPlatformDb = {
  select: vi.fn(),
};

vi.mock("../auth.audit.js", () => ({
  persistAuthAuditEvent: (...args: unknown[]) => persistAuthAuditEvent(...args),
}));

vi.mock("../auth.server.js", () => ({
  getAuth: () => ({
    $context: Promise.resolve({
      internalAdapter: mockInternalAdapter,
    }),
  }),
}));

vi.mock("@afenda/database", () => ({
  authIdentityLinks: {
    authUserId: "authUserId",
    id: "id",
    providerId: "providerId",
    userId: "userId",
  },
  findPlatformUserIdByAuthUserId: (...args: unknown[]) =>
    findPlatformUserIdByAuthUserId(...args),
  getDb: () => mockPlatformDb,
  insertAuthIdentityLink: (...args: unknown[]) =>
    insertAuthIdentityLink(...args),
}));

function chainSelect(rows: unknown[]) {
  const limit = vi.fn().mockResolvedValue(rows);
  const where = vi.fn().mockReturnValue({ limit });
  const from = vi.fn().mockReturnValue({ where });
  mockPlatformDb.select.mockReturnValueOnce({ from });
}

describe("syncAuthMirrorUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    findPlatformUserIdByAuthUserId.mockResolvedValue(null);
    mockInternalAdapter.createUser.mockResolvedValue({
      id: "auth_new",
      email: "jane@example.com",
      name: "Jane Doe",
      emailVerified: false,
    });
    mockInternalAdapter.findUserByEmail.mockResolvedValue(null);
    mockInternalAdapter.updateUser.mockResolvedValue(undefined);
  });

  it("creates auth user and identity link when none exist", async () => {
    chainSelect([]);
    chainSelect([]);

    const result = await syncAuthMirrorUser(
      {
        displayName: "Jane Doe",
        email: "Jane@Example.com",
        userId: "platform_user_1",
      },
      { platformDb: mockPlatformDb as never }
    );

    expect(result).toEqual({
      authUserId: "auth_new",
      createdAuthUser: true,
      createdIdentityLink: true,
      updatedAuthUser: false,
    });

    expect(mockInternalAdapter.createUser).toHaveBeenCalledWith({
      email: "jane@example.com",
      emailVerified: false,
      name: "Jane Doe",
    });
    expect(insertAuthIdentityLink).toHaveBeenCalledWith(
      expect.objectContaining({
        authUserId: "auth_new",
        providerId: AFENDA_PLATFORM_MIRROR_PROVIDER_ID,
        userId: "platform_user_1",
      }),
      mockPlatformDb
    );
  });

  it("updates existing auth user and skips link when mirror link exists", async () => {
    chainSelect([{ authUserId: "auth_existing" }]);
    chainSelect([{ id: "link_existing" }]);
    findPlatformUserIdByAuthUserId.mockResolvedValue("platform_user_1");

    const result = await syncAuthMirrorUser(
      {
        displayName: "Jane Doe",
        email: "jane@example.com",
        userId: "platform_user_1",
      },
      { platformDb: mockPlatformDb as never }
    );

    expect(result).toEqual({
      authUserId: "auth_existing",
      createdAuthUser: false,
      createdIdentityLink: false,
      updatedAuthUser: true,
    });
    expect(mockInternalAdapter.updateUser).toHaveBeenCalledWith(
      "auth_existing",
      {
        email: "jane@example.com",
        name: "Jane Doe",
      }
    );
    expect(insertAuthIdentityLink).not.toHaveBeenCalled();
  });

  it("audits and throws on identity conflict", async () => {
    chainSelect([{ authUserId: "auth_existing" }]);
    findPlatformUserIdByAuthUserId.mockResolvedValue("other_platform_user");

    await expect(
      syncAuthMirrorUser(
        {
          displayName: "Jane Doe",
          email: "jane@example.com",
          userId: "platform_user_1",
        },
        { platformDb: mockPlatformDb as never }
      )
    ).rejects.toBeInstanceOf(AuthMirrorSyncConflictError);

    expect(persistAuthAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: AUTH_EVENT.mirrorSyncFailed,
        result: "failure",
      })
    );
  });

  it("is idempotent when called twice with same input", async () => {
    chainSelect([{ authUserId: "auth_existing" }]);
    chainSelect([{ id: "link_existing" }]);
    findPlatformUserIdByAuthUserId.mockResolvedValue("platform_user_1");

    const first = await syncAuthMirrorUser(
      {
        displayName: "Jane Doe",
        email: "jane@example.com",
        userId: "platform_user_1",
      },
      { platformDb: mockPlatformDb as never }
    );

    chainSelect([{ authUserId: "auth_existing" }]);
    chainSelect([{ id: "link_existing" }]);
    findPlatformUserIdByAuthUserId.mockResolvedValue("platform_user_1");

    const second = await syncAuthMirrorUser(
      {
        displayName: "Jane Doe",
        email: "jane@example.com",
        userId: "platform_user_1",
      },
      { platformDb: mockPlatformDb as never }
    );

    expect(second).toEqual(first);
    expect(insertAuthIdentityLink).not.toHaveBeenCalled();
  });

  it("swallows audit persistence errors on failure path", async () => {
    chainSelect([{ authUserId: "auth_existing" }]);
    findPlatformUserIdByAuthUserId.mockResolvedValue("other_platform_user");
    persistAuthAuditEvent.mockRejectedValueOnce(new Error("audit down"));

    await expect(
      syncAuthMirrorUser(
        {
          displayName: "Jane Doe",
          email: "jane@example.com",
          userId: "platform_user_1",
        },
        { platformDb: mockPlatformDb as never }
      )
    ).rejects.toBeInstanceOf(AuthMirrorSyncConflictError);
  });
});
