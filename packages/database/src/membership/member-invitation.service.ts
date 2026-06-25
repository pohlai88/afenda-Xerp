import { createHash, randomUUID, timingSafeEqual } from "node:crypto";

import { and, eq, gt, isNull } from "drizzle-orm";

import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { memberInvitations } from "../schema/member-invitation.schema.js";

const DEFAULT_INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface MemberInvitationRecord {
  readonly consumedAt?: number;
  readonly email: string;
  readonly expiresAt: number;
  readonly invitationId: string;
  readonly platformUserId?: string;
  readonly tenantId?: string;
  readonly token: string;
}

export interface RegisterMemberInvitationInput {
  readonly email: string;
  readonly expiresAt?: Date;
  readonly invitationId?: string;
  readonly platformUserId?: string;
  readonly tenantId?: string;
  readonly token?: string;
}

export interface ValidateMemberInvitationInput {
  readonly email: string;
  readonly token: string;
}

export interface ValidateMemberInvitationResult {
  readonly invitation: MemberInvitationRecord;
  readonly status: "valid";
}

export class MemberInvitationRejectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MemberInvitationRejectedError";
  }
}

function hashInvitationToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function verifyInvitationTokenHash(token: string, storedHash: string): boolean {
  const computed = hashInvitationToken(token);
  const computedBuffer = Buffer.from(computed, "utf8");
  const storedBuffer = Buffer.from(storedHash, "utf8");

  if (computedBuffer.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(computedBuffer, storedBuffer);
}

function rowToMemberInvitationRecord(
  row: {
    readonly consumedAt: Date | null;
    readonly email: string;
    readonly expiresAt: Date;
    readonly id: string;
    readonly platformUserId: string | null;
    readonly tenantId: string | null;
  },
  token: string
): MemberInvitationRecord {
  return {
    email: row.email,
    expiresAt: row.expiresAt.getTime(),
    invitationId: row.id,
    token,
    ...(row.consumedAt === null
      ? {}
      : { consumedAt: row.consumedAt.getTime() }),
    ...(row.platformUserId === null
      ? {}
      : { platformUserId: row.platformUserId }),
    ...(row.tenantId === null ? {} : { tenantId: row.tenantId }),
  };
}

function rowToListedMemberInvitationRecord(row: {
  readonly consumedAt: Date | null;
  readonly email: string;
  readonly expiresAt: Date;
  readonly id: string;
  readonly platformUserId: string | null;
  readonly tenantId: string | null;
}): MemberInvitationRecord {
  return rowToMemberInvitationRecord(row, "");
}

export async function resetMemberInvitationsForTests(
  db: AfendaDatabase = getDb()
): Promise<void> {
  await db.delete(memberInvitations);
}

export async function registerMemberInvitation(
  input: RegisterMemberInvitationInput,
  db: AfendaDatabase = getDb()
): Promise<MemberInvitationRecord> {
  const email = input.email.trim().toLowerCase();
  const token = input.token?.trim() || randomUUID();
  const expiresAt =
    input.expiresAt ?? new Date(Date.now() + DEFAULT_INVITATION_TTL_MS);
  const invitationId = input.invitationId ?? randomUUID();

  const [inserted] = await db
    .insert(memberInvitations)
    .values({
      id: invitationId,
      email,
      tokenHash: hashInvitationToken(token),
      expiresAt,
      ...(input.platformUserId === undefined
        ? {}
        : { platformUserId: input.platformUserId }),
      ...(input.tenantId === undefined ? {} : { tenantId: input.tenantId }),
    })
    .returning({
      consumedAt: memberInvitations.consumedAt,
      email: memberInvitations.email,
      expiresAt: memberInvitations.expiresAt,
      id: memberInvitations.id,
      platformUserId: memberInvitations.platformUserId,
      tenantId: memberInvitations.tenantId,
    });

  if (!inserted) {
    throw new Error("Member invitation insert did not return a row.");
  }

  return rowToMemberInvitationRecord(inserted, token);
}

export async function validateMemberInvitation(
  input: ValidateMemberInvitationInput,
  db: AfendaDatabase = getDb()
): Promise<ValidateMemberInvitationResult> {
  const email = input.email.trim().toLowerCase();
  const token = input.token.trim();
  const tokenHash = hashInvitationToken(token);

  const [row] = await db
    .select({
      consumedAt: memberInvitations.consumedAt,
      email: memberInvitations.email,
      expiresAt: memberInvitations.expiresAt,
      id: memberInvitations.id,
      platformUserId: memberInvitations.platformUserId,
      tenantId: memberInvitations.tenantId,
      tokenHash: memberInvitations.tokenHash,
    })
    .from(memberInvitations)
    .where(eq(memberInvitations.tokenHash, tokenHash))
    .limit(1);

  if (!(row && verifyInvitationTokenHash(token, row.tokenHash))) {
    throw new MemberInvitationRejectedError("Invitation token is invalid.");
  }

  if (row.consumedAt !== null) {
    throw new MemberInvitationRejectedError(
      "Invitation token has already been used."
    );
  }

  if (row.expiresAt.getTime() < Date.now()) {
    throw new MemberInvitationRejectedError("Invitation token has expired.");
  }

  if (row.email !== email) {
    throw new MemberInvitationRejectedError(
      "Invitation token does not match the sign-up email."
    );
  }

  return {
    status: "valid",
    invitation: rowToMemberInvitationRecord(row, token),
  };
}

export async function consumeMemberInvitation(
  token: string,
  db: AfendaDatabase = getDb()
): Promise<MemberInvitationRecord | null> {
  const trimmed = token.trim();
  const tokenHash = hashInvitationToken(trimmed);

  const [row] = await db
    .select({
      consumedAt: memberInvitations.consumedAt,
      email: memberInvitations.email,
      expiresAt: memberInvitations.expiresAt,
      id: memberInvitations.id,
      platformUserId: memberInvitations.platformUserId,
      tenantId: memberInvitations.tenantId,
      tokenHash: memberInvitations.tokenHash,
    })
    .from(memberInvitations)
    .where(eq(memberInvitations.tokenHash, tokenHash))
    .limit(1);

  if (
    !row ||
    row.consumedAt !== null ||
    !verifyInvitationTokenHash(trimmed, row.tokenHash)
  ) {
    return null;
  }

  const consumedAt = new Date();

  const [updated] = await db
    .update(memberInvitations)
    .set({ consumedAt })
    .where(
      and(
        eq(memberInvitations.tokenHash, tokenHash),
        isNull(memberInvitations.consumedAt)
      )
    )
    .returning({
      consumedAt: memberInvitations.consumedAt,
      email: memberInvitations.email,
      expiresAt: memberInvitations.expiresAt,
      id: memberInvitations.id,
      platformUserId: memberInvitations.platformUserId,
      tenantId: memberInvitations.tenantId,
    });

  if (!updated || updated.consumedAt === null) {
    return null;
  }

  return rowToMemberInvitationRecord(updated, trimmed);
}

export async function findPendingMemberInvitationForEmail(
  input: { readonly email: string; readonly tenantId?: string },
  db: AfendaDatabase = getDb()
): Promise<MemberInvitationRecord | null> {
  const email = input.email.trim().toLowerCase();
  const now = new Date();

  const conditions = [
    eq(memberInvitations.email, email),
    isNull(memberInvitations.consumedAt),
    gt(memberInvitations.expiresAt, now),
  ];

  if (input.tenantId !== undefined) {
    conditions.push(eq(memberInvitations.tenantId, input.tenantId));
  }

  const [row] = await db
    .select({
      consumedAt: memberInvitations.consumedAt,
      email: memberInvitations.email,
      expiresAt: memberInvitations.expiresAt,
      id: memberInvitations.id,
      platformUserId: memberInvitations.platformUserId,
      tenantId: memberInvitations.tenantId,
    })
    .from(memberInvitations)
    .where(and(...conditions))
    .limit(1);

  return row ? rowToListedMemberInvitationRecord(row) : null;
}

export async function listPendingMemberInvitationsForTenant(
  tenantId: string,
  db: AfendaDatabase = getDb()
): Promise<MemberInvitationRecord[]> {
  const now = new Date();

  const rows = await db
    .select({
      consumedAt: memberInvitations.consumedAt,
      email: memberInvitations.email,
      expiresAt: memberInvitations.expiresAt,
      id: memberInvitations.id,
      platformUserId: memberInvitations.platformUserId,
      tenantId: memberInvitations.tenantId,
    })
    .from(memberInvitations)
    .where(
      and(
        eq(memberInvitations.tenantId, tenantId),
        isNull(memberInvitations.consumedAt),
        gt(memberInvitations.expiresAt, now)
      )
    );

  return rows.map((row) => rowToListedMemberInvitationRecord(row));
}

export async function revokeMemberInvitation(
  token: string,
  db: AfendaDatabase = getDb()
): Promise<boolean> {
  const tokenHash = hashInvitationToken(token.trim());

  const deleted = await db
    .delete(memberInvitations)
    .where(
      and(
        eq(memberInvitations.tokenHash, tokenHash),
        isNull(memberInvitations.consumedAt)
      )
    )
    .returning({ id: memberInvitations.id });

  return deleted.length > 0;
}

export async function revokeMemberInvitationById(
  invitationId: string,
  db: AfendaDatabase = getDb()
): Promise<boolean> {
  const deleted = await db
    .delete(memberInvitations)
    .where(
      and(
        eq(memberInvitations.id, invitationId),
        isNull(memberInvitations.consumedAt)
      )
    )
    .returning({ id: memberInvitations.id });

  return deleted.length > 0;
}

export async function resendMemberInvitationById(
  invitationId: string,
  db: AfendaDatabase = getDb()
): Promise<MemberInvitationRecord | null> {
  const [existing] = await db
    .select({
      consumedAt: memberInvitations.consumedAt,
      email: memberInvitations.email,
      expiresAt: memberInvitations.expiresAt,
      id: memberInvitations.id,
      platformUserId: memberInvitations.platformUserId,
      tenantId: memberInvitations.tenantId,
    })
    .from(memberInvitations)
    .where(
      and(
        eq(memberInvitations.id, invitationId),
        isNull(memberInvitations.consumedAt)
      )
    )
    .limit(1);

  if (!existing) {
    return null;
  }

  await db
    .delete(memberInvitations)
    .where(eq(memberInvitations.id, invitationId));

  return registerMemberInvitation(
    {
      email: existing.email,
      invitationId: existing.id,
      ...(existing.platformUserId === null
        ? {}
        : { platformUserId: existing.platformUserId }),
      ...(existing.tenantId === null ? {} : { tenantId: existing.tenantId }),
    },
    db
  );
}
