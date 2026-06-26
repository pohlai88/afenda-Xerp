export const AFENDA_LAST_USED_LOGIN_METHOD_COOKIE =
  "afenda-last-used-login-method" as const;

export const AFENDA_LAST_USED_LOGIN_METHOD_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export type AfendaLastUsedLoginMethod =
  | "email"
  | "google"
  | "github"
  | "passkey"
  | "sso";
