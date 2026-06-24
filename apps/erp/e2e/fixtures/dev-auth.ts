import {
  DEV_VIEWER_LOGIN_EMAIL,
  hasDevViewerLoginCredentials,
  resolveDevLoginEmail,
  resolveDevLoginPassword,
  resolveDevViewerLoginPassword,
} from "@afenda/auth";
import type { Page } from "@playwright/test";

const MIN_DEV_LOGIN_PASSWORD_LENGTH = 8;

export interface E2EDevLoginCredentials {
  readonly email: string;
  readonly password: string;
}

export function hasE2EDevLoginCredentials(): boolean {
  const password = process.env.AFENDA_DEV_LOGIN_PASSWORD?.trim();
  return Boolean(password && password.length >= MIN_DEV_LOGIN_PASSWORD_LENGTH);
}

export function resolveE2EDevLoginCredentials(): E2EDevLoginCredentials {
  return {
    email: resolveDevLoginEmail(),
    password: resolveDevLoginPassword(),
  };
}

export function hasE2EViewerLoginCredentials(): boolean {
  return hasDevViewerLoginCredentials();
}

export function resolveE2EViewerLoginCredentials(): E2EDevLoginCredentials {
  return {
    email: DEV_VIEWER_LOGIN_EMAIL,
    password: resolveDevViewerLoginPassword(),
  };
}

export async function signInWithEmailPassword(
  page: Page,
  credentials: E2EDevLoginCredentials
): Promise<void> {
  const signInResponse = await page.request.post("/api/auth/sign-in/email", {
    data: {
      email: credentials.email,
      password: credentials.password,
    },
  });

  if (!signInResponse.ok()) {
    throw new Error(
      `Sign-in failed for ${credentials.email}: HTTP ${signInResponse.status()}`
    );
  }
}

export const E2E_DEV_FIXTURE_ANNOTATION = {
  type: "fixture",
  description:
    "Requires pnpm db:bootstrap:local && pnpm auth:bootstrap:dev (viewer defaults to AFENDA_DEV_LOGIN_PASSWORD-viewer)",
} as const;
