import { ErpEmptyState } from "@/components/erp-empty-state";
import type { ModulePlaceholderCopy } from "@/lib/modules/module-placeholder.copy.contract";

interface ModulePlaceholderEmptyStateProps {
  readonly copy: ModulePlaceholderCopy;
}

export function ModulePlaceholderEmptyState({
  copy,
}: ModulePlaceholderEmptyStateProps) {
  return (
    <ErpEmptyState
      description={copy.domainBody}
      iconKey={copy.variant === "accounting" ? "accounting" : "module"}
      surfaceVariant={copy.variant}
      title={copy.emptyStateTitle}
      variant="static"
    />
  );
}
