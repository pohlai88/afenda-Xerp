"use client";

import type {
  MetadataActionResultHandler,
  MetadataRenderableAction,
} from "@afenda/metadata-ui";
import { MetadataActionBar } from "@afenda/metadata-ui/client";
import { useCallback, useState } from "react";

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
  const [lastResultMessage, setLastResultMessage] = useState<string | null>(
    null
  );
  const handleAction = useCallback(
    createMetadataWorkspacePreviewActionHandler(),
    []
  );

  const handleActionResult: MetadataActionResultHandler = useCallback(
    (result) => {
      if (result.ok) {
        setLastResultMessage(result.message ?? "Action completed.");
        return;
      }

      setLastResultMessage(result.userMessage);
    },
    []
  );

  if (actions.length === 0) {
    return null;
  }

  return (
    <>
      <MetadataActionBar
        actions={actions}
        onAction={(action) =>
          handleAction(action, {
            source: METADATA_WORKSPACE_PREVIEW_ACTION_SOURCE,
          })
        }
        onActionResult={handleActionResult}
      />
      {lastResultMessage ? (
        <p
          aria-live="polite"
          className="erp-metadata-action-feedback"
          role="status"
        >
          {lastResultMessage}
        </p>
      ) : null}
    </>
  );
}
