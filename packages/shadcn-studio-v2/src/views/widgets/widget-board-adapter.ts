import { cn } from "../../lib/cn";
import type { WorkspaceBoardWidgetLayout } from "../../types/views";

export function workspaceBoardWidgetAdapterClassName({
  className,
}: {
  readonly className?: string | undefined;
} = {}): string {
  return cn("flex h-full min-h-0 min-w-0 flex-col", className);
}

export function serializeWorkspaceBoardLayout(
  layout: WorkspaceBoardWidgetLayout | undefined
): string | undefined {
  if (layout == null) {
    return;
  }

  return `${layout.x},${layout.y},${layout.w},${layout.h}`;
}
