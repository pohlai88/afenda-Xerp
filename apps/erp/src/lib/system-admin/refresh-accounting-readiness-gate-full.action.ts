"use server";

import { failServerAction } from "@/lib/server-actions/fail-server-action";
import { resolveActionOperatingContext } from "@/lib/server-actions/resolve-action-operating-context.server";
import type { ServerActionResult } from "@/lib/server-actions/server-action-result";

import {
  executeRefreshAccountingReadinessGateFull,
  REFRESH_ACCOUNTING_READINESS_GATE_ACTION,
  type RefreshAccountingReadinessGateFullData,
} from "./execute-refresh-accounting-readiness-gate-full.server";

export type { RefreshAccountingReadinessGateFullData };
export { REFRESH_ACCOUNTING_READINESS_GATE_ACTION };

export type RefreshAccountingReadinessGateFullActionState =
  ServerActionResult<RefreshAccountingReadinessGateFullData> | null;

export async function refreshAccountingReadinessGateFullAction(
  _prevState: RefreshAccountingReadinessGateFullActionState,
  _formData: FormData
): Promise<RefreshAccountingReadinessGateFullActionState> {
  const contextResult = await resolveActionOperatingContext();
  if (!contextResult.ok) {
    return failServerAction({
      action: REFRESH_ACCOUNTING_READINESS_GATE_ACTION,
      error: contextResult.error,
    });
  }

  return executeRefreshAccountingReadinessGateFull({
    operatingContext: contextResult.operatingContext,
  });
}
