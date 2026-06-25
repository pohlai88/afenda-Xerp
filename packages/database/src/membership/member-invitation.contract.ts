import { createHash, timingSafeEqual } from "node:crypto";

const INVITATION_TOKEN_HASH_ALGORITHM = "sha256" as const;

/** One-way hash for invitation tokens at rest (ARCH-AUTH-001 Slice 11). */
export function hashMemberInvitationToken(token: string): string {
  return createHash(INVITATION_TOKEN_HASH_ALGORITHM)
    .update(token.trim())
    .digest("hex");
}

/** Constant-time comparison of a plaintext token against a stored hash. */
export function verifyMemberInvitationToken(
  token: string,
  tokenHash: string
): boolean {
  const candidate = hashMemberInvitationToken(token);
  const left = Buffer.from(candidate, "utf8");
  const right = Buffer.from(tokenHash, "utf8");

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

export interface MemberInvitationRow {
  readonly consumedAt: Date | null;
  readonly email: string;
  readonly expiresAt: Date;
  readonly id: string;
  readonly platformUserId: string | null;
  readonly tenantId: string | null;
}

export interface InsertMemberInvitationInput {
  readonly email: string;
  readonly expiresAt: Date;
  readonly id?: string;
  readonly platformUserId?: string;
  readonly tenantId?: string;
  readonly token: string;
}

export const DEFAULT_MEMBER_INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
