import type { AfendaAuthSession } from "@afenda/auth";
import {
  brandPermissionScopeContextFromUnknownWire,
  err,
  type OperatingContextError,
  type OperatingContextResult,
} from "@afenda/kernel";

import { buildOperatingContextFromDatabaseSession } from "./build-operating-context-from-database.server";
import { resolveOperatingContextFromHeaders } from "./resolve-operating-context-from-headers.server";

export interface ResolveOperatingContextInput {
  readonly requestHeaders?: Headers;
  readonly session?: AfendaAuthSession;
}

/**
 * Canonical IS-002 operating context assembly entry (PAS-001A R1a).
 * Delegates to header ingress or database session build — no forked scope models.
 */
export async function resolveOperatingContext(
  input: ResolveOperatingContextInput
): Promise<OperatingContextResult> {
  if (input.session !== undefined) {
    return buildOperatingContextFromDatabaseSession(input.session);
  }

  if (input.requestHeaders !== undefined) {
    return resolveOperatingContextFromHeaders({
      requestHeaders: input.requestHeaders,
    });
  }

  return err({
    code: "MEMBERSHIP_DENIED",
    userMessage:
      "Operating context resolution requires request headers or an auth session.",
  } satisfies OperatingContextError);
}

/** IS-001 grant-scope kernel projection — consumed by full assembly path in R1c. */
export { brandPermissionScopeContextFromUnknownWire };
