/**
 * Explicit third-party CSP allowlist for @afenda/erp.
 *
 * Add entries here in the same PR that introduces the script integration.
 * Never use wildcards (`*`, bare `https:`) — list full origins only.
 *
 * Platform integrations with deployment-specific origins (Supabase browser
 * REST/Auth/Storage/Realtime) are resolved at policy build time via
 * `resolveSupabaseCspPlatformOrigins()` — not duplicated here.
 */
export interface CspThirdPartyAllowlist {
  readonly connectSrc: readonly string[];
  readonly fontSrc: readonly string[];
  readonly frameSrc: readonly string[];
  readonly imgSrc: readonly string[];
  readonly scriptSrc: readonly string[];
}

export const CSP_THIRD_PARTY_ALLOWLIST = {
  connectSrc: [],
  fontSrc: [],
  frameSrc: [],
  imgSrc: [],
  scriptSrc: [],
} as const satisfies CspThirdPartyAllowlist;

export type CspAllowlistDirective = keyof CspThirdPartyAllowlist;

const FORBIDDEN_ALLOWLIST_PATTERN =
  /(?:^\*$|^https:$|^http:$|\*\.)|(?:^'unsafe-inline'$)/u;

export function assertAllowlistedOrigin(origin: string): void {
  const normalized = origin.trim();

  if (normalized.length === 0) {
    throw new Error("CSP allowlist origin must not be empty.");
  }

  if (FORBIDDEN_ALLOWLIST_PATTERN.test(normalized)) {
    throw new Error(
      `CSP allowlist origin "${normalized}" is forbidden. Use explicit https:// origins only.`
    );
  }

  if (
    !normalized.startsWith("https://") &&
    !normalized.startsWith("wss://") &&
    !normalized.startsWith("http://127.0.0.1:") &&
    !normalized.startsWith("http://localhost:")
  ) {
    throw new Error(
      `CSP allowlist origin "${normalized}" must start with https://, wss://, or a localhost dev origin.`
    );
  }

  if (normalized.startsWith("wss://")) {
    const hostPort = normalized.slice("wss://".length);
    if (hostPort.includes("/") || hostPort.length === 0) {
      throw new Error(
        `CSP allowlist origin "${normalized}" must be wss://host with no path.`
      );
    }
  }
}

export function validateCspThirdPartyAllowlist(
  allowlist: CspThirdPartyAllowlist = CSP_THIRD_PARTY_ALLOWLIST
): void {
  for (const directive of Object.keys(allowlist) as CspAllowlistDirective[]) {
    for (const origin of allowlist[directive]) {
      assertAllowlistedOrigin(origin);
    }
  }
}

export function appendAllowlistedSources(
  directive: string,
  sources: readonly string[]
): string {
  if (sources.length === 0) {
    return directive;
  }

  return `${directive} ${sources.join(" ")}`;
}

export function flattenThirdPartyAllowlist(
  allowlist: CspThirdPartyAllowlist = CSP_THIRD_PARTY_ALLOWLIST
): CspThirdPartyAllowlist {
  validateCspThirdPartyAllowlist(allowlist);
  return allowlist;
}
