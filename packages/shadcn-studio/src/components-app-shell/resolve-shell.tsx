"use client";

import type { ComponentType } from "react";

import { AdmincnShell, type AdmincnShellProps } from "./admincn-shell.js";

export type ShellSlug = "admincn" | "crm-shell" | "ai-shell";

type ShellComponent = ComponentType<AdmincnShellProps>;

const SHELL_MAP = {
  admincn: AdmincnShell,
} as const satisfies Partial<Record<ShellSlug, ShellComponent>>;

export function resolveShell(slug: ShellSlug = "admincn"): ShellComponent {
  const resolved = SHELL_MAP[slug as keyof typeof SHELL_MAP];
  if (resolved !== undefined) {
    return resolved;
  }

  return SHELL_MAP.admincn;
}

export { AdmincnShell as AppShell, type AdmincnShellProps as AppShellProps };
