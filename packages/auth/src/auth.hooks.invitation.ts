import { APIError, createAuthMiddleware } from "better-auth/api";
import { persistAuthAuditEvent } from "./auth.audit.js";
import { AUTH_EVENT } from "./auth.contract.js";
import type { AuthEnvReaderInput } from "./auth.env-reader.js";
import { readAuthRuntimeEnv } from "./auth.env-reader.js";
import {
  createAuthCorrelationId,
  readAuthEmailFromBody,
  readAuthRequestMeta,
} from "./auth.hooks.shared.js";
import {
  isAuthInvitationGateEnabled,
  readInvitationTokenFromBody,
  validateAuthInvitation,
} from "./auth.invitation.js";

type PersistAuthAuditEvent = typeof persistAuthAuditEvent;

interface AuthInvitationHookContext {
  body?: unknown;
  headers?: Headers;
  path: string;
  request?: Request;
}

export async function handleAfendaAuthInvitationBeforeHook(
  ctx: AuthInvitationHookContext,
  persist: PersistAuthAuditEvent = persistAuthAuditEvent,
  env: AuthEnvReaderInput = readAuthRuntimeEnv()
): Promise<void> {
  if (ctx.path !== "/sign-up/email" || !isAuthInvitationGateEnabled(env)) {
    return;
  }

  const email = readAuthEmailFromBody(ctx);
  const invitationToken = readInvitationTokenFromBody(ctx.body);
  const meta = readAuthRequestMeta(ctx);
  const correlationId = createAuthCorrelationId("auth-invite");

  if (!email) {
    await persist({
      event: AUTH_EVENT.invitationRejected,
      result: "denied",
      reason: "Sign-up email is required for invitation validation.",
      context: {
        correlationId,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      },
    });
    throw APIError.from("BAD_REQUEST", {
      code: "INVITATION_EMAIL_REQUIRED",
      message: "Sign-up email is required.",
    });
  }

  if (!invitationToken) {
    await persist({
      event: AUTH_EVENT.invitationRejected,
      result: "denied",
      reason: "Invitation token is required for sign-up.",
      context: {
        email,
        correlationId,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      },
    });
    throw APIError.from("BAD_REQUEST", {
      code: "INVITATION_TOKEN_REQUIRED",
      message: "Invitation token is required for sign-up.",
    });
  }

  try {
    await validateAuthInvitation({ email, token: invitationToken });
  } catch (error) {
    const reason =
      error instanceof Error ? error.message : "Invitation token is invalid.";

    await persist({
      event: AUTH_EVENT.invitationRejected,
      result: "denied",
      reason,
      context: {
        email,
        correlationId,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      },
    });
    throw APIError.from("BAD_REQUEST", {
      code: "INVITATION_REJECTED",
      message: reason,
    });
  }
}

/** Better Auth before-hook — blocks /sign-up/email without a valid invitation token. */
export function createAfendaAuthInvitationBeforeHook(
  env: AuthEnvReaderInput = readAuthRuntimeEnv()
) {
  return createAuthMiddleware(async (ctx) => {
    await handleAfendaAuthInvitationBeforeHook(
      {
        ...(ctx.body === undefined ? {} : { body: ctx.body }),
        path: ctx.path,
        ...(ctx.headers === undefined ? {} : { headers: ctx.headers }),
        ...(ctx.request === undefined ? {} : { request: ctx.request }),
      },
      persistAuthAuditEvent,
      env
    );
  });
}
