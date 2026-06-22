import type { OperatingContextError, OperatingContextSelection } from "@afenda/kernel";
import { headers } from "next/headers";

import {
  ORGANIZATION_SLUG_PATH_HINT_HEADER,
  TENANT_SLUG_HEADER,
} from "./context.constants";
import { tenantSlugMissingError } from "./context-errors";
import { readWorkspaceSelectionCookies } from "./workspace-selection-cookies.server";

export interface TenantRoutingHeaders {
  readonly organizationSlugPathHint: string | null;
  readonly tenantSlug: string | null;
}

/** Reads tenant routing headers injected by `apps/erp/src/proxy.ts`. */
export async function readTenantRoutingHeaders(): Promise<TenantRoutingHeaders> {
  const requestHeaders = await headers();

  const tenantSlug = requestHeaders.get(TENANT_SLUG_HEADER)?.trim() || null;
  const organizationSlugPathHint =
    requestHeaders.get(ORGANIZATION_SLUG_PATH_HINT_HEADER)?.trim() || null;

  return {
    tenantSlug,
    organizationSlugPathHint,
  };
}

export type BuildOperatingContextSelectionResult =
  | { readonly ok: true; readonly selection: OperatingContextSelection }
  | { readonly ok: false; readonly error: OperatingContextError };

/**
 * Assembles untrusted client selection hints from headers, cookies, and call-site overrides.
 * Authority is never granted here — only collected for server-side verification.
 */
export async function buildOperatingContextSelectionFromRequest(input?: {
  readonly selection?: Partial<Omit<OperatingContextSelection, "tenantSlug">>;
}): Promise<BuildOperatingContextSelectionResult> {
  const { organizationSlugPathHint, tenantSlug } =
    await readTenantRoutingHeaders();

  if (!tenantSlug) {
    return { ok: false, error: tenantSlugMissingError() };
  }

  const cookieSelection = await readWorkspaceSelectionCookies();

  return {
    ok: true,
    selection: {
      tenantSlug,
      companySlug:
        input?.selection?.companySlug ?? cookieSelection.companySlug ?? null,
      companyId: input?.selection?.companyId ?? null,
      organizationSlug:
        input?.selection?.organizationSlug ??
        (organizationSlugPathHint && organizationSlugPathHint.length > 0
          ? organizationSlugPathHint
          : null) ??
        cookieSelection.organizationSlug ??
        null,
      organizationId: input?.selection?.organizationId ?? null,
      projectId: input?.selection?.projectId ?? null,
      teamId: input?.selection?.teamId ?? null,
      surfaceId: input?.selection?.surfaceId ?? null,
      workflowId: input?.selection?.workflowId ?? null,
    },
  };
}
