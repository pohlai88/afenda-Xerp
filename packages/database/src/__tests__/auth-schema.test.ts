import { getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import {
  AUTH_ADAPTER_SENSITIVE_ACCOUNT_FIELDS,
  authAccount,
  authIdentityLinks,
  authSession,
  authTwoFactor,
  authUser,
  authVerification,
  toPublicAuthAccount,
} from "../index.js";

describe("Better Auth schema boundary", () => {
  it("uses prefixed SQL table names", () => {
    expect(getTableName(authUser)).toBe("auth_user");
    expect(getTableName(authSession)).toBe("auth_session");
    expect(getTableName(authAccount)).toBe("auth_account");
    expect(getTableName(authVerification)).toBe("auth_verification");
    expect(getTableName(authTwoFactor)).toBe("auth_two_factor");
    expect(getTableName(authIdentityLinks)).toBe("auth_identity_links");
  });

  it("maps auth identity link platform user FK to user_id (migration column)", () => {
    expect(authIdentityLinks.userId.name).toBe("user_id");
  });

  it("maps auth session active workspace column to active_workspace_id", () => {
    expect(authSession.activeWorkspaceId.name).toBe("active_workspace_id");
  });

  it("strips sensitive account credential fields from public projections", () => {
    const publicAccount = toPublicAuthAccount({
      id: "acc_1",
      accountId: "provider-account",
      providerId: "credential",
      userId: "auth_user_1",
      accessToken: "secret-access",
      refreshToken: "secret-refresh",
      idToken: "secret-id",
      password: "secret-password",
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      scope: null,
      createdAt: new Date("2026-06-20T00:00:00.000Z"),
      updatedAt: new Date("2026-06-20T00:00:00.000Z"),
    });

    expect(publicAccount).not.toHaveProperty("accessToken");
    expect(publicAccount).not.toHaveProperty("refreshToken");
    expect(publicAccount).not.toHaveProperty("idToken");
    expect(publicAccount).not.toHaveProperty("password");
    expect(AUTH_ADAPTER_SENSITIVE_ACCOUNT_FIELDS).toEqual([
      "accessToken",
      "refreshToken",
      "idToken",
      "password",
    ]);
  });
});
