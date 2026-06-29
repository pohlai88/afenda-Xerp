import { getAfendaAuthSession } from "@afenda/auth";
import type { OperatingContextResult } from "@afenda/kernel";

import { resolveOperatingContext } from "@/lib/context/resolve-operating-context.server";

export interface ResolveApiRouteOperatingContextInput {
  readonly requestHeaders: Headers;
}

/**
 * Minimal protected API operating-context resolver — delegates to IS-002 spine (R1a).
 */
export async function resolveApiRouteOperatingContext(
  input: ResolveApiRouteOperatingContextInput
): Promise<OperatingContextResult> {
  const session = await getAfendaAuthSession(input.requestHeaders);

  return resolveOperatingContext({
    requestHeaders: input.requestHeaders,
    ...(session === null ? {} : { session }),
  });
}
