import { authSchema, getAuthDb } from "@afenda/database";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { haveIBeenPwned, multiSession, twoFactor } from "better-auth/plugins";

import {
  createAuthPasswordResetEmailSender,
  createAuthVerificationEmailSender,
} from "./auth.email.js";
import {
  getBetterAuthSecret,
  resolveBetterAuthBaseUrl,
  resolveBetterAuthTrustedOrigins,
} from "./auth.env.js";
import {
  createAfendaAuthAuditHooks,
  createAfendaAuthInvitationBeforeHook,
} from "./auth.hooks.js";

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

  return betterAuth({
    appName: "Afenda ERP",
    baseURL,
    basePath: "/api/auth",
    secret,
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: authSchema,
    }),
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
    ],
    hooks: {
      before: createAfendaAuthInvitationBeforeHook(env),
      after: createAfendaAuthAuditHooks(),
    },
    trustedOrigins: [...trustedOrigins],
  });
}

export type AfendaAuth = ReturnType<typeof createAuthConfig>;
