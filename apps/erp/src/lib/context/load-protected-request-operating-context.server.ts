import { type AfendaAuthSession, getAfendaAuthSession } from "@afenda/auth";
import type { OperatingContextResult } from "@afenda/kernel";
import { headers } from "next/headers";
import { cache } from "react";

import { resolveOperatingContext } from "./resolve-operating-context.server";

export interface ProtectedRequestOperatingContextBundle {
  readonly operatingResult: OperatingContextResult;
  readonly requestHeaders: Headers;
  readonly session: AfendaAuthSession | null;
}

/**
 * PAS-001A INV-001 — request-scoped protected RSC operating context assembly.
 *
 * Protected layout and nested pages MUST use this entry so IS-002 assembly runs once
 * per request (React `cache` deduplication).
 */
async function loadProtectedRequestOperatingContextUncached(): Promise<ProtectedRequestOperatingContextBundle> {
  const requestHeaders = await headers();
  const session = await getAfendaAuthSession(requestHeaders);
  const operatingResult = await resolveOperatingContext(
    session === null ? { requestHeaders } : { requestHeaders, session }
  );

  return { requestHeaders, session, operatingResult };
}

export const loadProtectedRequestOperatingContext = cache(
  loadProtectedRequestOperatingContextUncached
);
