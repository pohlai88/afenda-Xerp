import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

import { isPublicRoute } from "@/lib/auth/public-routes";

/** HTTP header that carries the correlation ID across the request boundary. */
export const CORRELATION_ID_HEADER = "x-correlation-id" as const;

/**
 * Generates or propagates a correlation ID for each inbound request.
 *
 * If the upstream caller already supplied `x-correlation-id`, that value
 * is forwarded. Otherwise a new UUIDv4 is generated. The resolved ID is
 * attached to both the forwarded request headers (so Server Components and
 * Route Handlers can read it) and the response headers (so browser DevTools
 * and edge logs can correlate the round-trip).
 */
function resolveCorrelationId(request: NextRequest): string {
  const incoming = request.headers.get(CORRELATION_ID_HEADER);
  return incoming?.trim() || crypto.randomUUID();
}

export function middleware(request: NextRequest) {
  const correlationId = resolveCorrelationId(request);
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CORRELATION_ID_HEADER, correlationId);

  if (isPublicRoute(pathname)) {
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.headers.set(CORRELATION_ID_HEADER, correlationId);
    return response;
  }

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("next", pathname);
    const redirect = NextResponse.redirect(signInUrl);
    redirect.headers.set(CORRELATION_ID_HEADER, correlationId);
    return redirect;
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set(CORRELATION_ID_HEADER, correlationId);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
