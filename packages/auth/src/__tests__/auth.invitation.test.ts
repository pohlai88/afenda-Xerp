import { beforeEach, describe, expect, it } from "vitest";

import {
  AuthInvitationRejectedError,
  consumeAuthInvitation,
  listPendingAuthInvitationsForTenant,
  readInvitationTokenFromBody,
  registerAuthInvitation,
  resendAuthInvitationById,
  resetAuthInvitationStoreForTests,
  revokeAuthInvitation,
  validateAuthInvitation,
} from "../auth.invitation.js";

describe("auth.invitation", () => {
  beforeEach(() => {
    resetAuthInvitationStoreForTests();
  });

  it("registers and validates a matching invitation token", () => {
    const invitation = registerAuthInvitation({
      email: "User@Example.com",
      token: "invite_token_1",
    });

    expect(
      validateAuthInvitation({
        email: "user@example.com",
        token: "invite_token_1",
      })
    ).toEqual({
      status: "valid",
      invitation,
    });
  });

  it("rejects missing, expired, consumed, and email-mismatch tokens", () => {
    registerAuthInvitation({
      email: "user@example.com",
      expiresAt: new Date(Date.now() - 1000),
      token: "expired_token",
    });
    registerAuthInvitation({
      email: "user@example.com",
      token: "consumed_token",
    });
    consumeAuthInvitation("consumed_token");

    expect(() =>
      validateAuthInvitation({
        email: "user@example.com",
        token: "missing_token",
      })
    ).toThrow(AuthInvitationRejectedError);

    expect(() =>
      validateAuthInvitation({
        email: "user@example.com",
        token: "expired_token",
      })
    ).toThrow(/expired/i);

    expect(() =>
      validateAuthInvitation({
        email: "user@example.com",
        token: "consumed_token",
      })
    ).toThrow(/already been used/i);

    registerAuthInvitation({
      email: "other@example.com",
      token: "other_email_token",
    });

    expect(() =>
      validateAuthInvitation({
        email: "user@example.com",
        token: "other_email_token",
      })
    ).toThrow(/does not match/i);
  });

  it("reads invitationToken from sign-up request bodies", () => {
    expect(
      readInvitationTokenFromBody({
        email: "user@example.com",
        invitationToken: " invite_123 ",
        password: "secret",
      })
    ).toBe("invite_123");
    expect(
      readInvitationTokenFromBody({ email: "user@example.com" })
    ).toBeUndefined();
  });

  it("lists pending invitations by tenant and revokes by token", () => {
    registerAuthInvitation({
      email: "a@example.com",
      tenantId: "tenant-a",
      token: "token-a",
    });
    registerAuthInvitation({
      email: "b@example.com",
      tenantId: "tenant-b",
      token: "token-b",
    });

    expect(listPendingAuthInvitationsForTenant("tenant-a")).toHaveLength(1);
    expect(revokeAuthInvitation("token-a")).toBe(true);
    expect(listPendingAuthInvitationsForTenant("tenant-a")).toHaveLength(0);
    expect(revokeAuthInvitation("token-a")).toBe(false);
  });

  it("resends a pending invitation with a fresh token", () => {
    const invitation = registerAuthInvitation({
      email: "user@example.com",
      invitationId: "invite_1",
      tenantId: "tenant-a",
      token: "original_token",
    });

    const resent = resendAuthInvitationById("invite_1");

    expect(resent).not.toBeNull();
    expect(resent?.invitationId).toBe("invite_1");
    expect(resent?.token).not.toBe("original_token");
    expect(() =>
      validateAuthInvitation({
        email: "user@example.com",
        token: "original_token",
      })
    ).toThrow(AuthInvitationRejectedError);
    expect(
      validateAuthInvitation({
        email: "user@example.com",
        token: resent?.token ?? "",
      }).status
    ).toBe("valid");
    expect(invitation.invitationId).toBe("invite_1");
  });
});
