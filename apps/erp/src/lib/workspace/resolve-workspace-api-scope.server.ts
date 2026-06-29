import { getAfendaAuthSession } from "@afenda/auth";
import type { OperatingContextError } from "@afenda/kernel";
import { headers } from "next/headers";

import { resolveOperatingContext } from "@/lib/context/resolve-operating-context.server";

import { toWorkspaceApiScope } from "./to-workspace-api-scope";
import type { WorkspaceApiScope } from "./workspace-api-scope.contract";

export async function resolveWorkspaceApiScopeFromHeaders(): Promise<
  | { readonly ok: true; readonly value: WorkspaceApiScope }
  | { readonly ok: false; readonly error: OperatingContextError }
> {
  const requestHeaders = await headers();
  const session = await getAfendaAuthSession(requestHeaders);
  const result = await resolveOperatingContext(
    session === null ? { requestHeaders } : { requestHeaders, session }
  );

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  return { ok: true, value: toWorkspaceApiScope(result.value) };
}
