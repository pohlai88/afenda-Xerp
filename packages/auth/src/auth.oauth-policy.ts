import {
  findPendingMemberInvitationForEmail,
  getTenantOAuthProviderConfig,
  type TenantOAuthProviderId,
} from "@afenda/database";

import { persistAuthAuditEvent } from "./auth.audit.js";
import { AUTH_EVENT } from "./auth.contract.js";
import { isAuthInvitationGateEnabled } from "./auth.invitation.js";

/** Better Auth social OAuth callback routes attested in integration tests (Slice 13c). */
export const AFENDA_AUTH_OAUTH_CALLBACK_PREFIX = "/callback/" as const;

export const AFENDA_OAUTH_PROVIDER_IDS = [
  "google",
  "microsoft",
] as const satisfies readonly TenantOAuthProviderId[];

export class AuthOAuthInvitationRejectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthOAuthInvitationRejectedError";
  }
}

export interface AssertOAuthSignUpInvitationAllowedInput {
  readonly email: string;
  readonly env?: NodeJS.ProcessEnv;
  readonly providerId: TenantOAuthProviderId;
}

export function isAfendaAuthOAuthCallbackPath(path: string): boolean {
  if (!path.startsWith(AFENDA_AUTH_OAUTH_CALLBACK_PREFIX)) {
    return false;
  }

  const providerId = readOAuthProviderIdFromCallbackPath(path);
  return providerId !== undefined;
}

export function readOAuthProviderIdFromCallbackPath(
  path: string
): TenantOAuthProviderId | undefined {
  if (!path.startsWith(AFENDA_AUTH_OAUTH_CALLBACK_PREFIX)) {
    return;
  }

  const segments = path.split("/").filter(Boolean);
  const providerId = segments.at(-1);

  if (providerId === "google" || providerId === "microsoft") {
    return providerId;
  }

  return;
}

export async function resolveTenantIdForOAuthInvitationGate(input: {
  readonly email: string;
  readonly providerId: TenantOAuthProviderId;
}): Promise<string | null> {
  const email = input.email.trim().toLowerCase();
  const pending = await findPendingMemberInvitationForEmail({ email });

  if (!pending?.tenantId) {
    return null;
  }

  const provider = await getTenantOAuthProviderConfig({
    providerId: input.providerId,
    tenantId: pending.tenantId,
  });

  return provider ? pending.tenantId : null;
}

export async function assertOAuthSignUpInvitationAllowed(
  input: AssertOAuthSignUpInvitationAllowedInput
): Promise<void> {
  const env = input.env ?? process.env;

  if (!isAuthInvitationGateEnabled(env)) {
    return;
  }

  const email = input.email.trim().toLowerCase();
  const tenantId = await resolveTenantIdForOAuthInvitationGate({
    email,
    providerId: input.providerId,
  });

  if (!tenantId) {
    await persistAuthAuditEvent({
      event: AUTH_EVENT.oauthSignInFailed,
      result: "denied",
      reason:
        "OAuth sign-up requires a pending invitation and an enabled tenant OAuth provider.",
      context: {
        email,
        oauthProviderId: input.providerId,
      },
    });
    throw new AuthOAuthInvitationRejectedError(
      "OAuth sign-up requires a pending invitation and an enabled tenant OAuth provider."
    );
  }

  const pending = await findPendingMemberInvitationForEmail({
    email,
    tenantId,
  });

  if (!pending) {
    await persistAuthAuditEvent({
      event: AUTH_EVENT.oauthSignInFailed,
      result: "denied",
      reason: "OAuth sign-up requires a pending invitation for this email.",
      context: {
        email,
        oauthProviderId: input.providerId,
        tenantId,
      },
    });
    throw new AuthOAuthInvitationRejectedError(
      "OAuth sign-up requires a pending invitation for this email."
    );
  }
}

export function createAfendaOAuthSocialProviderOptions() {
  return {
    disableImplicitSignUp: true,
  } as const;
}

export interface AfendaOAuthUserCreateHookContext {
  readonly path?: string;
}

export async function handleAfendaOAuthUserCreateBeforeHook(input: {
  readonly ctx: AfendaOAuthUserCreateHookContext;
  readonly email: string;
  readonly env?: NodeJS.ProcessEnv;
}): Promise<void> {
  const providerId = readOAuthProviderIdFromCallbackPath(input.ctx.path ?? "");

  if (!providerId) {
    return;
  }

  await assertOAuthSignUpInvitationAllowed({
    email: input.email,
    providerId,
    ...(input.env === undefined ? {} : { env: input.env }),
  });
}

export function createAfendaOAuthUserCreateBeforeHook(
  env: NodeJS.ProcessEnv = process.env
) {
  return async (user: { email: string }, ctx: unknown) => {
    const path =
      typeof ctx === "object" &&
      ctx !== null &&
      "path" in ctx &&
      typeof ctx.path === "string"
        ? ctx.path
        : undefined;

    await handleAfendaOAuthUserCreateBeforeHook({
      ctx: { ...(path === undefined ? {} : { path }) },
      email: user.email,
      env,
    });

    return { data: user };
  };
}
