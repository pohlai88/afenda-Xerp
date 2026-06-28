"use client";

import type { MetadataRenderableAction } from "@afenda/metadata-ui";
import { useCallback } from "react";

import { MetadataActionBarWithToast } from "@/components/metadata-action-bar-with-toast.client";
import {
  createMetadataWorkspacePreviewActionHandler,
  METADATA_WORKSPACE_PREVIEW_ACTION_SOURCE,
} from "@/lib/metadata/metadata-workspace-preview.handler.client";

export interface MetadataWorkspacePreviewActionsProps {
  readonly actions: readonly MetadataRenderableAction[];
}

export function MetadataWorkspacePreviewActions({
  actions,
}: MetadataWorkspacePreviewActionsProps) {
  const handleAction = useCallback(
    createMetadataWorkspacePreviewActionHandler(),
    []
  );

  return (
    <MetadataActionBarWithToast
      actionSource={METADATA_WORKSPACE_PREVIEW_ACTION_SOURCE}
      actions={actions}
      onAction={handleAction}
    />
  );
}
