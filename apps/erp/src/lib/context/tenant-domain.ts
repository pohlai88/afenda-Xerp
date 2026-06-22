import { assertPlatformSlug } from "@afenda/database";

import {
  DEFAULT_TENANT_BASE_DOMAIN,
  isReservedTenantSubdomain,
} from "./context.constants";

const TENANT_PATH_PREFIX = /^\/t\/([a-z0-9]+(?:-[a-z0-9]+)*)(?=\/|$)/;
const ORGANIZATION_PATH_PREFIX = /^\/o\/([a-z0-9]+(?:-[a-z0-9]+)*)(?=\/|$)/;

export interface ResolveTenantSlugOptions {
  readonly allowLocalhost?: boolean;
  readonly baseDomain?: string;
}

export interface WorkspacePathRoutingResult {
  /** Rewritten pathname with tenant/org prefixes removed for Next.js routing. */
  readonly pathname: string;
  /** Organization selection hint from `/o/{slug}` — not tenant authority. */
  readonly organizationSlugHint: string | null;
  /** Tenant slug from `/t/{slug}` path prefix when hostname carries no tenant. */
  readonly tenantSlugFromPath: string | null;
}

function normalizeCandidateSlug(candidate: string): string | null {
  const trimmed = candidate.trim().toLowerCase();

  if (!trimmed || isReservedTenantSubdomain(trimmed)) {
    return null;
  }

  try {
    return assertPlatformSlug(trimmed);
  } catch {
    return null;
  }
}

/**
 * Resolves tenant slug from `{tenantSlug}.{baseDomain}` hostnames.
 * Tenant subdomain resolves tenant only — never legal entity selection.
 */
export function resolveTenantSlugFromHostname(
  hostname: string,
  options: ResolveTenantSlugOptions = {}
): string | null {
  const host = hostname.split(":")[0]?.trim().toLowerCase() ?? "";
  const allowLocalhost = options.allowLocalhost ?? true;

  if (allowLocalhost && host.endsWith(".localhost")) {
    const subdomain = host.slice(0, host.length - ".localhost".length);
    return normalizeCandidateSlug(subdomain);
  }

  const baseDomain = (
    options.baseDomain ?? DEFAULT_TENANT_BASE_DOMAIN
  ).toLowerCase();

  if (!host.endsWith(`.${baseDomain}`)) {
    return null;
  }

  const subdomain = host.slice(0, host.length - baseDomain.length - 1);
  return normalizeCandidateSlug(subdomain);
}

/** Fallback route prefix: `/t/{tenantSlug}` — tenant authority only. */
export function resolveTenantSlugFromPathname(pathname: string): string | null {
  const match = TENANT_PATH_PREFIX.exec(pathname);
  if (!match?.[1]) {
    return null;
  }

  return normalizeCandidateSlug(match[1]);
}

/**
 * Organization workspace path prefix: `/o/{organizationSlug}`.
 * Resolves organization selection hint only — never tenant authority.
 */
export function resolveOrganizationSlugFromPathname(
  pathname: string
): string | null {
  const match = ORGANIZATION_PATH_PREFIX.exec(pathname);
  if (!match?.[1]) {
    return null;
  }

  return normalizeCandidateSlug(match[1]);
}

/**
 * Strips `/t/{tenantSlug}` and `/o/{organizationSlug}` prefixes for internal routing.
 * Prefix order: tenant path first, then organization path on the remainder.
 */
export function resolveWorkspacePathRouting(
  pathname: string
): WorkspacePathRoutingResult {
  let remaining = pathname;
  let tenantSlugFromPath: string | null = null;
  let organizationSlugHint: string | null = null;

  const tenantMatch = TENANT_PATH_PREFIX.exec(remaining);
  if (tenantMatch?.[1]) {
    tenantSlugFromPath = normalizeCandidateSlug(tenantMatch[1]);
    remaining = remaining.slice(tenantMatch[0].length);
    if (remaining.length === 0) {
      remaining = "/";
    }
  }

  const organizationMatch = ORGANIZATION_PATH_PREFIX.exec(remaining);
  if (organizationMatch?.[1]) {
    organizationSlugHint = normalizeCandidateSlug(organizationMatch[1]);
    remaining = remaining.slice(organizationMatch[0].length);
    if (remaining.length === 0) {
      remaining = "/";
    }
  }

  return {
    pathname: remaining,
    tenantSlugFromPath,
    organizationSlugHint,
  };
}

export function resolveTenantSlugFromRequest(input: {
  readonly hostname: string;
  readonly pathname: string;
  readonly baseDomain?: string;
}): string | null {
  const pathRouting = resolveWorkspacePathRouting(input.pathname);

  return (
    resolveTenantSlugFromHostname(input.hostname, {
      ...(input.baseDomain === undefined ? {} : { baseDomain: input.baseDomain }),
    }) ??
    pathRouting.tenantSlugFromPath ??
    resolveTenantSlugFromPathname(input.pathname)
  );
}
