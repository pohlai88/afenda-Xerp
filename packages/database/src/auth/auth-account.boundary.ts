/**
 * Better Auth account boundary — public vs adapter-sensitive fields.
 *
 * Tables: `schema/auth.schema.ts`
 * Identity bridge: `auth-identity.service.ts`
 */
import type { authAccount } from "../schema/auth.schema.js";

/** Adapter-owned credential fields. Never select, log, audit-copy, or serialize. */
export const AUTH_ADAPTER_SENSITIVE_ACCOUNT_FIELDS = [
  "accessToken",
  "refreshToken",
  "idToken",
  "password",
] as const;

export type AuthAdapterSensitiveAccountField =
  (typeof AUTH_ADAPTER_SENSITIVE_ACCOUNT_FIELDS)[number];

export type AuthAccountRow = typeof authAccount.$inferSelect;

/** Safe auth account projection for app repositories and API responses. */
export type PublicAuthAccount = Omit<
  AuthAccountRow,
  AuthAdapterSensitiveAccountField
>;

export function toPublicAuthAccount(row: AuthAccountRow): PublicAuthAccount {
  const {
    accessToken: _accessToken,
    refreshToken: _refreshToken,
    idToken: _idToken,
    password: _password,
    ...publicAccount
  } = row;

  return publicAccount;
}

/**
 * Column names for Drizzle `columns` omit when querying auth accounts in app code.
 * Prefer `toPublicAuthAccount()` when a full row was loaded by the adapter only.
 */
export const AUTH_ACCOUNT_PUBLIC_COLUMNS = {
  id: true,
  accountId: true,
  providerId: true,
  userId: true,
  accessTokenExpiresAt: true,
  refreshTokenExpiresAt: true,
  scope: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Partial<Record<keyof AuthAccountRow, true>>;
