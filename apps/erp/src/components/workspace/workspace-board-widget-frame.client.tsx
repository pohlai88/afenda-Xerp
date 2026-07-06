"use client";

import { GripVerticalIcon } from "lucide-react";
import { useCallback, useState, type ReactNode } from "react";

export const WORKSPACE_BOARD_DRAG_HANDLE_CLASS = "workspace-board-drag-handle";

export interface WorkspaceBoardWidgetFrameProps {
  readonly children: ReactNode;
  readonly editable: boolean;
  readonly title: string;
  readonly widgetKey: string;
}

export function WorkspaceBoardWidgetFrame({
  children,
  editable,
  title,
  widgetKey,
}: WorkspaceBoardWidgetFrameProps) {
  const [isGrabbed, setIsGrabbed] = useState(false);

  const handleBlur = useCallback(() => {
    setIsGrabbed(false);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!editable) {
        return;
      }

      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        setIsGrabbed((current) => !current);
      }

      if (event.key === "Escape") {
        setIsGrabbed(false);
      }
    },
    [editable]
  );

  return (
    <article
      aria-label={title}
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border bg-card shadow-sm"
      data-workspace-board-widget={widgetKey}
    >
      {editable ? (
        <div
          aria-grabbed={isGrabbed}
          aria-keyshortcuts="Space Enter"
          aria-label={`Drag handle for ${title}`}
          className={`${WORKSPACE_BOARD_DRAG_HANDLE_CLASS} flex cursor-grab items-center gap-2 border-b bg-muted/40 px-3 py-1.5 text-muted-foreground text-xs active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onMouseDown={() => {
            setIsGrabbed(true);
          }}
          onMouseUp={() => {
            setIsGrabbed(false);
          }}
          role="button"
          tabIndex={0}
        >
          <GripVerticalIcon aria-hidden className="size-3.5 shrink-0" />
          <span className="truncate font-medium">{title}</span>
        </div>
      ) : (
        <header className="border-b px-3 py-1.5">
          <span className="font-medium text-muted-foreground text-xs">{title}</span>
        </header>
      )}
      <div className="min-h-0 flex-1 overflow-auto p-3">{children}</div>
    </article>
  );
}
