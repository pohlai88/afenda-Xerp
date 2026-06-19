import { authSchema, getAuthDb } from "@afenda/database";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { getBetterAuthSecret, getBetterAuthUrl } from "./auth.env.js";
import { createAfendaAuthAuditHooks } from "./auth.hooks.js";

const SESSION_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 7;
const SESSION_UPDATE_AGE_SECONDS = 60 * 60 * 24;

export interface CreateAuthOptions {
  env?: NodeJS.ProcessEnv;
}

export function createAuthConfig(options: CreateAuthOptions = {}) {
  const env = options.env ?? process.env;
  const db = getAuthDb();
  const baseURL = getBetterAuthUrl(env);
  const secret = getBetterAuthSecret(env);

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
    },
    session: {
      expiresIn: SESSION_EXPIRES_IN_SECONDS,
      updateAge: SESSION_UPDATE_AGE_SECONDS,
    },
    plugins: [nextCookies()],
    hooks: {
      after: createAfendaAuthAuditHooks(),
    },
    trustedOrigins: [baseURL],
  });
}

export type AfendaAuth = ReturnType<typeof createAuthConfig>;
