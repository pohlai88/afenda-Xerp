import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

import { AUTH_PATHS } from "@/lib/auth/auth-path.registry";
import { isProtectedAppRouterPath } from "@/lib/auth/auth-protected-surface.registry";
import { resolveSafeInternalPath } from "@/lib/auth/resolve-safe-internal-path";
import { resolveUnauthenticatedRedirectPath } from "@/lib/auth/resolve-unauthenticated-redirect-path";

export const CORRELATION_ID_HEADER = "x-correlation-id";

function resolveCorrelationId(request: NextRequest): string {
  return request.headers.get(CORRELATION_ID_HEADER) ?? crypto.randomUUID();
}

function resolveProtectedRouteRedirect(
  request: NextRequest
): NextResponse | null {
  const { pathname } = request.nextUrl;

  if (!isProtectedAppRouterPath(pathname)) {
    return null;
  }

  const sessionCookie = getSessionCookie(request);

  if (sessionCookie !== null && sessionCookie.length > 0) {
    return null;
  }

  const destination = resolveUnauthenticatedRedirectPath(sessionCookie);
  const redirectUrl = new URL(destination, request.url);

  if (destination === AUTH_PATHS.signIn) {
    redirectUrl.searchParams.set(
      "next",
      resolveSafeInternalPath(pathname, "/")
    );
  }

  return NextResponse.redirect(redirectUrl);
}

export function proxy(request: NextRequest) {
  const protectedRedirect = resolveProtectedRouteRedirect(request);
  if (protectedRedirect !== null) {
    return protectedRedirect;
  }

  const requestHeaders = new Headers(request.headers);
  const correlationId = resolveCorrelationId(request);
  requestHeaders.set(CORRELATION_ID_HEADER, correlationId);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set(CORRELATION_ID_HEADER, correlationId);
  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
