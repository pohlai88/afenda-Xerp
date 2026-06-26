export function createAuthCorrelationId(prefix = "auth"): string {
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
