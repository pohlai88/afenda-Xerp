import type {
  OperatingContextError,
  OperatingContextSelection,
} from "@afenda/kernel";
import { headers } from "next/headers";
import { parseActiveWorkspaceId } from "./active-workspace-id.contract";
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
function mergeSessionWorkspaceIdHints(input: {
  readonly activeWorkspaceId: string | null | undefined;
  readonly companyId: string | null;
  readonly companySlug: string | null;
  readonly organizationId: string | null;
  readonly organizationSlug: string | null;
}): {
  readonly companyId: string | null;
  readonly organizationId: string | null;
} {
  const sessionHint = parseActiveWorkspaceId(input.activeWorkspaceId);
  if (!sessionHint) {
    return {
      companyId: input.companyId,
      organizationId: input.organizationId,
    };
  }

  return {
    companyId:
      input.companyId ??
      (input.companySlug === null ? sessionHint.companyId : null),
    organizationId:
      input.organizationId ??
      (input.organizationSlug === null ? sessionHint.organizationId : null),
  };
}

export async function buildOperatingContextSelectionFromRequest(input?: {
  readonly activeWorkspaceId?: string | null;
  readonly selection?: Partial<Omit<OperatingContextSelection, "tenantSlug">>;
}): Promise<BuildOperatingContextSelectionResult> {
  const { organizationSlugPathHint, tenantSlug } =
    await readTenantRoutingHeaders();

  if (!tenantSlug) {
    return { ok: false, error: tenantSlugMissingError() };
  }

  const cookieSelection = await readWorkspaceSelectionCookies();
  const companySlug =
    input?.selection?.companySlug ?? cookieSelection.companySlug ?? null;
  const organizationSlug =
    input?.selection?.organizationSlug ??
    (organizationSlugPathHint && organizationSlugPathHint.length > 0
      ? organizationSlugPathHint
      : null) ??
    cookieSelection.organizationSlug ??
    null;
  const mergedIds = mergeSessionWorkspaceIdHints({
    activeWorkspaceId: input?.activeWorkspaceId,
    companySlug,
    companyId: input?.selection?.companyId ?? null,
    organizationSlug,
    organizationId: input?.selection?.organizationId ?? null,
  });

  return {
    ok: true,
    selection: {
      tenantSlug,
      companySlug,
      companyId: mergedIds.companyId,
      organizationSlug,
      organizationId: mergedIds.organizationId,
      projectId: input?.selection?.projectId ?? null,
      teamId: input?.selection?.teamId ?? null,
      surfaceId: input?.selection?.surfaceId ?? null,
      workflowId: input?.selection?.workflowId ?? null,
    },
  };
}
