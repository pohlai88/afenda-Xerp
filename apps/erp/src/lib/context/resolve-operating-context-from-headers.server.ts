import { getAfendaAuthSession } from "@afenda/auth";
import {
  err,
  type OperatingContextError,
  type OperatingContextResult,
} from "@afenda/kernel";

import { buildOperatingContextFromDatabaseSession } from "./build-operating-context-from-database.server";

export interface ResolveOperatingContextFromHeadersInput {
  readonly requestHeaders: Headers;
}

/** Resolves ERP operating context from request headers (PAS-001A IS-003 metadata bridge). */
export async function resolveOperatingContextFromHeaders(
  input: ResolveOperatingContextFromHeadersInput
): Promise<OperatingContextResult> {
  const session = await getAfendaAuthSession(input.requestHeaders);

  if (session === null) {
    return err({
      code: "MEMBERSHIP_DENIED",
      userMessage:
        "Authentication is required for protected metadata surfaces.",
    } satisfies OperatingContextError);
  }

  return buildOperatingContextFromDatabaseSession(session);
}
