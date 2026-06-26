import {
  AFENDA_LAST_USED_LOGIN_METHOD_COOKIE,
  AFENDA_LAST_USED_LOGIN_METHOD_MAX_AGE_SECONDS,
  type AfendaLastUsedLoginMethod,
} from "./auth-last-login-method.constants";

const VALID_METHODS = new Set<AfendaLastUsedLoginMethod>([
  "email",
  "google",
  "github",
  "passkey",
  "sso",
]);

function readCookieValue(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const prefix = `${name}=`;
  const match = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(prefix));

  return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}

function writeCookieValue(name: string, value: string): void {
  if (typeof document === "undefined") {
    return;
  }

  // biome-ignore lint/suspicious/noDocumentCookie: lightweight client hint cookie without server round-trip
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${AFENDA_LAST_USED_LOGIN_METHOD_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function getLastUsedLoginMethod(): AfendaLastUsedLoginMethod | null {
  const raw = readCookieValue(AFENDA_LAST_USED_LOGIN_METHOD_COOKIE);

  if (raw === null || !VALID_METHODS.has(raw as AfendaLastUsedLoginMethod)) {
    return null;
  }

  return raw as AfendaLastUsedLoginMethod;
}

export function setLastUsedLoginMethod(
  method: AfendaLastUsedLoginMethod
): void {
  writeCookieValue(AFENDA_LAST_USED_LOGIN_METHOD_COOKIE, method);
}

export function isLastUsedLoginMethod(
  method: AfendaLastUsedLoginMethod
): boolean {
  return getLastUsedLoginMethod() === method;
}

export function formatSignInMethodLabel(
  label: string,
  method: AfendaLastUsedLoginMethod
): string {
  return isLastUsedLoginMethod(method) ? `${label} · Last used` : label;
}
