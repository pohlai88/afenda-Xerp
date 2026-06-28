"use client";

import type { MetadataActionResult } from "@afenda/metadata-ui";
import { toast } from "sonner";

/** Surfaces metadata action handler outcomes through governed Sonner toasts. */
export function notifyMetadataActionResult(result: MetadataActionResult): void {
  if (result.ok) {
    toast.success(result.message ?? "Action completed.");
    return;
  }

  toast.error(result.userMessage);
}
