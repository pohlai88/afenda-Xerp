import { APIError, createAuthMiddleware } from "better-auth/api";

import { persistAuthAuditEvent } from "./auth.audit.js";
import { AUTH_EVENT } from "./auth.contract.js";
import {
  consumeAuthInvitation,
  isAuthInvitationGateEnabled,
  readInvitationTokenFromBody,
  validateAuthInvitation,
} from "./auth.invitation.js";
import { isAfendaAuthSsoCallbackPath } from "./auth.sso-policy.js";

function createAuthCorrelationId(prefix = "auth"): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function readAuthRequestMeta(ctx: {
  headers?: Headers;
  request?: Request;
}): {
  ipAddress: string | null;
  userAgent: string | null;
} {
  const headers = ctx.headers ?? ctx.request?.headers;

  if (!headers) {
    return { ipAddress: null, userAgent: null };
  }

  return {
    ipAddress: headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: headers.get("user-agent"),
  };
}

export function readAuthEmailFromBody(ctx: {
  body?: unknown;
}): string | undefined {
  if (typeof ctx.body !== "object" || !ctx.body || !("email" in ctx.body)) {
    return;
  }

  const email = ctx.body.email;
  return typeof email === "string" ? email : undefined;
}

function isAuthSuccessReturned(returned: unknown): boolean {
  return (
    typeof returned === "object" &&
    returned !== null &&
    "status" in returned &&
    returned.status === true
  );
}

function isTwoFactorVerifySuccess(returned: unknown): boolean {
  if (
    typeof returned !== "object" ||
    returned === null ||
    !("user" in returned)
  ) {
    return false;
  }

  const user = returned.user;
  return typeof user === "object" && user !== null && "id" in user;
}

function readAuthSessionTokenFromBody(ctx: {
  body?: unknown;
}): string | undefined {
  if (
    typeof ctx.body !== "object" ||
    !ctx.body ||
    !("sessionToken" in ctx.body)
  ) {
    return;
  }

  const sessionToken = ctx.body.sessionToken;
  return typeof sessionToken === "string" ? sessionToken : undefined;
}

function hasMultiSessionCookies(ctx: {
  headers?: Headers;
  request?: Request;
}): boolean {
  const headers = ctx.headers ?? ctx.request?.headers;

  if (!headers) {
    return false;
  }

  const cookieHeader = headers.get("cookie");

  if (!cookieHeader) {
    return false;
  }

  return cookieHeader.split(";").some((part) => part.includes("_multi-"));
}

function readAuthReturnedUser(returned: unknown):
  | {
      email: string;
      id: string;
    }
  | undefined {
  if (typeof returned !== "object" || !returned || !("user" in returned)) {
    return;
  }

  const user = returned.user;

  if (typeof user !== "object" || !user || user === null) {
    return;
  }

  const id = "id" in user && typeof user.id === "string" ? user.id : undefined;
  const email =
    "email" in user && typeof user.email === "string" ? user.email : undefined;

  if (!(id && email)) {
    return;
  }

  return { id, email };
}

interface AuthAuditHookContext {
  body?: unknown;
  context: {
    newSession?: {
      session: { id: string };
      user: { id: string; email: string };
    } | null;
    returned?: unknown;
    session?: {
      session: { id: string };
      user: { id: string };
    } | null;
  };
  headers?: Headers;
  path: string;
  request?: Request;
}

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
  env: NodeJS.ProcessEnv = process.env
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
  env: NodeJS.ProcessEnv = process.env
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

function readSsoProviderIdFromPath(path: string): string | undefined {
  if (!isAfendaAuthSsoCallbackPath(path)) {
    return;
  }

  const segments = path.split("/").filter(Boolean);
  return segments.at(-1);
}

function readPasskeyIdFromBody(ctx: { body?: unknown }): string | undefined {
  if (typeof ctx.body !== "object" || !ctx.body || !("id" in ctx.body)) {
    return;
  }

  const id = ctx.body.id;
  return typeof id === "string" ? id : undefined;
}

function readRegisteredPasskeyFromReturned(returned: unknown):
  | {
      id: string;
      userId: string;
    }
  | undefined {
  if (
    typeof returned !== "object" ||
    !returned ||
    !("id" in returned) ||
    !("userId" in returned)
  ) {
    return;
  }

  const id = returned.id;
  const userId = returned.userId;

  if (typeof id !== "string" || typeof userId !== "string") {
    return;
  }

  return { id, userId };
}

function isPasskeyAuthenticationSuccess(returned: unknown): returned is {
  session: unknown;
  user: unknown;
} {
  return (
    typeof returned === "object" &&
    returned !== null &&
    "session" in returned &&
    "user" in returned
  );
}

function readPasskeyAuthUser(returned: unknown):
  | {
      id: string;
      sessionId: string;
    }
  | undefined {
  if (!isPasskeyAuthenticationSuccess(returned)) {
    return;
  }

  const session = returned.session;
  const user = returned.user;

  if (
    typeof session !== "object" ||
    !session ||
    !("id" in session) ||
    typeof session.id !== "string"
  ) {
    return;
  }

  if (
    typeof user !== "object" ||
    !user ||
    !("id" in user) ||
    typeof user.id !== "string"
  ) {
    return;
  }

  return {
    id: user.id,
    sessionId: session.id,
  };
}

