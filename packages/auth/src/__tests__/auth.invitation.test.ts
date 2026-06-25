import { MemberInvitationRejectedError } from "@afenda/database";
import { beforeEach, describe, expect, it, vi } from "vitest";
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

const registerMemberInvitation = vi.fn();
const validateMemberInvitation = vi.fn();
const consumeMemberInvitation = vi.fn();
const listPendingMemberInvitationsForTenant = vi.fn();
const revokeMemberInvitation = vi.fn();
const revokeMemberInvitationById = vi.fn();
const resendMemberInvitationById = vi.fn();
const resetMemberInvitationsForTests = vi.fn();

vi.mock("@afenda/database", () => ({
  consumeMemberInvitation: (...args: unknown[]) =>
    consumeMemberInvitation(...args),
  listPendingMemberInvitationsForTenant: (...args: unknown[]) =>
    listPendingMemberInvitationsForTenant(...args),
  MemberInvitationRejectedError: class MemberInvitationRejectedError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "MemberInvitationRejectedError";
    }
  },
  registerMemberInvitation: (...args: unknown[]) =>
    registerMemberInvitation(...args),
  resendMemberInvitationById: (...args: unknown[]) =>
    resendMemberInvitationById(...args),
  resetMemberInvitationsForTests: (...args: unknown[]) =>
    resetMemberInvitationsForTests(...args),
  revokeMemberInvitation: (...args: unknown[]) =>
    revokeMemberInvitation(...args),
  revokeMemberInvitationById: (...args: unknown[]) =>
    revokeMemberInvitationById(...args),
  validateMemberInvitation: (...args: unknown[]) =>
    validateMemberInvitation(...args),
}));

describe("auth.invitation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMemberInvitationsForTests.mockResolvedValue(undefined);
  });

  it("registers and validates a matching invitation token", async () => {
    const invitation = {
      email: "user@example.com",
      expiresAt: Date.now() + 60_000,
      invitationId: "invite_1",
      token: "invite_token_1",
    };

    registerMemberInvitation.mockResolvedValue(invitation);
    validateMemberInvitation.mockResolvedValue({
      status: "valid",
      invitation,
    });

    await expect(
      registerAuthInvitation({
        email: "User@Example.com",
        token: "invite_token_1",
      })
    ).resolves.toEqual(invitation);

    await expect(
      validateAuthInvitation({
        email: "user@example.com",
        token: "invite_token_1",
      })
    ).resolves.toEqual({
      status: "valid",
      invitation,
    });
  });

  it("rejects missing, expired, consumed, and email-mismatch tokens", async () => {
    validateMemberInvitation
      .mockRejectedValueOnce(
        new MemberInvitationRejectedError("Invitation token is invalid.")
      )
      .mockRejectedValueOnce(
        new MemberInvitationRejectedError("Invitation token has expired.")
      )
      .mockRejectedValueOnce(
        new MemberInvitationRejectedError(
          "Invitation token has already been used."
        )
      )
      .mockRejectedValueOnce(
        new MemberInvitationRejectedError(
          "Invitation token does not match the sign-up email."
        )
      );

    await expect(
      validateAuthInvitation({
        email: "user@example.com",
        token: "missing_token",
      })
    ).rejects.toThrow(AuthInvitationRejectedError);

    await expect(
      validateAuthInvitation({
        email: "user@example.com",
        token: "expired_token",
      })
    ).rejects.toThrow(/expired/i);

    await expect(
      validateAuthInvitation({
        email: "user@example.com",
        token: "consumed_token",
      })
    ).rejects.toThrow(/already been used/i);

    await expect(
      validateAuthInvitation({
        email: "user@example.com",
        token: "other_email_token",
      })
    ).rejects.toThrow(/does not match/i);
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

  it("lists pending invitations by tenant and revokes by token", async () => {
    listPendingMemberInvitationsForTenant
      .mockResolvedValueOnce([{ invitationId: "invite_1" }])
      .mockResolvedValueOnce([]);
    revokeMemberInvitation
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    await expect(
      listPendingAuthInvitationsForTenant("tenant-a")
    ).resolves.toHaveLength(1);
    await expect(revokeAuthInvitation("token-a")).resolves.toBe(true);
    await expect(
      listPendingAuthInvitationsForTenant("tenant-a")
    ).resolves.toHaveLength(0);
    await expect(revokeAuthInvitation("token-a")).resolves.toBe(false);
  });

  it("resends a pending invitation with a fresh token", async () => {
    const invitation = {
      email: "user@example.com",
      expiresAt: Date.now() + 60_000,
      invitationId: "invite_1",
      tenantId: "tenant-a",
      token: "original_token",
    };
    const resent = {
      ...invitation,
      token: "fresh_token",
    };

    registerMemberInvitation.mockResolvedValue(invitation);
    resendMemberInvitationById.mockResolvedValue(resent);
    validateMemberInvitation
      .mockRejectedValueOnce(new MemberInvitationRejectedError("invalid"))
      .mockResolvedValueOnce({ status: "valid", invitation: resent });

    await expect(resendAuthInvitationById("invite_1")).resolves.toEqual(resent);

    await expect(
      validateAuthInvitation({
        email: "user@example.com",
        token: "original_token",
      })
    ).rejects.toThrow(AuthInvitationRejectedError);

    await expect(
      validateAuthInvitation({
        email: "user@example.com",
        token: "fresh_token",
      })
    ).resolves.toEqual({ status: "valid", invitation: resent });
  });

  it("delegates consume and reset helpers to the database service", async () => {
    const consumed = {
      email: "user@example.com",
      expiresAt: Date.now() + 60_000,
      invitationId: "invite_1",
      token: "token",
      consumedAt: Date.now(),
    };

    consumeMemberInvitation.mockResolvedValue(consumed);

    await expect(consumeAuthInvitation("token")).resolves.toEqual(consumed);
    await resetAuthInvitationStoreForTests();
    expect(resetMemberInvitationsForTests).toHaveBeenCalledOnce();
  });
});
