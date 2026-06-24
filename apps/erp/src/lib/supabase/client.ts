import type { CookieOptions } from "@supabase/ssr";
import {
  createBrowserClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";

import { getSupabasePublicKey, getSupabasePublicUrl } from "./env";

interface BrowserCookiePair {
  readonly name: string;
  readonly value: string;
}

function readBrowserCookies(): BrowserCookiePair[] {
  if (typeof document === "undefined") {
    return [];
  }

  return parseCookieHeader(document.cookie).flatMap((cookie) =>
    cookie.value === undefined
      ? []
      : [{ name: cookie.name, value: cookie.value }]
  );
}

function assignDocumentCookie(
  name: string,
  value: string,
  options: CookieOptions
): void {
  // Supabase SSR browser adapter; Cookie Store API is not universally available.
  // biome-ignore lint/suspicious/noDocumentCookie: required by @supabase/ssr browser cookie writes
  document.cookie = serializeCookieHeader(name, value, options);
}

function writeBrowserCookies(
  cookiesToSet: ReadonlyArray<{
    readonly name: string;
    readonly value: string;
    readonly options: CookieOptions;
  }>,
  _headers?: Record<string, string>
): void {
  if (typeof document === "undefined") {
    return;
  }

  for (const cookie of cookiesToSet) {
    assignDocumentCookie(cookie.name, cookie.value, cookie.options);
  }
}

function createBrowserCookieMethods() {
  return {
    getAll: readBrowserCookies,
    setAll: writeBrowserCookies,
  };
}

/** Cookie-backed Supabase client for Client Components. */
export function createSupabaseBrowserClient() {
  return createBrowserClient(getSupabasePublicUrl(), getSupabasePublicKey(), {
    cookies: createBrowserCookieMethods(),
  });
}

/** @internal Exported for unit tests. */
export function __readBrowserCookiesForTests(): BrowserCookiePair[] {
  return readBrowserCookies();
}

/** @internal Exported for unit tests. */
export function __writeBrowserCookiesForTests(
  cookiesToSet: ReadonlyArray<{
    readonly name: string;
    readonly value: string;
    readonly options: CookieOptions;
  }>
): void {
  writeBrowserCookies(cookiesToSet);
}
