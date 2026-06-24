import type { ModulePlaceholderCopy } from "@/lib/modules/module-placeholder.copy.contract";
import {
  MODULE_PLACEHOLDER_ACCOUNTING_TEMPLATE,
  MODULE_PLACEHOLDER_STANDARD_TEMPLATE,
} from "@/lib/modules/module-placeholder.copy.contract";

export type ModulePlaceholderCopyInput =
  | { readonly label: string; readonly moduleId: "accounting" }
  | { readonly label: string; readonly moduleId: string };

export function resolveModulePlaceholderCopy(
  input: ModulePlaceholderCopyInput
): ModulePlaceholderCopy {
  if (input.moduleId === "accounting") {
    return {
      ...MODULE_PLACEHOLDER_ACCOUNTING_TEMPLATE,
      emptyStateTitle: input.label,
    };
  }

  return {
    ...MODULE_PLACEHOLDER_STANDARD_TEMPLATE,
    emptyStateTitle: input.label,
  };
}
