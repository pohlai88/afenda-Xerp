"use client";

import type { GovernedResizableProps, SlotRole } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import * as React from "react";
import * as ResizablePrimitive from "react-resizable-panels";

// Re-export the library's imperative handle types so consumers stay in
// the governed abstraction layer and never need to import from the raw library.
export type {
  GroupImperativeHandle as ResizablePanelGroupHandle,
  Layout as ResizableLayout,
  PanelImperativeHandle as ResizablePanelHandle,
} from "react-resizable-panels";

// Convenience hooks for TypeScript-typed imperative access.
// useResizablePanelGroupRef   → getLayout() / setLayout()
// useResizablePanelRef        → collapse() / expand() / getSize() / resize()
export {
  useGroupCallbackRef as useResizablePanelGroupCallbackRef,
  useGroupRef as useResizablePanelGroupRef,
  usePanelCallbackRef as useResizablePanelCallbackRef,
  usePanelRef as useResizablePanelRef,
} from "react-resizable-panels";

const RESIZABLE_RECIPE_NAME = "surface" as const;

const RESIZABLE_SLOT_ROLES = {
  root: "root",
  body: "body",
  control: "control",
} as const satisfies Record<string, SlotRole>;

export interface ResizablePanelGroupProps
  extends Omit<ResizablePrimitive.GroupProps, "className">,
    GovernedResizableProps {
  readonly className?: string;
}

export interface ResizablePanelProps
  extends Omit<ResizablePrimitive.PanelProps, "className"> {
  readonly className?: string;
}

export interface ResizableHandleProps
  extends Omit<ResizablePrimitive.SeparatorProps, "className"> {
  readonly className?: string;
  readonly withHandle?: boolean;
}

// Imperative layout control → useResizablePanelGroupRef (re-exported above).
const ResizablePanelGroup = React.forwardRef<
  HTMLDivElement,
  ResizablePanelGroupProps
>(({ className, state, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Resizable",
    recipeName: RESIZABLE_RECIPE_NAME,
    state,
    slot: RESIZABLE_SLOT_ROLES.root,
    className,
  });

  return (
    <ResizablePrimitive.Group
      elementRef={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});
ResizablePanelGroup.displayName = "ResizablePanelGroup";

// Imperative panel control → useResizablePanelRef (re-exported above).
const ResizablePanel = React.forwardRef<
  HTMLDivElement,
  ResizablePanelProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Resizable",
    recipeName: RESIZABLE_RECIPE_NAME,
    slot: RESIZABLE_SLOT_ROLES.body,
    className,
  });

  return (
    <ResizablePrimitive.Panel
      elementRef={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});
ResizablePanel.displayName = "ResizablePanel";

const ResizableHandle = React.forwardRef<HTMLDivElement, ResizableHandleProps>(
  ({ withHandle, className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Resizable",
      recipeName: RESIZABLE_RECIPE_NAME,
      slot: RESIZABLE_SLOT_ROLES.control,
      className,
    });

    const grip = resolvePrimitiveGovernance({
      componentName: "Resizable",
      recipeName: RESIZABLE_RECIPE_NAME,
      slotKey: "handle-grip",
    });

    return (
      <ResizablePrimitive.Separator
        elementRef={ref}
        {...applyGovernedPresentation(props, governed)}
      >
        {withHandle ? (
          <div {...applyGovernedPresentation({}, grip)} />
        ) : null}
      </ResizablePrimitive.Separator>
    );
  }
);
ResizableHandle.displayName = "ResizableHandle";

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
