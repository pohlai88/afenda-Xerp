"use server";

import { operatingContextSelectionHintsSchema } from "@/lib/context/operating-context-selection.schema";
import { toApplicationShellOperatingContext } from "@/lib/context/to-shell-operating-context";
import { persistWorkspaceSelectionCookies } from "@/lib/context/workspace-selection-cookies.server";
import { failServerAction } from "@/lib/server-actions/fail-server-action";
import { parseProtectedActionInput } from "@/lib/server-actions/parse-protected-action-input";
import { resolveActionOperatingContext } from "@/lib/server-actions/resolve-action-operating-context.server";
import {
  type ServerActionResult,
  serverActionSuccess,
} from "@/lib/server-actions/server-action-result";

export type SwitchOperatingContextInput = {
  readonly companySlug?: string;
  readonly organizationSlug?: string;
};

export type SwitchOperatingContextData = {
  readonly operatingContext: ReturnType<
    typeof toApplicationShellOperatingContext
  >;
  readonly workspace: {
    readonly companyId: string;
    readonly organizationId: string | null;
    readonly projectId: string | null;
    readonly tenantId: string;
  };
};

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

  const { operatingContext } = contextResult;

  await persistWorkspaceSelectionCookies({
    companySlug: parsed.value.companySlug ?? null,
    organizationSlug: parsed.value.organizationSlug ?? null,
  });

  return serverActionSuccess({
    operatingContext: toApplicationShellOperatingContext(operatingContext),
    workspace: operatingContext.workspace,
  });
}
