import { getSessionCookie } from "better-auth/cookies";
import { NextRequest } from "next/server";

/** Reads Better Auth session cookie value from RSC/request headers (same signal as proxy.ts). */
export function readAfendaSessionCookieFromHeaders(
  headers: Headers
): string | null {
  return getSessionCookie(
    new NextRequest("https://afenda.internal/", { headers })
  );
}
