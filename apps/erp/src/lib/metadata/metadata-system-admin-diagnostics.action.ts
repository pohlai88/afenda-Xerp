"use server";

import { z } from "zod";

import { failServerAction } from "@/lib/server-actions/fail-server-action";
import { parseProtectedActionInput } from "@/lib/server-actions/parse-protected-action-input";
import { resolveActionOperatingContext } from "@/lib/server-actions/resolve-action-operating-context.server";
import type { ServerActionResult } from "@/lib/server-actions/server-action-result";
import {
  executeRefreshAccountingReadinessGateFull,
  type RefreshAccountingReadinessGateFullData,
} from "@/lib/system-admin/execute-refresh-accounting-readiness-gate-full.server";

const REFRESH_SYSTEM_ADMIN_DIAGNOSTICS_METADATA_ACTION =
  "system_admin.diagnostics.metadata.refresh_readiness_gate" as const;

const refreshSystemAdminDiagnosticsMetadataInputSchema = z.object({}).strict();

export async function refreshSystemAdminDiagnosticsMetadataAction(
  input: unknown
): Promise<ServerActionResult<RefreshAccountingReadinessGateFullData>> {
  const parsed = parseProtectedActionInput(
    refreshSystemAdminDiagnosticsMetadataInputSchema,
    input
  );
  if (!parsed.ok) {
    return failServerAction({
      action: REFRESH_SYSTEM_ADMIN_DIAGNOSTICS_METADATA_ACTION,
      error: parsed.error,
    });
  }

  const contextResult = await resolveActionOperatingContext();
  if (!contextResult.ok) {
    return failServerAction({
      action: REFRESH_SYSTEM_ADMIN_DIAGNOSTICS_METADATA_ACTION,
      error: contextResult.error,
    });
  }

  return executeRefreshAccountingReadinessGateFull({
    operatingContext: contextResult.operatingContext,
  });
}
