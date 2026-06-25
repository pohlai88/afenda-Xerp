import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Better Auth identity tables (Drizzle only) — sealed adapter zone.
 *
 * Boundary: `../auth/auth-account.boundary.ts`
 * Platform bridge: `../auth/auth-identity.service.ts`
 *
 * Never use `authUser.id` as platform `actorUserId` or `users.id`.
 * Resolve platform identity via `auth_identity_links`.
 */
export const authUser = pgTable("auth_user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export const authSession = pgTable(
  "auth_session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    activeWorkspaceId: text("active_workspace_id"),
    userId: text("user_id")
      .notNull()
      .references(() => authUser.id, { onDelete: "cascade" }),
  },
  (table) => [index("auth_session_user_id_idx").on(table.userId)]
);

export const authAccount = pgTable(
  "auth_account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => authUser.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", {
      withTimezone: true,
      mode: "date",
    }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
      withTimezone: true,
      mode: "date",
    }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("auth_account_user_id_idx").on(table.userId),
    uniqueIndex("auth_account_provider_account_unique").on(
      table.providerId,
      table.accountId
    ),
  ]
);

export const authVerification = pgTable(
  "auth_verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("auth_verification_identifier_idx").on(table.identifier),
    index("auth_verification_expires_at_idx").on(table.expiresAt),
  ]
);

/** Better Auth `@better-auth/sso` plugin — registered SSO providers (ARCH-AUTH-001 Slice 13a). */
export const authSsoProvider = pgTable(
  "sso_provider",
  {
    id: text("id").primaryKey(),
    issuer: text("issuer").notNull(),
    domain: text("domain").notNull(),
    oidcConfig: text("oidc_config"),
    samlConfig: text("saml_config"),
    userId: text("user_id").references(() => authUser.id, {
      onDelete: "cascade",
    }),
    providerId: text("provider_id").notNull().unique(),
    organizationId: text("organization_id"),
    domainVerified: boolean("domain_verified"),
  },
  (table) => [
    index("sso_provider_user_id_idx").on(table.userId),
    index("sso_provider_domain_idx").on(table.domain),
    uniqueIndex("sso_provider_provider_id_uidx").on(table.providerId),
  ]
);

/** Better Auth `@better-auth/passkey` plugin — WebAuthn credentials (ARCH-AUTH-001 Slice 13b). */
export const authPasskey = pgTable(
  "passkey",
  {
    id: text("id").primaryKey(),
    name: text("name"),
    publicKey: text("public_key").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => authUser.id, { onDelete: "cascade" }),
    credentialID: text("credential_id").notNull(),
    counter: integer("counter").notNull(),
    deviceType: text("device_type").notNull(),
    backedUp: boolean("backed_up").notNull(),
    transports: text("transports"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    }),
    aaguid: text("aaguid"),
  },
  (table) => [
    index("passkey_user_id_idx").on(table.userId),
    index("passkey_credential_id_idx").on(table.credentialID),
  ]
);

/** Better Auth `twoFactor()` plugin — TOTP secrets and backup codes (ARCH-AUTH-001 Gap 3). */
export const authTwoFactor = pgTable(
  "auth_two_factor",
  {
    id: text("id").primaryKey(),
    secret: text("secret").notNull(),
    backupCodes: text("backup_codes").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => authUser.id, { onDelete: "cascade" }),
    verified: boolean("verified").notNull().default(false),
  },
  (table) => [
    index("auth_two_factor_user_id_idx").on(table.userId),
    index("auth_two_factor_secret_idx").on(table.secret),
  ]
);

/**
 * Better Auth Drizzle schema registry for adapter wiring.
 * Keys match Better Auth model names; SQL tables use the `auth_*` prefix.
 */
export const authSchema = {
  user: authUser,
  session: authSession,
  account: authAccount,
  verification: authVerification,
  passkey: authPasskey,
  twoFactor: authTwoFactor,
  ssoProvider: authSsoProvider,
} as const;

export type AuthSchema = typeof authSchema;
