"use server";

import { AppErrors } from "@afenda/kernel";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { failServerAction } from "@/lib/server-actions/fail-server-action";
import { parseProtectedActionInput } from "@/lib/server-actions/parse-protected-action-input";
import { recordActionAudit } from "@/lib/server-actions/record-action-audit";
import { resolveActionOperatingContext } from "@/lib/server-actions/resolve-action-operating-context.server";
import {
  type ServerActionResult,
  serverActionSuccess,
} from "@/lib/server-actions/server-action-result";

import { resolveMetadataAuthorizationFromOperatingContext } from "./resolve-metadata-authorization.server";

const REFRESH_METADATA_WORKSPACE_PREVIEW_ACTION =
  "metadata.workspace.preview.refresh" as const;

const METADATA_WORKSPACE_PREVIEW_PATH = "/metadata-workspace" as const;

const refreshMetadataWorkspacePreviewInputSchema = z.object({}).strict();

export interface RefreshMetadataWorkspacePreviewData {
  readonly refreshedAt: string;
}

export async function refreshMetadataWorkspacePreviewAction(
  input: unknown
): Promise<ServerActionResult<RefreshMetadataWorkspacePreviewData>> {
  const parsed = parseProtectedActionInput(
    refreshMetadataWorkspacePreviewInputSchema,
    input
  );
  if (!parsed.ok) {
    return failServerAction({
      action: REFRESH_METADATA_WORKSPACE_PREVIEW_ACTION,
      error: parsed.error,
    });
  }

  const contextResult = await resolveActionOperatingContext();
  if (!contextResult.ok) {
    return failServerAction({
      action: REFRESH_METADATA_WORKSPACE_PREVIEW_ACTION,
      error: contextResult.error,
    });
  }

  const authorization = await resolveMetadataAuthorizationFromOperatingContext({
    operatingContext: contextResult.operatingContext,
  });

  if (authorization.policyDecision.kind !== "allow") {
    return failServerAction({
      action: REFRESH_METADATA_WORKSPACE_PREVIEW_ACTION,
      error: AppErrors.forbidden(
        "You do not have permission to refresh this metadata workspace."
      ),
    });
  }

  const actorUserId = contextResult.operatingContext.actor.userId;
  const refreshedAt = new Date().toISOString();

  revalidatePath(METADATA_WORKSPACE_PREVIEW_PATH);

  await recordActionAudit({
    action: REFRESH_METADATA_WORKSPACE_PREVIEW_ACTION,
    actorUserId,
    module: "metadata.workspace",
    result: "success",
    targetId: contextResult.operatingContext.tenant.tenantId,
    targetType: "metadata_workspace_preview",
  });

  return serverActionSuccess({ refreshedAt });
}
