const AUTH_SHELL_V2_DEFAULT_ENV = "AFENDA_AUTH_SHELL_V2_DEFAULT" as const;

/**
 * Client-safe mirror of `@afenda/auth` `isAuthShellV2Default` — reads env only,
 * no database or Better Auth server imports.
 */
export function isAuthShellV2Default(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  const raw = env[AUTH_SHELL_V2_DEFAULT_ENV]?.trim().toLowerCase();

  if (raw === "false" || raw === "0") {
    return false;
  }

  if (raw === "true" || raw === "1") {
    return true;
  }

  return true;
}
