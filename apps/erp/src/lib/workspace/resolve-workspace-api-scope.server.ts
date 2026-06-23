import type {
  OperatingContextError,
  OperatingContextSelection,
} from "@afenda/kernel";

import { resolveOperatingContextFromHeaders } from "@/lib/context/resolve-operating-context-from-headers.server";

import { toWorkspaceApiScope } from "./to-workspace-api-scope";
import type { WorkspaceApiScope } from "./workspace-api-scope.contract";

export async function resolveWorkspaceApiScopeFromHeaders(input: {
  readonly actorUserId: string;
  readonly selection?: Partial<Omit<OperatingContextSelection, "tenantSlug">>;
}): Promise<
  | { readonly ok: true; readonly value: WorkspaceApiScope }
  | { readonly ok: false; readonly error: OperatingContextError }
> {
  const result = await resolveOperatingContextFromHeaders({
    actorUserId: input.actorUserId,
    ...(input.selection === undefined ? {} : { selection: input.selection }),
  });

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  return { ok: true, value: toWorkspaceApiScope(result.value) };
}
