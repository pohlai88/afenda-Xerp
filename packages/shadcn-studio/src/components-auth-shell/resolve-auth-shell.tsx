import type { ComponentType } from "react";

import LoginPage02 from "./login-page-02.js";
import LoginPage04 from "./login-page-04.js";
import LoginPage05 from "./login-page-05.js";
import LoginPage06 from "./login-page-06.js";

/**
 * Form lanes for pre-auth ingress surfaces — keep aligned with
 * `apps/erp/src/lib/auth/auth-path.registry.ts` (`AuthShellFormLane`).
 */
export type AuthShellFormLane = "access" | "verify" | "recover" | "error";

type AuthShellBlock = ComponentType;

const AUTH_SHELL_MAP = {
  access: LoginPage04,
  verify: LoginPage02,
  recover: LoginPage05,
  error: LoginPage06,
} as const satisfies Partial<Record<AuthShellFormLane, AuthShellBlock>>;

export function resolveAuthShell(
  lane: AuthShellFormLane = "access"
): AuthShellBlock {
  const resolved = AUTH_SHELL_MAP[lane as keyof typeof AUTH_SHELL_MAP];
  if (resolved !== undefined) {
    return resolved;
  }

  return AUTH_SHELL_MAP.access;
}
