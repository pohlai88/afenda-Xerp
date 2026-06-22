import {
  authAccount,
  authIdentityLinks,
  authUser,
  findPlatformUserIdByAuthUserId,
  insertAuthIdentityLink,
  type AfendaDatabase,
  users,
} from "@afenda/database";
import { hashPassword } from "better-auth/crypto";
import { and, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import {
  DEV_AUTH_CREDENTIAL_PROVIDER_ID,
  DEV_LOGIN_DISPLAY_NAME,
} from "./dev-login.fixture.js";

export interface EnsureDevAuthLoginInput {
  readonly email: string;
  readonly password: string;
  readonly displayName?: string;
}

export interface EnsureDevAuthLoginResult {
  readonly authUserId: string;
  readonly platformUserId: string;
  readonly createdAuthUser: boolean;
  readonly createdAuthAccount: boolean;
  readonly createdIdentityLink: boolean;
  readonly passwordUpdated: boolean;
}

export class MissingPlatformUserError extends Error {
  constructor(email: string) {
    super(
      `Platform user "${email}" was not found. Run pnpm db:bootstrap:local before auth:bootstrap:dev.`
    );
    this.name = "MissingPlatformUserError";
  }
}

async function findPlatformUserIdByEmail(
  email: string,
  db: AfendaDatabase
): Promise<string | null> {
  const [row] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return row?.id ?? null;
}

async function findAuthUserIdByEmail(
  email: string,
  db: AfendaDatabase
): Promise<string | null> {
  const [row] = await db
    .select({ id: authUser.id })
    .from(authUser)
    .where(eq(authUser.email, email))
    .limit(1);

  return row?.id ?? null;
}

async function findCredentialAccount(
  authUserId: string,
  db: AfendaDatabase
): Promise<{ readonly id: string } | null> {
  const [row] = await db
    .select({ id: authAccount.id })
    .from(authAccount)
    .where(
      and(
        eq(authAccount.userId, authUserId),
        eq(authAccount.providerId, DEV_AUTH_CREDENTIAL_PROVIDER_ID)
      )
    )
    .limit(1);

  return row ?? null;
}

async function hasIdentityLink(
  authUserId: string,
  platformUserId: string,
  db: AfendaDatabase
): Promise<boolean> {
  const [row] = await db
    .select({ id: authIdentityLinks.id })
    .from(authIdentityLinks)
    .where(
      and(
        eq(authIdentityLinks.authUserId, authUserId),
        eq(authIdentityLinks.userId, platformUserId),
        eq(authIdentityLinks.providerId, DEV_AUTH_CREDENTIAL_PROVIDER_ID)
      )
    )
    .limit(1);

  return row !== undefined;
}

/**
 * Idempotently provisions Better Auth credentials and links them to the seeded
 * platform user so local sign-in works after `pnpm db:bootstrap:local`.
 */
export async function ensureDevAuthLogin(
  input: EnsureDevAuthLoginInput,
  db: AfendaDatabase
): Promise<EnsureDevAuthLoginResult> {
  const email = input.email.trim().toLowerCase();
  const displayName = input.displayName?.trim() || DEV_LOGIN_DISPLAY_NAME;
  const platformUserId = await findPlatformUserIdByEmail(email, db);

  if (platformUserId === null) {
    throw new MissingPlatformUserError(email);
  }

  const hashedPassword = await hashPassword(input.password);
  let authUserId = await findAuthUserIdByEmail(email, db);
  let createdAuthUser = false;

  if (authUserId === null) {
    authUserId = randomUUID();
    await db.insert(authUser).values({
      email,
      emailVerified: true,
      id: authUserId,
      name: displayName,
    });
    createdAuthUser = true;
  } else {
    await db
      .update(authUser)
      .set({
        emailVerified: true,
        name: displayName,
        updatedAt: new Date(),
      })
      .where(eq(authUser.id, authUserId));
  }

  const existingAccount = await findCredentialAccount(authUserId, db);
  let createdAuthAccount = false;
  let passwordUpdated = false;

  if (existingAccount === null) {
    await db.insert(authAccount).values({
      accountId: email,
      id: randomUUID(),
      password: hashedPassword,
      providerId: DEV_AUTH_CREDENTIAL_PROVIDER_ID,
      userId: authUserId,
    });
    createdAuthAccount = true;
  } else {
    await db
      .update(authAccount)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(authAccount.id, existingAccount.id));
    passwordUpdated = true;
  }

  const linkedPlatformUserId = await findPlatformUserIdByAuthUserId(
    authUserId,
    db
  );
  let createdIdentityLink = false;

  if (linkedPlatformUserId === null) {
    await insertAuthIdentityLink(
      {
        authUserId,
        providerId: DEV_AUTH_CREDENTIAL_PROVIDER_ID,
        userId: platformUserId,
      },
      db
    );
    createdIdentityLink = true;
  } else if (linkedPlatformUserId !== platformUserId) {
    throw new Error(
      `Auth user "${email}" is already linked to a different platform user.`
    );
  } else if (!(await hasIdentityLink(authUserId, platformUserId, db))) {
    await insertAuthIdentityLink(
      {
        authUserId,
        providerId: DEV_AUTH_CREDENTIAL_PROVIDER_ID,
        userId: platformUserId,
      },
      db
    );
    createdIdentityLink = true;
  }

  return {
    authUserId,
    createdAuthAccount,
    createdAuthUser,
    createdIdentityLink,
    passwordUpdated,
    platformUserId,
  };
}
