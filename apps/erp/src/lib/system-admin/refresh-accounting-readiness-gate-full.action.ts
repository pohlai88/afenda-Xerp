"use server";

import { AppErrors } from "@afenda/kernel";
import { revalidatePath } from "next/cache";

import { failServerAction } from "@/lib/server-actions/fail-server-action";
import {
  type ServerActionResult,
  serverActionSuccess,
} from "@/lib/server-actions/server-action-result";

import { ACCOUNTING_READINESS_GATE_REFRESH_FAILURE_MESSAGE } from "./accounting-readiness-gate.copy.contract";
import {
  primeAccountingReadinessGateLiveStatusCache,
  resetAccountingReadinessGateLiveStatusCache,
} from "./resolve-accounting-readiness-gate-status.server";
import { resolveSystemAdminSectionAccess } from "./resolve-system-admin-section-access.server";
import { spawnAccountingReadinessGateLiveStatus } from "./spawn-accounting-readiness-gate-live-status.server";

const REFRESH_ACCOUNTING_READINESS_GATE_ACTION =
  "system_admin.diagnostics.refresh_readiness_gate_full" as const;

export interface RefreshAccountingReadinessGateFullData {
  readonly checkedAt: string;
  readonly runMode: "full";
}

export type RefreshAccountingReadinessGateFullActionState =
  ServerActionResult<RefreshAccountingReadinessGateFullData> | null;

export async function refreshAccountingReadinessGateFullAction(
  _prevState: RefreshAccountingReadinessGateFullActionState,
  _formData: FormData
): Promise<RefreshAccountingReadinessGateFullActionState> {
  const access = await resolveSystemAdminSectionAccess("diagnostics");

  if (access.kind !== "allowed") {
    return failServerAction({
      action: REFRESH_ACCOUNTING_READINESS_GATE_ACTION,
      error: AppErrors.forbidden(
        ACCOUNTING_READINESS_GATE_REFRESH_FAILURE_MESSAGE
      ),
    });
  }

  try {
    resetAccountingReadinessGateLiveStatusCache();
    const snapshot = spawnAccountingReadinessGateLiveStatus({
      runDelegatedGates: true,
    });
    primeAccountingReadinessGateLiveStatusCache(snapshot);
    revalidatePath("/system-admin/diagnostics");

    return serverActionSuccess({
      checkedAt: snapshot.checkedAt,
      runMode: "full",
    });
  } catch {
    return failServerAction({
      action: REFRESH_ACCOUNTING_READINESS_GATE_ACTION,
      error: AppErrors.internal(
        ACCOUNTING_READINESS_GATE_REFRESH_FAILURE_MESSAGE
      ),
    });
  }
}
