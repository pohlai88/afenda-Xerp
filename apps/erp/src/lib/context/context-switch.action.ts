"use server";

import { AUTH_EVENT, persistAuthSessionActiveWorkspaceId } from "@afenda/auth";

import { formatActiveWorkspaceId } from "@/lib/context/active-workspace-id.contract";
import { operatingContextSelectionHintsSchema } from "@/lib/context/operating-context-selection.schema";
import { toApplicationShellOperatingContext } from "@/lib/context/to-shell-operating-context";
import { persistWorkspaceSelectionCookies } from "@/lib/context/workspace-selection-cookies.server";
import { failServerAction } from "@/lib/server-actions/fail-server-action";
import { parseProtectedActionInput } from "@/lib/server-actions/parse-protected-action-input";
import { recordActionAudit } from "@/lib/server-actions/record-action-audit";
import { resolveActionOperatingContext } from "@/lib/server-actions/resolve-action-operating-context.server";
import {
  type ServerActionResult,
  serverActionSuccess,
} from "@/lib/server-actions/server-action-result";

export interface SwitchOperatingContextInput {
  readonly companySlug?: string;
  readonly organizationSlug?: string;
}

export interface SwitchOperatingContextData {
  readonly operatingContext: ReturnType<
    typeof toApplicationShellOperatingContext
  >;
  readonly workspace: {
    readonly companyId: string;
    readonly organizationId: string | null;
    readonly projectId: string | null;
    readonly tenantId: string;
  };
}

export async function switchOperatingContextAction(
  input: unknown
): Promise<ServerActionResult<SwitchOperatingContextData>> {
  const parsed = parseProtectedActionInput(
    operatingContextSelectionHintsSchema,
    input
  );
  if (!parsed.ok) {
    return failServerAction({
      action: "workspace.context.switch",
      error: parsed.error,
    });
  }

  const contextResult = await resolveActionOperatingContext({
    selection: {
      companySlug: parsed.value.companySlug ?? null,
      organizationSlug: parsed.value.organizationSlug ?? null,
    },
  });

  if (!contextResult.ok) {
    return failServerAction({
      action: "workspace.context.switch",
      error: contextResult.error,
    });
  }

  const { operatingContext, session } = contextResult;
  const actorUserId = operatingContext.actor.userId.trim();

  await persistWorkspaceSelectionCookies({
    companySlug: parsed.value.companySlug ?? null,
    organizationSlug: parsed.value.organizationSlug ?? null,
  });

  const organizationId =
    operatingContext.organizationUnit?.organizationUnitId ??
    operatingContext.workspace.organizationId;

  await persistAuthSessionActiveWorkspaceId({
    sessionId: session.sessionId,
    activeWorkspaceId: formatActiveWorkspaceId({
      tenantId: operatingContext.tenant.tenantId,
      companyId: operatingContext.legalEntity.companyId,
      organizationId,
    }),
  });

  await recordActionAudit({
    action: AUTH_EVENT.workspaceContextSwitched,
    actorUserId,
    module: "erp.workspace",
    result: "success",
    targetId: operatingContext.workspace.companyId,
    targetType: "operating_context",
  });

  return serverActionSuccess({
    operatingContext: toApplicationShellOperatingContext(operatingContext),
    workspace: operatingContext.workspace,
  });
}
