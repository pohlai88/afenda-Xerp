/** T3 compound primitive — @dnd-kit board mechanics; slots + class SSOT. */
export const PRIMITIVE_CONTRACT_VERSION = "1.2.0" as const;

export const KANBAN_PRIMITIVE_ID = "shadcn-studio.ui.kanban" as const;
export type KanbanPrimitiveId = typeof KANBAN_PRIMITIVE_ID;

export const KANBAN_SLOTS = {
  root: "kanban",
  board: "kanban-board",
  column: "kanban-column",
  columnHandle: "kanban-column-handle",
  columnContent: "kanban-column-content",
  item: "kanban-item",
  itemHandle: "kanban-item-handle",
  addColumn: "kanban-add-column",
  addItem: "kanban-add-item",
} as const;

export type KanbanSlotMap = typeof KANBAN_SLOTS;
export type KanbanSlot = KanbanSlotMap[keyof KanbanSlotMap];

export const kanbanRootDraggingClassName = "cursor-grabbing!" as const;

export const kanbanBoardClassName = "flex gap-4 p-2" as const;

export const kanbanColumnClassName =
  "group/kanban-column flex flex-col" as const;

export const kanbanColumnDraggingClassName = "z-50 opacity-50" as const;

export const kanbanColumnDisabledClassName = "opacity-50" as const;

export const kanbanColumnHandleClassName =
  "opacity-0 transition-opacity group-hover/kanban-column:opacity-100" as const;

export const kanbanColumnHandleCursorClassName = "cursor-grab!" as const;

export const kanbanColumnHandleDraggingCursorClassName =
  "cursor-grabbing!" as const;

export const kanbanItemDraggingClassName = "z-50 opacity-50" as const;

export const kanbanItemDisabledClassName = "opacity-50" as const;

export const kanbanItemHandleCursorClassName = "cursor-grab!" as const;

export const kanbanItemHandleDraggingCursorClassName =
  "cursor-grabbing!" as const;

export const kanbanOverlayClassName = "z-50" as const;

export const kanbanOverlayDraggingClassName = "cursor-grabbing" as const;

export const kanbanAddColumnTriggerClassName =
  "flex h-9 w-64 shrink-0 items-center gap-2 rounded-lg border border-dashed border-border bg-transparent px-3 text-sm text-muted-foreground transition-colors hover:border-border/80 hover:bg-muted/50 hover:text-foreground" as const;

export const kanbanAddColumnCardClassName =
  "h-fit shrink-0 bg-muted py-4" as const;

export const kanbanAddItemTriggerClassName =
  "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" as const;

export const kanbanAddItemFormClassName = "flex flex-col gap-2" as const;

export function kanbanPrimitiveMetadata() {
  return {
    id: KANBAN_PRIMITIVE_ID,
    version: PRIMITIVE_CONTRACT_VERSION,
    slots: KANBAN_SLOTS,
  } as const;
}
