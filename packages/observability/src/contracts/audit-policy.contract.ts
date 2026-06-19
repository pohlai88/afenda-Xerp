export const FORBIDDEN_AUDIT_METADATA_KEYS = [
  "password",
  "secret",
  "credential",
  "accessToken",
  "refreshToken",
  "sessionToken",
  "privateKey",
] as const;

export type ForbiddenAuditMetadataKey =
  (typeof FORBIDDEN_AUDIT_METADATA_KEYS)[number];

export const SENSITIVE_METADATA_KEY_PATTERN =
  /(?:^|_)(password|passwd|secret|token|session|authorization|cookie|apikey|api_key|access_token|refresh_token|private_key|credential|credentials|bearer)(?:_|$)/iu;
