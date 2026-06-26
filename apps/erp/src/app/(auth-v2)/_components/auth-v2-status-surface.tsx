"use client";

import {
  AuthShellStatusSurface,
  type AuthShellStatusTone,
} from "@afenda/appshell/auth-shell-v2";

export type AuthV2StatusTone = "caution" | "neutral" | "positive";

const STATUS_TONE_MAP = {
  positive: "positive",
  caution: "warning",
  neutral: "neutral",
} as const satisfies Record<AuthV2StatusTone, AuthShellStatusTone>;

function formatStatusDescription(
  hints: readonly string[] | undefined
): string | undefined {
  if (hints === undefined || hints.length === 0) {
    return;
  }

  return hints.join(" ");
}

/**
 * App adapter — maps form/journey copy to package-owned `AuthShellStatusSurface`.
 * Uses `headingLevel={2}` because `AuthShellEntryPage` already renders the route `h1`.
 */
export function AuthV2StatusSurface({
  hints,
  lead,
  tone,
}: {
  readonly hints?: readonly string[];
  readonly lead: string;
  readonly tone: AuthV2StatusTone;
}) {
  const description = formatStatusDescription(hints);

  return (
    <AuthShellStatusSurface
      {...(description === undefined ? {} : { description })}
      headingLevel={2}
      title={lead}
      tone={STATUS_TONE_MAP[tone]}
    />
  );
}
