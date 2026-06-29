import { type NextRequest, NextResponse } from "next/server";

export const CORRELATION_ID_HEADER = "x-correlation-id";

function resolveCorrelationId(request: NextRequest): string {
  return request.headers.get(CORRELATION_ID_HEADER) ?? crypto.randomUUID();
}

export function proxy(request: NextRequest) {
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
