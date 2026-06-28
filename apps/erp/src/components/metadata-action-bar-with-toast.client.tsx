"use client";

import type {
  MetadataActionHandler,
  MetadataActionResultHandler,
  MetadataRenderableAction,
} from "@afenda/metadata-ui";
import { MetadataActionBar } from "@afenda/metadata-ui/client";
import { useCallback } from "react";

import { notifyMetadataActionResult } from "@/lib/metadata/metadata-action-result-toast.client";

export interface MetadataActionBarWithToastProps {
  readonly actionSource: string;
  readonly actions: readonly MetadataRenderableAction[];
  readonly onAction: MetadataActionHandler;
}

export function MetadataActionBarWithToast({
  actionSource,
  actions,
  onAction,
}: MetadataActionBarWithToastProps) {
  const handleActionResult: MetadataActionResultHandler = useCallback(
    (result) => {
      notifyMetadataActionResult(result);
    },
    []
  );

  if (actions.length === 0) {
    return null;
  }

  return (
    <MetadataActionBar
      actions={actions}
      onAction={(action) => onAction(action, { source: actionSource })}
      onActionResult={handleActionResult}
    />
  );
}
