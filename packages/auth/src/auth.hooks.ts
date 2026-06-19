import { createAuthMiddleware } from "better-auth/api";

import { persistAuthAuditEvent } from "./auth.audit.js";
import { AUTH_EVENT } from "./auth.contract.js";

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

export function readAuthSignInEmail(ctx: {
  body?: unknown;
}): string | undefined {
  if (typeof ctx.body !== "object" || !ctx.body || !("email" in ctx.body)) {
    return;
  }

  const email = ctx.body.email;
  return typeof email === "string" ? email : undefined;
}

interface AuthAuditHookContext {
  body?: unknown;
  context: {
    newSession?: {
      session: { id: string };
      user: { id: string; email: string };
    };
    returned?: unknown;
    session?: {
      session: { id: string };
      user: { id: string };
    };
  };
  headers?: Headers;
  path: string;
  request?: Request;
}

type PersistAuthAuditEvent = typeof persistAuthAuditEvent;

export async function handleAfendaAuthAuditHook(
  ctx: AuthAuditHookContext,
  persist: PersistAuthAuditEvent = persistAuthAuditEvent
): Promise<void> {
  const meta = readAuthRequestMeta(ctx);
  const correlationId = createAuthCorrelationId();

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

    await persist({
      event: AUTH_EVENT.signInFailed,
      result: "failure",
      context: {
        email: readAuthSignInEmail(ctx),
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

    await Promise.all([
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
    ]);
  }
}

/** Better Auth after-hooks for governed auth audit events (TIP-004). */
export function createAfendaAuthAuditHooks() {
  return createAuthMiddleware(async (ctx) => {
    await handleAfendaAuthAuditHook(ctx);
  });
}
