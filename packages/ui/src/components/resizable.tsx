"use client";

import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { cn } from "@afenda/ui/lib/utils";
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

// ResizablePanelGroup
// Standard React ref → forwarded to the library's `elementRef` (HTMLDivElement).
// Imperative layout control → useResizablePanelGroupRef (re-exported above).
const ResizablePanelGroup = React.forwardRef<
  HTMLDivElement,
  ResizablePrimitive.GroupProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Resizable",
    recipeName: RESIZABLE_RECIPE_NAME,
    slot: "root",
    className,
  });

  return (
    <ResizablePrimitive.Group
      elementRef={ref}
      {...props}
      {...governed.dataAttributes}
      className={cn(governed.className)}
    />
  );
});
ResizablePanelGroup.displayName = "ResizablePanelGroup";

// ResizablePanel
// Standard React ref → forwarded to the library's `elementRef` (HTMLDivElement).
// Imperative panel control → useResizablePanelRef (re-exported above).
const ResizablePanel = React.forwardRef<
  HTMLDivElement,
  ResizablePrimitive.PanelProps
>(({ ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Resizable",
    recipeName: RESIZABLE_RECIPE_NAME,
    slot: "body",
  });

  return (
    <ResizablePrimitive.Panel
      elementRef={ref}
      {...props}
      {...governed.dataAttributes}
    />
  );
});
ResizablePanel.displayName = "ResizablePanel";

interface ResizableHandleProps extends ResizablePrimitive.SeparatorProps {
  readonly withHandle?: boolean;
}

const ResizableHandle = React.forwardRef<HTMLDivElement, ResizableHandleProps>(
  ({ withHandle, className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Resizable",
      recipeName: RESIZABLE_RECIPE_NAME,
      slot: "control",
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
        {...props}
        {...governed.dataAttributes}
        className={cn(governed.className)}
      >
        {withHandle ? (
          <div {...grip.dataAttributes} className={cn(grip.className)} />
        ) : null}
      </ResizablePrimitive.Separator>
    );
  }
);
ResizableHandle.displayName = "ResizableHandle";

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
