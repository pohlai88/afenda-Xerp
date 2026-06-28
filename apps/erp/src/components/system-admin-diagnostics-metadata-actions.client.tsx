"use client";

import type { MetadataRenderableAction } from "@afenda/metadata-ui";
import { useCallback } from "react";

import { MetadataActionBarWithToast } from "@/components/metadata-action-bar-with-toast.client";
import {
  createSystemAdminDiagnosticsMetadataActionHandler,
  METADATA_SYSTEM_ADMIN_DIAGNOSTICS_ACTION_SOURCE,
} from "@/lib/metadata/metadata-system-admin-diagnostics.handler.client";

export interface SystemAdminDiagnosticsMetadataActionsProps {
  readonly actions: readonly MetadataRenderableAction[];
}

export function SystemAdminDiagnosticsMetadataActions({
  actions,
}: SystemAdminDiagnosticsMetadataActionsProps) {
  const handleAction = useCallback(
    createSystemAdminDiagnosticsMetadataActionHandler(),
    []
  );

  return (
    <MetadataActionBarWithToast
      actionSource={METADATA_SYSTEM_ADMIN_DIAGNOSTICS_ACTION_SOURCE}
      actions={actions}
      onAction={handleAction}
    />
  );
}
