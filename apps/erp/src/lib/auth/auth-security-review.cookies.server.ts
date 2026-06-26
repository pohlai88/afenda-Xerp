import { cookies } from "next/headers";

import {
  AFENDA_POST_AUTH_SIGN_IN_METHOD_COOKIE,
  AFENDA_SECURITY_REVIEW_ACK_COOKIE,
  AFENDA_SECURITY_REVIEW_ACK_MAX_AGE_SECONDS,
  type PostAuthSignInMethod,
} from "./auth-post-auth-method.constants";

const REVIEW_COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: AFENDA_SECURITY_REVIEW_ACK_MAX_AGE_SECONDS,
  path: "/",
  sameSite: "lax" as const,
} as const;

export async function readPostAuthSignInMethodCookie(): Promise<PostAuthSignInMethod | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(AFENDA_POST_AUTH_SIGN_IN_METHOD_COOKIE)?.value;

  if (raw === undefined || raw.length === 0) {
    return null;
  }

  const decoded = decodeURIComponent(raw);

  if (
    decoded === "email" ||
    decoded === "google" ||
    decoded === "github" ||
    decoded === "passkey" ||
    decoded === "sso"
  ) {
    return decoded;
  }

  return null;
}

export async function clearPostAuthSignInMethodCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AFENDA_POST_AUTH_SIGN_IN_METHOD_COOKIE);
}

export async function hasSecurityReviewAckCookie(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(AFENDA_SECURITY_REVIEW_ACK_COOKIE)?.value === "1";
}

export async function persistSecurityReviewAckCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(
    AFENDA_SECURITY_REVIEW_ACK_COOKIE,
    "1",
    REVIEW_COOKIE_OPTIONS
  );
}

export async function clearSecurityReviewAckCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AFENDA_SECURITY_REVIEW_ACK_COOKIE);
}

export async function clearSecurityReviewFlowCookies(): Promise<void> {
  await clearPostAuthSignInMethodCookie();
  await persistSecurityReviewAckCookie();
}
