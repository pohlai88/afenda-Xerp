"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type {
  CollisionDetection,
  DragEndEvent,
  DraggableAttributes,
  DraggableSyntheticListeners,
  DragOverEvent,
  DragStartEvent,
  DropAnimation,
  Modifiers,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
  KeyboardSensor,
  MeasuringStrategy,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  type AnimateLayoutChanges,
  arrayMove,
  defaultAnimateLayoutChanges,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PlusIcon } from "lucide-react";
import * as React from "react";
import {
  type CSSProperties,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/utils/utils";

import {
  KANBAN_SLOTS,
  kanbanAddColumnCardClassName,
  kanbanAddColumnTriggerClassName,
  kanbanAddItemFormClassName,
  kanbanAddItemTriggerClassName,
  kanbanBoardClassName,
  kanbanColumnClassName,
  kanbanColumnDisabledClassName,
  kanbanColumnDraggingClassName,
  kanbanColumnHandleClassName,
  kanbanColumnHandleCursorClassName,
  kanbanColumnHandleDraggingCursorClassName,
  kanbanItemDisabledClassName,
  kanbanItemDraggingClassName,
  kanbanItemHandleCursorClassName,
  kanbanItemHandleDraggingCursorClassName,
  kanbanOverlayClassName,
  kanbanOverlayDraggingClassName,
  kanbanRootDraggingClassName,
} from "./kanban.contract.js";

interface KanbanContextProps<T> {
  activeId: UniqueIdentifier | null;
  columnIds: string[];
  columns: Record<string, T[]>;
  findContainer: (id: UniqueIdentifier) => string | undefined;
  getItemId: (item: T) => string;
  isColumn: (id: UniqueIdentifier) => boolean;
  modifiers?: Modifiers;
  setActiveId: (id: UniqueIdentifier | null) => void;
  setColumns: (columns: Record<string, T[]>) => void;
}

const KanbanContext = createContext<KanbanContextProps<unknown> | null>(null);

const ColumnContext = createContext<{
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners | undefined;
  isDragging?: boolean;
  disabled?: boolean;
}>({
  attributes: {} as DraggableAttributes,
  listeners: undefined,
  isDragging: false,
  disabled: false,
});

const ItemContext = createContext<{
  listeners: DraggableSyntheticListeners | undefined;
  isDragging?: boolean;
  disabled?: boolean;
}>({
  listeners: undefined,
  isDragging: false,
  disabled: false,
});

const IsOverlayContext = createContext(false);

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

export interface KanbanMoveEvent {
  activeContainer: string;
  activeIndex: number;
  event: DragEndEvent;
  overContainer: string;
  overIndex: number;
}

export type KanbanRootProps<T> = WithoutGovernedDataSlot<
  Omit<useRender.ComponentProps<"div">, "children"> & {
    value: Record<string, T[]>;
    onValueChange: React.Dispatch<React.SetStateAction<Record<string, T[]>>>;
    getItemValue: (item: T) => string;
    children: ReactNode;
    onMove?: (event: KanbanMoveEvent) => void;
    modifiers?: Modifiers;
  }
>;

type KanbanBoardProps = WithoutGovernedDataSlot<
  useRender.ComponentProps<"div">
>;

type KanbanColumnProps = WithoutGovernedDataSlot<
  useRender.ComponentProps<"div"> & {
    value: string;
    disabled?: boolean;
  }
>;

type KanbanColumnHandleProps = WithoutGovernedDataSlot<
  useRender.ComponentProps<"div"> & {
    cursor?: boolean;
  }
>;

type KanbanItemProps = WithoutGovernedDataSlot<
  useRender.ComponentProps<"div"> & {
    value: string;
    disabled?: boolean;
  }
>;

type KanbanItemHandleProps = WithoutGovernedDataSlot<
  useRender.ComponentProps<"div"> & {
    cursor?: boolean;
  }
>;

type KanbanColumnContentProps = WithoutGovernedDataSlot<
  useRender.ComponentProps<"div"> & {
    value: string;
  }
>;

type KanbanOverlayProps = Omit<
  React.ComponentProps<typeof DragOverlay>,
  "children"
> & {
  children?:
    | ReactNode
    | ((params: {
        value: UniqueIdentifier;
        variant: "column" | "item";
      }) => ReactNode);
};

export interface KanbanAddColumnProps {
  className?: string;
  label?: string;
  onAdd: (title: string) => void;
  placeholder?: string;
  validate?: (title: string) => string | undefined;
}

export interface KanbanAddItemProps {
  className?: string;
  label?: string;
  onAdd: (title: string) => void;
  placeholder?: string;
}

function Kanban<T>({
  value,
  onValueChange,
  getItemValue,
  children,
  className,
  render,
  onMove,
  modifiers,
  ...props
}: KanbanRootProps<T>) {
  const columns = value;
  const setColumns = onValueChange;
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const dndContextId = React.useId();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columnIds = useMemo(() => Object.keys(columns), [columns]);

  const isColumn = useCallback(
    (id: UniqueIdentifier) => columnIds.includes(id as string),
    [columnIds]
  );

  const findContainer = useCallback(
    (id: UniqueIdentifier) => {
      if (isColumn(id)) {
        return id as string;
      }

      return columnIds.find((key) =>
        (columns[key] ?? []).some((item) => getItemValue(item) === id)
      );
    },
    [columns, columnIds, getItemValue, isColumn]
  );

  const findContainerIn = useCallback(
    (data: Record<string, T[]>, id: UniqueIdentifier) => {
      if (Object.keys(data).includes(id as string)) {
        return id as string;
      }

      return Object.keys(data).find((key) =>
        (data[key] ?? []).some((item) => getItemValue(item) === id)
      );
    },
    [getItemValue]
  );

  const reorderColumns = useCallback(
    (activeColumnId: string, overColumnId: string) => {
      setColumns((prev) => {
        const ids = Object.keys(prev);
        const activeIndex = ids.indexOf(activeColumnId);
        const overIndex = ids.indexOf(overColumnId);

        if (
          activeIndex === -1 ||
          overIndex === -1 ||
          activeIndex === overIndex
        ) {
          return prev;
        }

        const newOrder = arrayMove(ids, activeIndex, overIndex);
        const newColumns: Record<string, T[]> = {};

        for (const key of newOrder) {
          newColumns[key] = prev[key] ?? [];
        }

        return newColumns;
      });
    },
    [setColumns]
  );

  const collisionDetection = useCallback<CollisionDetection>(
    (args) => {
      if (isColumn(args.active.id)) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) =>
            isColumn(container.id)
          ),
        });
      }

      const pointerIntersections = pointerWithin(args);

      if (pointerIntersections.length > 0) {
        const itemHit = pointerIntersections.find(({ id }) => !isColumn(id));

        return itemHit ? [itemHit] : pointerIntersections.slice(0, 1);
      }

      return closestCenter(args);
    },
    [isColumn]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      if (onMove) {
        return;
      }

      const { active, over } = event;

      if (!over) {
        return;
      }

      if (isColumn(active.id)) {
        reorderColumns(active.id as string, over.id as string);
        return;
      }

      setColumns((prev) => {
        const activeContainer = findContainerIn(prev, active.id);
        const overContainer = findContainerIn(prev, over.id);

        if (!(activeContainer && overContainer)) {
          return prev;
        }

        if (activeContainer === overContainer) {
          return prev;
        }

        const activeItems = prev[activeContainer] ?? [];
        const overItems = prev[overContainer] ?? [];
        const activeIndex = activeItems.findIndex(
          (item: T) => getItemValue(item) === active.id
        );

        if (activeIndex === -1) {
          return prev;
        }

        let overIndex = overItems.findIndex(
          (item: T) => getItemValue(item) === over.id
        );

        if (Object.keys(prev).includes(over.id as string) || overIndex === -1) {
          overIndex = overItems.length;
        }

        const movedItem = activeItems[activeIndex];

        if (movedItem === undefined) {
          return prev;
        }

        return {
          ...prev,
          [activeContainer]: activeItems.filter(
            (item: T) => getItemValue(item) !== active.id
          ),
          [overContainer]: [
            ...overItems.slice(0, overIndex),
            movedItem,
            ...overItems.slice(overIndex),
          ],
        };
      });
    },
    [
      findContainerIn,
      getItemValue,
      isColumn,
      onMove,
      reorderColumns,
      setColumns,
    ]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveId(null);

      if (!over) {
        return;
      }

      if (onMove && !isColumn(active.id)) {
        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);

        if (activeContainer && overContainer) {
          const activeItems = columns[activeContainer] ?? [];
          const overItems = columns[overContainer] ?? [];
          const activeIndex = activeItems.findIndex(
            (item: T) => getItemValue(item) === active.id
          );

          const overIndex = isColumn(over.id)
            ? overItems.length
            : overItems.findIndex((item: T) => getItemValue(item) === over.id);

          onMove({
            event,
            activeContainer,
            activeIndex,
            overContainer,
            overIndex,
          });
        }

        return;
      }

      if (isColumn(active.id)) {
        return;
      }

      setColumns((prev) => {
        const activeContainer = findContainerIn(prev, active.id);
        const overContainer = findContainerIn(prev, over.id);

        if (
          !(activeContainer && overContainer) ||
          activeContainer !== overContainer
        ) {
          return prev;
        }

        const items = prev[activeContainer] ?? [];
        const activeIndex = items.findIndex(
          (item: T) => getItemValue(item) === active.id
        );
        const overIndex = items.findIndex(
          (item: T) => getItemValue(item) === over.id
        );

        if (
          activeIndex === -1 ||
          overIndex === -1 ||
          activeIndex === overIndex
        ) {
          return prev;
        }

        return {
          ...prev,
          [activeContainer]: arrayMove(items, activeIndex, overIndex),
        };
      });
    },
    [
      columns,
      findContainer,
      findContainerIn,
      getItemValue,
      isColumn,
      onMove,
      setColumns,
    ]
  );

  const contextValue = useMemo(() => {
    const base: KanbanContextProps<unknown> = {
      columns: columns as Record<string, unknown[]>,
      setColumns: setColumns as React.Dispatch<
        React.SetStateAction<Record<string, unknown[]>>
      >,
      getItemId: getItemValue as (item: unknown) => string,
      columnIds,
      activeId,
      setActiveId,
      findContainer,
      isColumn,
    };

    return modifiers ? { ...base, modifiers } : base;
  }, [
    columns,
    setColumns,
    getItemValue,
    columnIds,
    activeId,
    findContainer,
    isColumn,
    modifiers,
  ]);

  const defaultProps = {
    "data-slot": KANBAN_SLOTS.root,
    "data-dragging": activeId !== null,
    className: cn(activeId !== null && kanbanRootDraggingClassName, className),
    children,
  };

  return (
    <KanbanContext.Provider value={contextValue}>
      <DndContext
        collisionDetection={collisionDetection}
        id={dndContextId}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        sensors={sensors}
        {...(modifiers ? { modifiers } : {})}
      >
        {useRender({
          defaultTagName: "div",
          render,
          props: {
            ...mergeProps<"div">(defaultProps, props),
            "data-slot": KANBAN_SLOTS.root,
          },
        })}
      </DndContext>
    </KanbanContext.Provider>
  );
}

