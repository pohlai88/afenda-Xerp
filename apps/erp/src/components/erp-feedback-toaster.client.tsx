"use client";

import { Toaster } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

export type ErpFeedbackToasterGovernedComponents = Extract<
  GovernedUiComponentName,
  "Toaster"
>;

/** Global ERP toast host — pairs with `notifyMetadataActionResult` and Sonner callers. */
export function ErpFeedbackToaster() {
  return <Toaster closeButton position="top-right" richColors />;
}
