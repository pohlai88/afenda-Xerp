import { createAuthMiddleware } from "better-auth/api";

import { recordAuthAuditEvent } from "./auth.audit.js";
import { AUTH_EVENT } from "./auth.contract.js";

function createAuthCorrelationId(prefix = "auth"): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function readRequestMeta(ctx: { headers?: Headers; request?: Request }): {
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

function readSignInEmail(ctx: { body?: unknown }): string | undefined {
  if (typeof ctx.body !== "object" || !ctx.body || !("email" in ctx.body)) {
    return;
  }

  const email = ctx.body.email;
  return typeof email === "string" ? email : undefined;
}

/** Better Auth after-hooks for governed auth audit events (TIP-004). */
function createAfendaAuthAuditHooks() {
  return createAuthMiddleware((ctx) => {
    const meta = readRequestMeta(ctx);
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

        recordAuthAuditEvent({
          event: AUTH_EVENT.signInSucceeded,
          result: "success",
          context,
        });
        recordAuthAuditEvent({
          event: AUTH_EVENT.sessionCreated,
          result: "success",
          context,
        });
        return Promise.resolve();
      }

      recordAuthAuditEvent({
        event: AUTH_EVENT.signInFailed,
        result: "failure",
        context: {
          email: readSignInEmail(ctx),
          ipAddress: meta.ipAddress,
          userAgent: meta.userAgent,
          correlationId,
        },
        reason: "Invalid email or password.",
      });
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

      recordAuthAuditEvent({
        event: AUTH_EVENT.signOut,
        result: "success",
        context,
      });
      recordAuthAuditEvent({
        event: AUTH_EVENT.sessionInvalidated,
        result: "success",
        context,
      });
    }

    return Promise.resolve();
  });
}