function KanbanBoard({ className, render, ...props }: KanbanBoardProps) {
  const context = useContext(KanbanContext);

  if (!context) {
    throw new Error("KanbanBoard must be used within Kanban.");
  }

  const { columnIds } = context;

  const defaultProps = {
    "data-slot": KANBAN_SLOTS.board,
    className: cn(kanbanBoardClassName, className),
    children: props.children,
  };

  return (
    <SortableContext items={columnIds} strategy={rectSortingStrategy}>
      {useRender({
        defaultTagName: "div",
        render,
        props: mergeProps<"div">(defaultProps, props),
      })}
    </SortableContext>
  );
}

function KanbanColumn({
  value,
  className,
  render,
  disabled,
  ...props
}: KanbanColumnProps) {
  const isOverlay = useContext(IsOverlayContext);
  const context = useContext(KanbanContext);

  if (!context) {
    throw new Error("KanbanColumn must be used within Kanban.");
  }

  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging: isSortableDragging,
  } = useSortable({
    id: value,
    disabled: disabled || isOverlay,
    animateLayoutChanges,
  });

  const { activeId, isColumn } = context;
  const isColumnDragging = activeId ? isColumn(activeId) : false;

  const overlayDefaultProps = {
    "data-slot": KANBAN_SLOTS.column,
    "data-value": value,
    "data-dragging": true,
    className: cn(kanbanColumnClassName, className),
    children: props.children,
  };

  const liveStyle = {
    transition,
    transform: CSS.Transform.toString(transform),
  } as CSSProperties;

  const liveDefaultProps = {
    "data-slot": KANBAN_SLOTS.column,
    "data-value": value,
    "data-dragging": isSortableDragging,
    "data-disabled": disabled,
    ref: setNodeRef,
    style: liveStyle,
    className: cn(
      kanbanColumnClassName,
      isSortableDragging && kanbanColumnDraggingClassName,
      disabled && kanbanColumnDisabledClassName,
      className
    ),
    children: props.children,
  };

  const columnContextValue = isOverlay
    ? {
        attributes: {} as DraggableAttributes,
        listeners: undefined,
        isDragging: true,
        disabled: false,
      }
    : {
        attributes,
        listeners,
        isDragging: isColumnDragging,
        ...(disabled ? { disabled: true } : {}),
      };

  const rendered = useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      isOverlay ? overlayDefaultProps : liveDefaultProps,
      props
    ),
  });

  return (
    <ColumnContext.Provider value={columnContextValue}>
      {rendered}
    </ColumnContext.Provider>
  );
}

