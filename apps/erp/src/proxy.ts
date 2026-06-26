import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import { resolveUnauthenticatedRedirect } from "@/lib/auth/auth-redirect.policy";
import {
  isAuthEntryRoute,
  isPublicRoute,
  shouldRedirectAuthenticatedUserFromAuthEntry,
} from "@/lib/auth/public-routes";
import { resolveSafeInternalPath } from "@/lib/auth/resolve-safe-internal-path";
import {
  ACTIVE_ROUTE_PATH_HEADER,
  DEFAULT_TENANT_BASE_DOMAIN,
  DEV_DEFAULT_TENANT_SLUG,
  ORGANIZATION_SLUG_PATH_HINT_HEADER,
  TENANT_SLUG_HEADER,
} from "@/lib/context/context.constants";
import {
  resolveTenantSlugFromHostname,
  resolveWorkspacePathRouting,
} from "@/lib/context/tenant-domain";
import { CORRELATION_ID_HEADER } from "@/lib/observability/correlation-header";
import { resolveCorrelationIdFromHeaders } from "@/lib/observability/resolve-correlation-id";
import { applyContentSecurityPolicy } from "@/lib/security/csp";
import { resolveCspPolicyMode } from "@/lib/security/csp-strategy";

export { CORRELATION_ID_HEADER };

function isDevelopmentRuntime(): boolean {
  return process.env["NODE_ENV"] === "development";
}

function resolveTenantBaseDomain(): string {
  return (
    process.env["NEXT_PUBLIC_BASE_DOMAIN"]?.trim() || DEFAULT_TENANT_BASE_DOMAIN
  );
}

function finalizeProxyResponse(
  request: NextRequest,
  requestHeaders: Headers,
  response: NextResponse
): NextResponse {
  const correlationId = resolveCorrelationIdFromHeaders(request.headers);
  const { pathname } = request.nextUrl;
  requestHeaders.set(CORRELATION_ID_HEADER, correlationId);
  applyContentSecurityPolicy(
    requestHeaders,
    response.headers,
    isDevelopmentRuntime(),
    resolveCspPolicyMode(pathname, process.env, isDevelopmentRuntime()),
    process.env
  );
  response.headers.set(CORRELATION_ID_HEADER, correlationId);
  return response;
}

function continueWithRequestHeaders(
  request: NextRequest,
  requestHeaders: Headers
): NextResponse {
  return finalizeProxyResponse(
    request,
    requestHeaders,
    NextResponse.next({
      request: { headers: requestHeaders },
    })
  );
}

function resolveE2eDefaultTenantSlug(): string | null {
  const configured = process.env["AFENDA_E2E_DEFAULT_TENANT_SLUG"]?.trim();
  return configured && configured.length > 0 ? configured : null;
}

function resolveDevelopmentDefaultTenantSlug(): string | null {
  if (!isDevelopmentRuntime()) {
    return null;
  }

  const configured = process.env["AFENDA_DEV_DEFAULT_TENANT_SLUG"]?.trim();
  return configured && configured.length > 0
    ? configured
    : DEV_DEFAULT_TENANT_SLUG;
}

function applyTenantRoutingHeaders(input: {
  readonly hostname: string;
  readonly pathname: string;
  readonly requestHeaders: Headers;
}): {
  readonly pathname: string;
  readonly tenantSlug: string | null;
} {
  const baseDomain = resolveTenantBaseDomain();
  const pathRouting = resolveWorkspacePathRouting(input.pathname);
  const allowDevelopmentDefaultTenant = !isAuthEntryRoute(input.pathname);
  const tenantSlug =
    resolveTenantSlugFromHostname(input.hostname, { baseDomain }) ??
    pathRouting.tenantSlugFromPath ??
    (allowDevelopmentDefaultTenant
      ? resolveDevelopmentDefaultTenantSlug()
      : null) ??
    (allowDevelopmentDefaultTenant ? resolveE2eDefaultTenantSlug() : null);

  if (tenantSlug) {
    input.requestHeaders.set(TENANT_SLUG_HEADER, tenantSlug);
  }

  if (pathRouting.organizationSlugHint) {
    input.requestHeaders.set(
      ORGANIZATION_SLUG_PATH_HINT_HEADER,
      pathRouting.organizationSlugHint
    );
  }

  input.requestHeaders.set(ACTIVE_ROUTE_PATH_HEADER, pathRouting.pathname);

  return {
    pathname: pathRouting.pathname,
    tenantSlug,
  };
}

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const hostname = request.headers.get("host") ?? request.nextUrl.hostname;
  const { pathname: routedPathname } = applyTenantRoutingHeaders({
    hostname,
    pathname: request.nextUrl.pathname,
    requestHeaders,
  });

  const pathname =
    routedPathname === request.nextUrl.pathname
      ? request.nextUrl.pathname
      : routedPathname;

  if (isPublicRoute(pathname)) {
    const sessionCookie = getSessionCookie(request);

    if (
      sessionCookie &&
      shouldRedirectAuthenticatedUserFromAuthEntry(pathname)
    ) {
      const nextParam = request.nextUrl.searchParams.get("next");
      const destination = resolveSafeInternalPath(nextParam);
      return finalizeProxyResponse(
        request,
        requestHeaders,
        NextResponse.redirect(new URL(destination, request.url))
      );
    }

    if (routedPathname !== request.nextUrl.pathname) {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = routedPathname;
      return finalizeProxyResponse(
        request,
        requestHeaders,
        NextResponse.rewrite(rewriteUrl, {
          request: { headers: requestHeaders },
        })
      );
    }

    return continueWithRequestHeaders(request, requestHeaders);
  }

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const signInUrl = new URL(
      resolveUnauthenticatedRedirect(pathname),
      request.url
    );
    return finalizeProxyResponse(
      request,
      requestHeaders,
      NextResponse.redirect(signInUrl)
    );
  }

  if (routedPathname !== request.nextUrl.pathname) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = routedPathname;
    return finalizeProxyResponse(
      request,
      requestHeaders,
      NextResponse.rewrite(rewriteUrl, {
        request: { headers: requestHeaders },
      })
    );
  }

  return continueWithRequestHeaders(request, requestHeaders);
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
