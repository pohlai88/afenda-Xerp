/**
 * Pino redaction paths for sensitive fields.
 *
 * Applied to every log entry produced by the pino-backed logger.
 * Paths follow pino's dot-notation pattern syntax.
 */
export const PINO_REDACT_PATHS: readonly string[] = [
  "password",
  "passwd",
  "secret",
  "token",
  "accessToken",
  "refreshToken",
  "sessionToken",
  "authorization",
  "cookie",
  "apiKey",
  "api_key",
  "privateKey",
  "private_key",
  "credential",
  "credentials",
  "bearer",
  "*.password",
  "*.passwd",
  "*.secret",
  "*.token",
  "*.accessToken",
  "*.refreshToken",
  "*.sessionToken",
  "*.authorization",
  "*.cookie",
  "*.apiKey",
  "*.api_key",
  "*.privateKey",
  "*.private_key",
  "*.credential",
  "*.credentials",
  "*.bearer",
] as const;

export const PINO_REDACT_CENSOR = "[REDACTED]" as const;
