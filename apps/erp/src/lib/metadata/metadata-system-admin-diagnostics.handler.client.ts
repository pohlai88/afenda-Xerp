"use client";

import { AppErrors } from "@afenda/kernel";
import type { MetadataActionHandler } from "@afenda/metadata-ui";

import {
  appErrorToMetadataActionFailure,
  serverActionFailureToMetadataActionResult,
} from "@/lib/metadata/metadata-action-result.adapter";
import { refreshSystemAdminDiagnosticsMetadataAction } from "@/lib/metadata/metadata-system-admin-diagnostics.action";

import { METADATA_SYSTEM_ADMIN_DIAGNOSTICS_SURFACE_ID } from "./metadata-system-admin-diagnostics.contract";

export function createSystemAdminDiagnosticsMetadataActionHandler(): MetadataActionHandler {
  return async (action, _context) => {
    if (action.key !== "refresh-readiness-gate") {
      return appErrorToMetadataActionFailure(
        action.key,
        AppErrors.notFound("Action")
      );
    }

    const result = await refreshSystemAdminDiagnosticsMetadataAction({});

    if (result.ok) {
      return {
        ok: true,
        actionKey: action.key,
        message: `Full delegated gate check completed (${result.data.checkedAt}).`,
      };
    }

    return serverActionFailureToMetadataActionResult(action.key, result);
  };
}

export const METADATA_SYSTEM_ADMIN_DIAGNOSTICS_ACTION_SOURCE =
  METADATA_SYSTEM_ADMIN_DIAGNOSTICS_SURFACE_ID;

export type SystemAdminDiagnosticsMetadataActionContext = {
  readonly source: typeof METADATA_SYSTEM_ADMIN_DIAGNOSTICS_ACTION_SOURCE;
};
