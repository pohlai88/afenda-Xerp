import { createHash, randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AfendaDatabase } from "../db.js";
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
} from "../membership/member-invitation.service.js";

interface StoredInvitation {
  consumedAt: Date | null;
  email: string;
  expiresAt: Date;
  id: string;
  platformUserId: string | null;
  tenantId: string | null;
  tokenHash: string;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function createInvitationTestDb(initialRows: StoredInvitation[] = []) {
  const rows = new Map(initialRows.map((row) => [row.id, { ...row }]));

  const db = {
    delete: vi.fn(() => ({
      where: vi.fn(() => ({
        returning: vi.fn(async () => {
          for (const [id, row] of rows.entries()) {
            if (row.consumedAt === null) {
              rows.delete(id);
              return [{ id }];
            }
          }
          return [];
        }),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(
        (value: {
          id?: string;
          email: string;
          tokenHash: string;
          expiresAt: Date;
          platformUserId?: string;
          tenantId?: string;
        }) => ({
          returning: vi.fn(async () => {
            const id = value.id ?? randomUUID();
            const stored: StoredInvitation = {
              consumedAt: null,
              email: value.email,
              expiresAt: value.expiresAt,
              id,
              platformUserId: value.platformUserId ?? null,
              tenantId: value.tenantId ?? null,
              tokenHash: value.tokenHash,
            };
            rows.set(id, stored);
            return [
              {
                consumedAt: stored.consumedAt,
                email: stored.email,
                expiresAt: stored.expiresAt,
                id: stored.id,
                platformUserId: stored.platformUserId,
                tenantId: stored.tenantId,
              },
            ];
          }),
        })
      ),
    })),
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(async () => {
            const match = [...rows.values()].find(
              (row) => row.tokenHash === hashToken("invite_token_1")
            );
            return match ? [match] : [];
          }),
        })),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn((patch: { consumedAt: Date }) => ({
        where: vi.fn(() => ({
          returning: vi.fn(async () => {
            const row = [...rows.values()].find(
              (candidate) => candidate.consumedAt === null
            );
            if (!row) {
              return [];
            }
            const updated = { ...row, consumedAt: patch.consumedAt };
            rows.set(updated.id, updated);
            return [
              {
                consumedAt: updated.consumedAt,
                email: updated.email,
                expiresAt: updated.expiresAt,
                id: updated.id,
                platformUserId: updated.platformUserId,
                tenantId: updated.tenantId,
              },
            ];
          }),
        })),
      })),
    })),
  } as unknown as AfendaDatabase;

  return { db, rows };
}

describe("member-invitation.service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("registers and validates a matching invitation token", async () => {
    const { db } = createInvitationTestDb();

    const invitation = await registerMemberInvitation(
      {
        email: "User@Example.com",
        token: "invite_token_1",
      },
      db
    );

    expect(invitation.email).toBe("user@example.com");
    expect(invitation.token).toBe("invite_token_1");
    expect(
      await validateMemberInvitation(
        {
          email: "user@example.com",
          token: "invite_token_1",
        },
        db
      )
    ).toEqual({
      status: "valid",
      invitation,
    });
  });

  it("rejects expired and consumed tokens", async () => {
    const expiredRow: StoredInvitation = {
      consumedAt: null,
      email: "user@example.com",
      expiresAt: new Date(Date.now() - 1000),
      id: randomUUID(),
      platformUserId: null,
      tenantId: null,
      tokenHash: hashToken("expired_token"),
    };
    const consumedRow: StoredInvitation = {
      consumedAt: new Date(),
      email: "user@example.com",
      expiresAt: new Date(Date.now() + 60_000),
      id: randomUUID(),
      platformUserId: null,
      tenantId: null,
      tokenHash: hashToken("consumed_token"),
    };

    const { db: expiredDb } = createInvitationTestDb([expiredRow]);
    expiredDb.select = vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(async () => [expiredRow]),
        })),
      })),
    })) as unknown as AfendaDatabase["select"];

    await expect(
      validateMemberInvitation(
        {
          email: "user@example.com",
          token: "expired_token",
        },
        expiredDb
      )
    ).rejects.toThrow(/expired/i);

    const { db: consumedDb } = createInvitationTestDb([consumedRow]);
    consumedDb.select = vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(async () => [consumedRow]),
        })),
      })),
    })) as unknown as AfendaDatabase["select"];

    await expect(
      validateMemberInvitation(
        {
          email: "user@example.com",
          token: "consumed_token",
        },
        consumedDb
      )
    ).rejects.toThrow(/already been used/i);
  });

  it("lists pending invitations by tenant and revokes by token", async () => {
    const pendingRows: StoredInvitation[] = [
      {
        consumedAt: null,
        email: "a@example.com",
        expiresAt: new Date(Date.now() + 60_000),
        id: randomUUID(),
        platformUserId: null,
        tenantId: "tenant-a",
        tokenHash: hashToken("token-a"),
      },
      {
        consumedAt: null,
        email: "b@example.com",
        expiresAt: new Date(Date.now() + 60_000),
        id: randomUUID(),
        platformUserId: null,
        tenantId: "tenant-b",
        tokenHash: hashToken("token-b"),
      },
    ];

    const { db } = createInvitationTestDb(pendingRows);
    db.select = vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(async () =>
          pendingRows.filter(
            (row) =>
              row.tenantId === "tenant-a" &&
              row.consumedAt === null &&
              row.expiresAt.getTime() > Date.now()
          )
        ),
      })),
    })) as unknown as AfendaDatabase["select"];

    expect(
      await listPendingMemberInvitationsForTenant("tenant-a", db)
    ).toHaveLength(1);
    expect(await revokeMemberInvitation("token-a", db)).toBe(true);
  });

  it("revokes by invitation id and resends with a fresh token", async () => {
    const existing: StoredInvitation = {
      consumedAt: null,
      email: "user@example.com",
      expiresAt: new Date(Date.now() + 60_000),
      id: "invite_1",
      platformUserId: null,
      tenantId: "tenant-a",
      tokenHash: hashToken("original_token"),
    };

    const { db } = createInvitationTestDb([existing]);
    db.select = vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(async () => [existing]),
        })),
      })),
    })) as unknown as AfendaDatabase["select"];

    expect(await revokeMemberInvitationById("invite_1", db)).toBe(true);

    const resent = await resendMemberInvitationById("invite_1", db);
    expect(resent).not.toBeNull();
    expect(resent?.invitationId).toBe("invite_1");
    expect(resent?.token).not.toBe("original_token");
  });

  it("clears invitations for tests", async () => {
    const { db } = createInvitationTestDb([
      {
        consumedAt: null,
        email: "user@example.com",
        expiresAt: new Date(Date.now() + 60_000),
        id: randomUUID(),
        platformUserId: null,
        tenantId: null,
        tokenHash: hashToken("token"),
      },
    ]);

    db.delete = vi.fn(() => ({
      where: vi.fn(async () => undefined),
    })) as unknown as AfendaDatabase["delete"];

    await resetMemberInvitationsForTests(db);
    expect(db.delete).toHaveBeenCalled();
  });

  it("maps invalid tokens to MemberInvitationRejectedError", async () => {
    const { db } = createInvitationTestDb();
    db.select = vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(async () => []),
        })),
      })),
    })) as unknown as AfendaDatabase["select"];

    await expect(
      validateMemberInvitation(
        {
          email: "user@example.com",
          token: "missing_token",
        },
        db
      )
    ).rejects.toThrow(MemberInvitationRejectedError);

    await expect(
      consumeMemberInvitation("missing_token", db)
    ).resolves.toBeNull();
  });
});