export async function handleAfendaAuthAuditHook(
  ctx: AuthAuditHookContext,
  persist: PersistAuthAuditEvent = persistAuthAuditEvent
): Promise<void> {
  const meta = readAuthRequestMeta(ctx);
  const correlationId = createAuthCorrelationId();

  if (isAfendaAuthSsoCallbackPath(ctx.path) && ctx.context.newSession) {
    const { user, session } = ctx.context.newSession;
    const ssoProviderId = readSsoProviderIdFromPath(ctx.path);
    await persist({
      event: AUTH_EVENT.ssoSignInSucceeded,
      result: "success",
      context: {
        authUserId: user.id,
        email: user.email,
        sessionId: session.id,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        correlationId,
        ...(ssoProviderId === undefined ? {} : { ssoProviderId }),
      },
    });
    await persist({
      event: AUTH_EVENT.sessionCreated,
      result: "success",
      context: {
        authUserId: user.id,
        email: user.email,
        sessionId: session.id,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        correlationId,
      },
    });
    return;
  }

  if (ctx.path === "/sign-up/email") {
    const user = readAuthReturnedUser(ctx.context.returned);

    if (!user) {
      return;
    }

    const invitationToken = readInvitationTokenFromBody(ctx.body);
    const consumedInvitation =
      invitationToken === undefined
        ? null
        : await consumeAuthInvitation(invitationToken);

    await persist({
      event: AUTH_EVENT.invitationAccepted,
      result: "success",
      context: {
        authUserId: user.id,
        email: user.email,
        correlationId,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        ...(consumedInvitation === null
          ? {}
          : {
              invitationId: consumedInvitation.invitationId,
              ...(consumedInvitation.platformUserId === undefined
                ? {}
                : { platformUserId: consumedInvitation.platformUserId }),
              ...(consumedInvitation.tenantId === undefined
                ? {}
                : { tenantId: consumedInvitation.tenantId }),
            }),
      },
    });
    return;
  }

  if (ctx.path === "/sign-in/email") {
    const returned = ctx.context.returned;

    if (
      returned &&
      typeof returned === "object" &&
      "token" in returned &&
      ctx.context.newSession
    ) {
      const { user, session } = ctx.context.newSession;
      const context = {
        authUserId: user.id,
        sessionId: session.id,
        email: user.email,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        correlationId,
      };

      await Promise.all([
        persist({
          event: AUTH_EVENT.signInSucceeded,
          result: "success",
          context,
        }),
        persist({
          event: AUTH_EVENT.sessionCreated,
          result: "success",
          context,
        }),
      ]);
      return;
    }

    const signInEmail = readAuthEmailFromBody(ctx);

    await persist({
      event: AUTH_EVENT.signInFailed,
      result: "failure",
      context: {
        ...(signInEmail === undefined ? {} : { email: signInEmail }),
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        correlationId,
      },
      reason: "Invalid email or password.",
    });
    return;
  }

  if (ctx.path === "/sign-out" && ctx.context.session) {
    const { session, user } = ctx.context.session;
    const context = {
      authUserId: user.id,
      sessionId: session.id,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      correlationId,
    };

    const auditWrites = [
      persist({
        event: AUTH_EVENT.signOut,
        result: "success",
        context,
      }),
      persist({
        event: AUTH_EVENT.sessionInvalidated,
        result: "success",
        context,
      }),
    ];

    if (hasMultiSessionCookies(ctx)) {
      auditWrites.push(
        persist({
          event: AUTH_EVENT.sessionRevokedAll,
          result: "success",
          context,
        })
      );
    }

    await Promise.all(auditWrites);
    return;
  }

  if (
    ctx.path === "/send-verification-email" &&
    isAuthSuccessReturned(ctx.context.returned)
  ) {
    const email = readAuthEmailFromBody(ctx);

    await persist({
      event: AUTH_EVENT.emailVerificationSent,
      result: "success",
      context: {
        ...(email === undefined ? {} : { email }),
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        correlationId,
      },
    });
    return;
  }

  if (
    ctx.path === "/verify-email" &&
    isAuthSuccessReturned(ctx.context.returned)
  ) {
    const user = readAuthReturnedUser(ctx.context.returned);

    if (!user) {
      return;
    }

    await persist({
      event: AUTH_EVENT.emailVerified,
      result: "success",
      context: {
        authUserId: user.id,
        email: user.email,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        correlationId,
      },
    });
    return;
  }

  if (
    ctx.path === "/request-password-reset" &&
    isAuthSuccessReturned(ctx.context.returned)
  ) {
    const email = readAuthEmailFromBody(ctx);

    await persist({
      event: AUTH_EVENT.passwordResetRequested,
      result: "success",
      context: {
        ...(email === undefined ? {} : { email }),
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        correlationId,
      },
    });
    return;
  }

  if (
    ctx.path === "/reset-password" &&
    isAuthSuccessReturned(ctx.context.returned)
  ) {
    await persist({
      event: AUTH_EVENT.passwordResetCompleted,
      result: "success",
      context: {
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        correlationId,
      },
    });
    return;
  }

  if (
    ctx.path === "/two-factor/disable" &&
    isAuthSuccessReturned(ctx.context.returned) &&
    ctx.context.session
  ) {
    const { session, user } = ctx.context.session;

    await persist({
      event: AUTH_EVENT.mfaDisabled,
      result: "success",
      context: {
        authUserId: user.id,
        sessionId: session.id,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        correlationId,
      },
    });
    return;
  }

  if (
    ctx.path === "/two-factor/verify-totp" &&
    isTwoFactorVerifySuccess(ctx.context.returned)
  ) {
    const user = readAuthReturnedUser(ctx.context.returned);

    if (!user) {
      return;
    }

    const context = {
      authUserId: user.id,
      email: user.email,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      correlationId,
      ...(ctx.context.session?.session.id === undefined
        ? {}
        : { sessionId: ctx.context.session.session.id }),
    };

    if (ctx.context.newSession) {
      await persist({
        event: AUTH_EVENT.mfaVerified,
        result: "success",
        context: {
          ...context,
          sessionId: ctx.context.newSession.session.id,
        },
      });
      return;
    }

    if (ctx.context.session) {
      await persist({
        event: AUTH_EVENT.mfaEnrolled,
        result: "success",
        context,
      });
    }
    return;
  }

  if (
    ctx.path === "/two-factor/verify-backup-code" &&
    isTwoFactorVerifySuccess(ctx.context.returned) &&
    ctx.context.newSession
  ) {
    const user = readAuthReturnedUser(ctx.context.returned);

    if (!user) {
      return;
    }

    await persist({
      event: AUTH_EVENT.mfaVerified,
      result: "success",
      context: {
        authUserId: user.id,
        email: user.email,
        sessionId: ctx.context.newSession.session.id,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        correlationId,
      },
    });
    return;
  }

  if (
    ctx.path === "/multi-session/revoke" &&
    isAuthSuccessReturned(ctx.context.returned) &&
    ctx.context.session
  ) {
    const { session, user } = ctx.context.session;
    const revokedSessionToken = readAuthSessionTokenFromBody(ctx);

    await persist({
      event: AUTH_EVENT.sessionDeviceRevoked,
      result: "success",
      context: {
        authUserId: user.id,
        sessionId: session.id,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        correlationId,
        ...(revokedSessionToken === undefined
          ? {}
          : { reason: `revokedSessionToken:${revokedSessionToken}` }),
      },
    });
    return;
  }

  if (ctx.path === "/passkey/verify-registration") {
    const registeredPasskey = readRegisteredPasskeyFromReturned(
      ctx.context.returned
    );

    if (!registeredPasskey) {
      return;
    }

    await persist({
      event: AUTH_EVENT.passkeyRegistered,
      result: "success",
      context: {
        authUserId: registeredPasskey.userId,
        passkeyId: registeredPasskey.id,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        correlationId,
        ...(ctx.context.session?.user.id === undefined
          ? {}
          : { sessionId: ctx.context.session.session.id }),
      },
    });
    return;
  }

  if (
    ctx.path === "/passkey/delete-passkey" &&
    isAuthSuccessReturned(ctx.context.returned) &&
    ctx.context.session
  ) {
    const { session, user } = ctx.context.session;
    const passkeyId = readPasskeyIdFromBody(ctx);

    await persist({
      event: AUTH_EVENT.passkeyDeleted,
      result: "success",
      context: {
        authUserId: user.id,
        sessionId: session.id,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        correlationId,
        ...(passkeyId === undefined ? {} : { passkeyId }),
      },
    });
    return;
  }

  if (ctx.path === "/passkey/verify-authentication") {
    const passkeyAuthUser = readPasskeyAuthUser(ctx.context.returned);

    if (passkeyAuthUser) {
      const context = {
        authUserId: passkeyAuthUser.id,
        sessionId: passkeyAuthUser.sessionId,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        correlationId,
      };

      await Promise.all([
        persist({
          event: AUTH_EVENT.passkeySignInSucceeded,
          result: "success",
          context,
        }),
        persist({
          event: AUTH_EVENT.sessionCreated,
          result: "success",
          context,
        }),
      ]);
      return;
    }

    await persist({
      event: AUTH_EVENT.passkeySignInFailed,
      result: "failure",
      context: {
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        correlationId,
      },
      reason: "Passkey authentication failed.",
    });
  }
}

/** Better Auth after-hooks for governed auth audit events (TIP-004). */
export function createAfendaAuthAuditHooks() {
  return createAuthMiddleware(async (ctx) => {
    await handleAfendaAuthAuditHook({
      ...(ctx.body === undefined ? {} : { body: ctx.body }),
      context: ctx.context,
      path: ctx.path,
      ...(ctx.headers === undefined ? {} : { headers: ctx.headers }),
      ...(ctx.request === undefined ? {} : { request: ctx.request }),
    });
  });
}