function KanbanColumnHandle({
  className,
  render,
  cursor = true,
  ...props
}: KanbanColumnHandleProps) {
  const { attributes, listeners, isDragging, disabled } =
    useContext(ColumnContext);

  const defaultProps = {
    "data-slot": KANBAN_SLOTS.columnHandle,
    "data-dragging": isDragging,
    "data-disabled": disabled,
    ...attributes,
    ...listeners,
    className: cn(
      kanbanColumnHandleClassName,
      cursor &&
        (isDragging
          ? kanbanColumnHandleDraggingCursorClassName
          : kanbanColumnHandleCursorClassName),
      className
    ),
    children: props.children,
  };

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  });
}

function KanbanItem({
  value,
  className,
  render,
  disabled,
  ...props
}: KanbanItemProps) {
  const isOverlay = useContext(IsOverlayContext);
  const context = useContext(KanbanContext);

  if (!context) {
    throw new Error("KanbanItem must be used within Kanban.");
  }

  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging: isSortableDragging,
  } = useSortable({
    id: value,
    disabled: disabled || isOverlay,
    animateLayoutChanges,
  });

  const { activeId, isColumn } = context;
  const isItemDragging = activeId ? !isColumn(activeId) : false;

  const overlayDefaultProps = {
    "data-slot": KANBAN_SLOTS.item,
    "data-value": value,
    "data-dragging": true,
    className: cn(className),
    children: props.children,
  };

  const liveStyle = {
    transition,
    transform: CSS.Transform.toString(transform),
  } as CSSProperties;

  const liveDefaultProps = {
    "data-slot": KANBAN_SLOTS.item,
    "data-value": value,
    "data-dragging": isSortableDragging,
    "data-disabled": disabled,
    ref: setNodeRef,
    style: liveStyle,
    ...attributes,
    ...listeners,
    className: cn(
      isSortableDragging && kanbanItemDraggingClassName,
      disabled && kanbanItemDisabledClassName,
      className
    ),
    children: props.children,
  };

  const itemContextValue = isOverlay
    ? { listeners: undefined, isDragging: true, disabled: false }
    : {
        listeners,
        isDragging: isItemDragging,
        ...(disabled ? { disabled: true } : {}),
      };

  const rendered = useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      isOverlay ? overlayDefaultProps : liveDefaultProps,
      props
    ),
  });

  return (
    <ItemContext.Provider value={itemContextValue}>
      {rendered}
    </ItemContext.Provider>
  );
}

