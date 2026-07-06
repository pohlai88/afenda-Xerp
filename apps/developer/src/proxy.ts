import { type NextRequest, NextResponse } from "next/server";

import {
  LAB_CORRELATION_ID_HEADER,
  resolveLabCorrelationId,
  stripForbiddenSpoofHeaders,
} from "@/lib/lab/lab-request-policy";

/**
 * Route-lab edge request policy (P4) — correlation-id pass-through only.
 *
 * Mirrors ERP proxy shape without auth redirect, session gates, or tenant routing.
 */
export function proxy(request: NextRequest) {
  const requestHeaders = stripForbiddenSpoofHeaders(request.headers);
  const correlationId = resolveLabCorrelationId(
    requestHeaders.get(LAB_CORRELATION_ID_HEADER)
  );
  requestHeaders.set(LAB_CORRELATION_ID_HEADER, correlationId);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set(LAB_CORRELATION_ID_HEADER, correlationId);

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
