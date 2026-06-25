import { authSchema, getAuthDb } from "@afenda/database";
import { passkey } from "@better-auth/passkey";
import { sso } from "@better-auth/sso";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { haveIBeenPwned, multiSession, twoFactor } from "better-auth/plugins";

import {
  createAuthPasswordResetEmailSender,
  createAuthVerificationEmailSender,
} from "./auth.email.js";
import {
  AUTH_CHANGE_EMAIL_ENABLED,
  getBetterAuthSecret,
  resolveBetterAuthBaseUrl,
  resolveBetterAuthSocialProviders,
  resolveBetterAuthTrustedOrigins,
  resolveBetterAuthWebAuthnOrigin,
  resolveBetterAuthWebAuthnRpId,
  resolveBetterAuthWebAuthnRpName,
} from "./auth.env.js";
import {
  createAfendaAuthAuditHooks,
  createAfendaAuthInvitationBeforeHook,
} from "./auth.hooks.js";
import { createAfendaOAuthUserCreateBeforeHook } from "./auth.oauth-policy.js";
import { createAfendaSsoPluginOptions } from "./auth.sso-policy.js";

const AUTH_RATE_LIMIT_WINDOW_SECONDS = 60;
const AUTH_RATE_LIMIT_MAX_GLOBAL = 10;
const AUTH_RATE_LIMIT_MAX_SIGN_IN = 5;

const SESSION_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 7;
const SESSION_UPDATE_AGE_SECONDS = 60 * 60 * 24;

export interface CreateAuthOptions {
  env?: NodeJS.ProcessEnv;
}

export function createAuthConfig(options: CreateAuthOptions = {}) {
  const env = options.env ?? process.env;
  const db = getAuthDb();
  const baseURL = resolveBetterAuthBaseUrl(env);
  const secret = getBetterAuthSecret(env);
  const trustedOrigins = resolveBetterAuthTrustedOrigins(env);
  const socialProviders = resolveBetterAuthSocialProviders(env);

  return betterAuth({
    appName: "Afenda ERP",
    baseURL,
    basePath: "/api/auth",
    secret,
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: authSchema,
    }),
    ...(socialProviders === undefined ? {} : { socialProviders }),
    databaseHooks: {
      user: {
        create: {
          before: createAfendaOAuthUserCreateBeforeHook(env),
        },
      },
    },
    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      requireEmailVerification: true,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: createAuthPasswordResetEmailSender(env),
    },
    emailVerification: {
      sendVerificationEmail: createAuthVerificationEmailSender(env),
    },
    user: {
      changeEmail: {
        enabled: AUTH_CHANGE_EMAIL_ENABLED,
      },
    },
    rateLimit: {
      window: AUTH_RATE_LIMIT_WINDOW_SECONDS,
      max: AUTH_RATE_LIMIT_MAX_GLOBAL,
      customRules: {
        "/sign-in/email": {
          window: AUTH_RATE_LIMIT_WINDOW_SECONDS,
          max: AUTH_RATE_LIMIT_MAX_SIGN_IN,
        },
      },
    },
    session: {
      expiresIn: SESSION_EXPIRES_IN_SECONDS,
      updateAge: SESSION_UPDATE_AGE_SECONDS,
      additionalFields: {
        activeWorkspaceId: { type: "string", required: false },
      },
    },
    plugins: [
      nextCookies(),
      haveIBeenPwned(),
      twoFactor({
        backupCodeOptions: { amount: 10 },
      }),
      multiSession(),
      passkey({
        origin: resolveBetterAuthWebAuthnOrigin(env),
        rpID: resolveBetterAuthWebAuthnRpId(env),
        rpName: resolveBetterAuthWebAuthnRpName(),
        registration: {
          requireSession: true,
        },
      }),
      sso(createAfendaSsoPluginOptions(env)),
    ],
    hooks: {
      before: createAfendaAuthInvitationBeforeHook(env),
      after: createAfendaAuthAuditHooks(),
    },
    trustedOrigins: [...trustedOrigins],
  });
}

export type AfendaAuth = ReturnType<typeof createAuthConfig>;