function KanbanItemHandle({
  className,
  render,
  cursor = true,
  ...props
}: KanbanItemHandleProps) {
  const { listeners, isDragging, disabled } = useContext(ItemContext);

  const defaultProps = {
    "data-slot": KANBAN_SLOTS.itemHandle,
    "data-dragging": isDragging,
    "data-disabled": disabled,
    ...listeners,
    className: cn(
      cursor &&
        (isDragging
          ? kanbanItemHandleDraggingCursorClassName
          : kanbanItemHandleCursorClassName),
      className
    ),
    children: props.children,
  };

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  });
}

function KanbanColumnContent({
  value,
  render,
  ...props
}: KanbanColumnContentProps) {
  const context = useContext(KanbanContext);

  if (!context) {
    throw new Error("KanbanColumnContent must be used within Kanban.");
  }

  const { columns, getItemId } = context;

  const itemIds = useMemo(
    () => columns[value]?.map(getItemId) ?? [],
    [columns, getItemId, value]
  );

  const defaultProps = {
    "data-slot": KANBAN_SLOTS.columnContent,
    children: props.children,
  };

  return (
    <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
      {useRender({
        defaultTagName: "div",
        render,
        props: mergeProps<"div">(defaultProps, props),
      })}
    </SortableContext>
  );
}

