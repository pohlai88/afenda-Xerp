import {
  AFENDA_POST_AUTH_SIGN_IN_METHOD_COOKIE,
  AFENDA_POST_AUTH_SIGN_IN_METHOD_MAX_AGE_SECONDS,
  type PostAuthSignInMethod,
} from "./auth-post-auth-method.constants";

export function setPostAuthSignInMethod(method: PostAuthSignInMethod): void {
  if (typeof document === "undefined") {
    return;
  }

  // biome-ignore lint/suspicious/noDocumentCookie: short-lived post-auth method bridge before server session
  document.cookie = `${AFENDA_POST_AUTH_SIGN_IN_METHOD_COOKIE}=${encodeURIComponent(method)}; Path=/; Max-Age=${AFENDA_POST_AUTH_SIGN_IN_METHOD_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearPostAuthSignInMethod(): void {
  if (typeof document === "undefined") {
    return;
  }

  // biome-ignore lint/suspicious/noDocumentCookie: clear short-lived post-auth method bridge cookie
  document.cookie = `${AFENDA_POST_AUTH_SIGN_IN_METHOD_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
