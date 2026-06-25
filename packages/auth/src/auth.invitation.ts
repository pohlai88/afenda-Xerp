import {
  consumeMemberInvitation,
  listPendingMemberInvitationsForTenant,
  MemberInvitationRejectedError,
  registerMemberInvitation,
  resendMemberInvitationById,
  resetMemberInvitationsForTests,
  revokeMemberInvitation,
  revokeMemberInvitationById,
  validateMemberInvitation,
} from "@afenda/database";

/**
 * ARCH-AUTH-001 Slice 11 — invitation gate backed by `member_invitations`.
 *
 * Public API delegates to `@afenda/database` member-invitation service.
 * Plain tokens are returned only at registration/resend; persistence stores hashes.
 */

export interface AuthInvitationRecord {
  readonly consumedAt?: number;
  readonly email: string;
  readonly expiresAt: number;
  readonly invitationId: string;
  readonly platformUserId?: string;
  readonly tenantId?: string;
  readonly token: string;
}

export interface RegisterAuthInvitationInput {
  readonly email: string;
  readonly expiresAt?: Date;
  readonly invitationId?: string;
  readonly platformUserId?: string;
  readonly tenantId?: string;
  readonly token?: string;
}

export interface ValidateAuthInvitationInput {
  readonly email: string;
  readonly token: string;
}

export interface ValidateAuthInvitationResult {
  readonly invitation: AuthInvitationRecord;
  readonly status: "valid";
}

export class AuthInvitationRejectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthInvitationRejectedError";
  }
}

export async function resetAuthInvitationStoreForTests(): Promise<void> {
  await resetMemberInvitationsForTests();
}

/** Registers an invitation token for a normalized email. */
export async function registerAuthInvitation(
  input: RegisterAuthInvitationInput
): Promise<AuthInvitationRecord> {
  return registerMemberInvitation({
    email: input.email,
    ...(input.expiresAt === undefined ? {} : { expiresAt: input.expiresAt }),
    ...(input.invitationId === undefined
      ? {}
      : { invitationId: input.invitationId }),
    ...(input.platformUserId === undefined
      ? {}
      : { platformUserId: input.platformUserId }),
    ...(input.tenantId === undefined ? {} : { tenantId: input.tenantId }),
    ...(input.token === undefined ? {} : { token: input.token }),
  });
}

export async function validateAuthInvitation(
  input: ValidateAuthInvitationInput
): Promise<ValidateAuthInvitationResult> {
  try {
    return await validateMemberInvitation(input);
  } catch (error: unknown) {
    if (
      error instanceof MemberInvitationRejectedError ||
      (error instanceof Error && error.name === "MemberInvitationRejectedError")
    ) {
      throw new AuthInvitationRejectedError(error.message);
    }

    throw error;
  }
}

export async function consumeAuthInvitation(
  token: string
): Promise<AuthInvitationRecord | null> {
  return consumeMemberInvitation(token);
}

/** Lists unconsumed, unexpired invitations for a tenant. */
export async function listPendingAuthInvitationsForTenant(
  tenantId: string
): Promise<AuthInvitationRecord[]> {
  return listPendingMemberInvitationsForTenant(tenantId);
}

/** Revokes a pending invitation by token. Returns false when not found or already consumed. */
export async function revokeAuthInvitation(token: string): Promise<boolean> {
  return revokeMemberInvitation(token);
}

/** Revokes a pending invitation by invitation id. Returns false when not found or already consumed. */
export async function revokeAuthInvitationById(
  invitationId: string
): Promise<boolean> {
  return revokeMemberInvitationById(invitationId);
}

/** Re-registers a pending invitation with a fresh token (same invitation id). */
export async function resendAuthInvitationById(
  invitationId: string
): Promise<AuthInvitationRecord | null> {
  return resendMemberInvitationById(invitationId);
}

export function readInvitationTokenFromBody(body: unknown): string | undefined {
  if (
    typeof body !== "object" ||
    body === null ||
    !("invitationToken" in body)
  ) {
    return;
  }

  const token = body.invitationToken;
  return typeof token === "string" && token.trim().length > 0
    ? token.trim()
    : undefined;
}

export function isAuthInvitationGateEnabled(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  return env["AFENDA_AUTH_INVITATION_GATE"] !== "disabled";
}