function KanbanOverlay({ children, className, ...props }: KanbanOverlayProps) {
  const context = useContext(KanbanContext);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (!context) {
    throw new Error("KanbanOverlay must be used within Kanban.");
  }

  const { activeId, isColumn, modifiers } = context;

  const variant = activeId ? (isColumn(activeId) ? "column" : "item") : "item";

  const content =
    activeId && children
      ? typeof children === "function"
        ? children({ value: activeId, variant })
        : children
      : null;

  if (!mounted) {
    return null;
  }

  return createPortal(
    <DragOverlay
      className={cn(
        kanbanOverlayClassName,
        activeId && kanbanOverlayDraggingClassName,
        className
      )}
      dropAnimation={dropAnimationConfig}
      {...(modifiers ? { modifiers } : {})}
      {...props}
    >
      <IsOverlayContext.Provider value={true}>
        {content}
      </IsOverlayContext.Provider>
    </DragOverlay>,
    document.body
  );
}

function KanbanAddColumn({ onAdd, validate }: KanbanAddColumnProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmed = value.trim();
  const error = trimmed && validate ? validate(trimmed) : undefined;

  function handleOpen() {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleConfirm() {
    if (!trimmed) {
      return;
    }

    if (validate?.(trimmed)) {
      return;
    }

    onAdd(trimmed);
    setValue("");
    setOpen(false);
  }

  function handleCancel() {
    setValue("");
    setOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleConfirm();
    }

    if (event.key === "Escape") {
      handleCancel();
    }
  }

  if (!open) {
    return (
      <button
        className={kanbanAddColumnTriggerClassName}
        data-slot={KANBAN_SLOTS.addColumn}
        onClick={handleOpen}
        type="button"
      >
        <PlusIcon aria-hidden className="size-4" />
        Add New Column
      </button>
    );
  }

  return (
    <Card
      className={kanbanAddColumnCardClassName}
      data-slot={KANBAN_SLOTS.addColumn}
    >
      <CardContent className="flex flex-col gap-2.5 px-4">
        <Input
          aria-invalid={!!error}
          autoFocus
          className="bg-card"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add Column Title..."
          ref={inputRef}
          value={value}
        />
        {error ? <p className="text-destructive text-xs">{error}</p> : null}
        <div className="flex items-center gap-1.5">
          <Button
            disabled={!trimmed || !!error}
            onClick={handleConfirm}
            size="sm"
          >
            Add
          </Button>
          <Button onClick={handleCancel} size="sm" variant="outline">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function KanbanAddItem({ onAdd }: KanbanAddItemProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleOpen() {
    setOpen(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  function handleConfirm() {
    const trimmed = value.trim();

    if (trimmed) {
      onAdd(trimmed);
    }

    setValue("");
    setOpen(false);
  }

  function handleCancel() {
    setValue("");
    setOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleConfirm();
    }

    if (event.key === "Escape") {
      handleCancel();
    }
  }

  if (!open) {
    return (
      <button
        className={kanbanAddItemTriggerClassName}
        data-slot={KANBAN_SLOTS.addItem}
        onClick={handleOpen}
        type="button"
      >
        <PlusIcon aria-hidden className="size-3.5" />
        Add New Item
      </button>
    );
  }

  return (
    <div
      className={kanbanAddItemFormClassName}
      data-slot={KANBAN_SLOTS.addItem}
    >
      <Textarea
        autoFocus
        className="bg-card"
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add Content..."
        ref={textareaRef}
        value={value}
      />
      <div className="flex items-center gap-1.5">
        <Button onClick={handleConfirm} size="sm">
          Add card
        </Button>
        <Button onClick={handleCancel} size="sm" variant="outline">
          Cancel
        </Button>
      </div>
    </div>
  );
}

export type { KanbanSlot } from "./kanban.contract.js";
export type {
  KanbanBoardProps,
  KanbanColumnContentProps,
  KanbanColumnHandleProps,
  KanbanColumnProps,
  KanbanItemHandleProps,
  KanbanItemProps,
  KanbanOverlayProps,
};
export {
  Kanban,
  KanbanAddColumn,
  KanbanAddItem,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
};
