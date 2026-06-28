"use client";

import { AppErrors } from "@afenda/kernel";
import type { MetadataActionHandler } from "@afenda/metadata-ui";

import {
  appErrorToMetadataActionFailure,
  serverActionResultToMetadataActionResult,
} from "@/lib/metadata/metadata-action-result.adapter";
import { refreshMetadataWorkspacePreviewAction } from "@/lib/metadata/metadata-workspace-preview.action";

import { METADATA_WORKSPACE_PREVIEW_SURFACE_ID } from "./metadata-workspace-preview.contract";

export function createMetadataWorkspacePreviewActionHandler(): MetadataActionHandler {
  return async (action, _context) => {
    if (action.key === "refresh-workspace-preview") {
      const result = await refreshMetadataWorkspacePreviewAction({});
      return serverActionResultToMetadataActionResult(
        action.key,
        result,
        "Metadata workspace refreshed."
      );
    }

    if (action.key === "open-workspace-home") {
      return appErrorToMetadataActionFailure(
        action.key,
        AppErrors.notFound("Action")
      );
    }

    return appErrorToMetadataActionFailure(
      action.key,
      AppErrors.notFound("Action")
    );
  };
}

export const METADATA_WORKSPACE_PREVIEW_ACTION_SOURCE =
  METADATA_WORKSPACE_PREVIEW_SURFACE_ID;

export type MetadataWorkspacePreviewActionContext = {
  readonly source: typeof METADATA_WORKSPACE_PREVIEW_ACTION_SOURCE;
};
