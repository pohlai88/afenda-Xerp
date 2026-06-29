import type { OperatingContext } from "@afenda/kernel";

export type GuardModuleRouteDenialReason = "MODULE_NOT_FOUND" | "ACCESS_DENIED";

export type GuardModuleRouteResult =
  | { readonly ok: true; readonly operatingContext: OperatingContext }
  | { readonly ok: false; readonly reason: GuardModuleRouteDenialReason };

export interface GuardModuleRouteInput {
  readonly moduleId: string;
  readonly operatingContext: OperatingContext;
}

/**
 * Stub module route guard — full manifest enforcement lands with module tree (R1c+).
 * Consumes spine output only; does not resolve tenant scope locally.
 */
export async function guardModuleRoute(
  input: GuardModuleRouteInput
): Promise<GuardModuleRouteResult> {
  const moduleId = input.moduleId.trim();

  if (moduleId.length === 0) {
    return { ok: false, reason: "MODULE_NOT_FOUND" };
  }

  return {
    ok: true,
    operatingContext: input.operatingContext,
  };
}
