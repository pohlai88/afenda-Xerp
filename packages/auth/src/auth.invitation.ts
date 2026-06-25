import { randomUUID } from "node:crypto";

/**
 * ARCH-AUTH-001 Slice 4 — invitation gate (in-memory stub).
 *
 * Debt: durable `member_invitations` table deferred to Slice 6 (Members tab).
 * This store is process-local and non-durable until platform persistence lands.
 */
export const AFENDA_AUTH_INVITATION_STORE_DEBT =
  "member_invitations table deferred to Slice 6; in-memory invitation store is non-durable." as const;

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

const invitationStore = new Map<string, AuthInvitationRecord>();

const DEFAULT_INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function resetAuthInvitationStoreForTests(): void {
  invitationStore.clear();
}

/** Test/admin helper — registers an invitation token for a normalized email. */
export function registerAuthInvitation(
  input: RegisterAuthInvitationInput
): AuthInvitationRecord {
  const email = input.email.trim().toLowerCase();
  const token = input.token?.trim() || randomUUID();
  const record: AuthInvitationRecord = {
    email,
    expiresAt:
      input.expiresAt?.getTime() ?? Date.now() + DEFAULT_INVITATION_TTL_MS,
    invitationId: input.invitationId ?? randomUUID(),
    token,
    ...(input.platformUserId === undefined
      ? {}
      : { platformUserId: input.platformUserId }),
    ...(input.tenantId === undefined ? {} : { tenantId: input.tenantId }),
  };

  invitationStore.set(token, record);
  return record;
}

export function validateAuthInvitation(
  input: ValidateAuthInvitationInput
): ValidateAuthInvitationResult {
  const email = input.email.trim().toLowerCase();
  const token = input.token.trim();
  const record = invitationStore.get(token);

  if (!record) {
    throw new AuthInvitationRejectedError("Invitation token is invalid.");
  }

  if (record.consumedAt !== undefined) {
    throw new AuthInvitationRejectedError(
      "Invitation token has already been used."
    );
  }

  if (record.expiresAt < Date.now()) {
    throw new AuthInvitationRejectedError("Invitation token has expired.");
  }

  if (record.email !== email) {
    throw new AuthInvitationRejectedError(
      "Invitation token does not match the sign-up email."
    );
  }

  return { status: "valid", invitation: record };
}

export function consumeAuthInvitation(
  token: string
): AuthInvitationRecord | null {
  const record = invitationStore.get(token.trim());

  if (!record || record.consumedAt !== undefined) {
    return null;
  }

  const consumed: AuthInvitationRecord = {
    ...record,
    consumedAt: Date.now(),
  };

  invitationStore.set(token.trim(), consumed);
  return consumed;
}

/** Lists unconsumed, unexpired invitations for a tenant (in-memory store). */
export function listPendingAuthInvitationsForTenant(
  tenantId: string
): AuthInvitationRecord[] {
  const now = Date.now();

  return [...invitationStore.values()].filter(
    (record) =>
      record.tenantId === tenantId &&
      record.consumedAt === undefined &&
      record.expiresAt >= now
  );
}

/** Revokes a pending invitation by token. Returns false when not found or already consumed. */
export function revokeAuthInvitation(token: string): boolean {
  const trimmed = token.trim();
  const record = invitationStore.get(trimmed);

  if (!record || record.consumedAt !== undefined) {
    return false;
  }

  invitationStore.delete(trimmed);
  return true;
}

/** Revokes a pending invitation by invitation id. Returns false when not found or already consumed. */
export function revokeAuthInvitationById(invitationId: string): boolean {
  for (const [token, record] of invitationStore.entries()) {
    if (
      record.invitationId === invitationId &&
      record.consumedAt === undefined
    ) {
      invitationStore.delete(token);
      return true;
    }
  }

  return false;
}

/** Re-registers a pending invitation with a fresh token (same invitation id). */
export function resendAuthInvitationById(
  invitationId: string
): AuthInvitationRecord | null {
  for (const [token, record] of invitationStore.entries()) {
    if (
      record.invitationId === invitationId &&
      record.consumedAt === undefined
    ) {
      invitationStore.delete(token);

      return registerAuthInvitation({
        email: record.email,
        invitationId: record.invitationId,
        ...(record.platformUserId === undefined
          ? {}
          : { platformUserId: record.platformUserId }),
        ...(record.tenantId === undefined ? {} : { tenantId: record.tenantId }),
      });
    }
  }

  return null;
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
