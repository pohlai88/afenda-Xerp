"use server";

import { AppErrors } from "@afenda/kernel";
import { revalidatePath } from "next/cache";

import { failServerAction } from "@/lib/server-actions/fail-server-action";
import { recordActionAudit } from "@/lib/server-actions/record-action-audit";
import { resolveActionOperatingContext } from "@/lib/server-actions/resolve-action-operating-context.server";
import {
  type ServerActionResult,
  serverActionSuccess,
} from "@/lib/server-actions/server-action-result";

import { ACCOUNTING_READINESS_GATE_REFRESH_FAILURE_MESSAGE } from "./accounting-readiness-gate.copy.contract";
import { guardSystemAdminSection } from "./guard-system-admin-section.server";
import {
  primeAccountingReadinessGateLiveStatusCache,
  resetAccountingReadinessGateLiveStatusCache,
} from "./resolve-accounting-readiness-gate-status.server";
import { spawnAccountingReadinessGateLiveStatus } from "./spawn-accounting-readiness-gate-live-status.server";
import { SYSTEM_ADMIN_MUTATION_AUDIT_MODULE } from "./system-admin-mutation-audit.registry";

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
  const contextResult = await resolveActionOperatingContext();
  if (!contextResult.ok) {
    return failServerAction({
      action: REFRESH_ACCOUNTING_READINESS_GATE_ACTION,
      error: contextResult.error,
    });
  }

  const guardResult = await guardSystemAdminSection({
    sectionId: "diagnostics",
    operatingContext: contextResult.operatingContext,
    correlationId: contextResult.operatingContext.correlationId,
  });

  if (guardResult.kind !== "allowed") {
    return failServerAction({
      action: REFRESH_ACCOUNTING_READINESS_GATE_ACTION,
      error: AppErrors.forbidden(
        ACCOUNTING_READINESS_GATE_REFRESH_FAILURE_MESSAGE
      ),
    });
  }

  const actorUserId = contextResult.operatingContext.actor.userId;

  try {
    resetAccountingReadinessGateLiveStatusCache();
    const snapshot = spawnAccountingReadinessGateLiveStatus({
      runDelegatedGates: true,
    });
    primeAccountingReadinessGateLiveStatusCache(snapshot);
    revalidatePath("/system-admin/diagnostics");

    await recordActionAudit({
      action: REFRESH_ACCOUNTING_READINESS_GATE_ACTION,
      actorUserId,
      module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
      result: "success",
      targetId: snapshot.checkedAt,
      targetType: "accounting_readiness_gate",
    });

    return serverActionSuccess({
      checkedAt: snapshot.checkedAt,
      runMode: "full",
    });
  } catch {
    await recordActionAudit({
      action: REFRESH_ACCOUNTING_READINESS_GATE_ACTION,
      actorUserId,
      module: SYSTEM_ADMIN_MUTATION_AUDIT_MODULE,
      result: "failure",
      targetType: "accounting_readiness_gate",
    });

    return failServerAction({
      action: REFRESH_ACCOUNTING_READINESS_GATE_ACTION,
      error: AppErrors.internal(
        ACCOUNTING_READINESS_GATE_REFRESH_FAILURE_MESSAGE
      ),
    });
  }
}
