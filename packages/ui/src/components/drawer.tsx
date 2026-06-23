"use client";

import type {
  GovernedDrawerProps,
  GovernedSurfaceProps,
  SlotRole,
} from "@afenda/ui/governance";
import { createGovernedDivSlot } from "@afenda/ui/governance/create-governed-slot";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

const DRAWER_RECIPE_NAME = "surface" as const;

const DRAWER_SLOT_ROLES = {
  header: "header",
  footer: "footer",
  title: "label",
  description: "state",
} as const satisfies Record<string, SlotRole>;

function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

Drawer.displayName = "Drawer";

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

DrawerTrigger.displayName = "DrawerTrigger";

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

DrawerPortal.displayName = "DrawerPortal";

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

DrawerClose.displayName = "DrawerClose";

export interface DrawerOverlayProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>,
    "className"
  > {
  readonly className?: string;
}

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  DrawerOverlayProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Drawer",
    recipeName: DRAWER_RECIPE_NAME,
    slot: "body",
    className,
  });

  return (
    <DrawerPrimitive.Overlay
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

DrawerOverlay.displayName = "DrawerOverlay";

export interface DrawerContentProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>,
      "className"
    >,
    GovernedSurfaceProps,
    GovernedDrawerProps {
  readonly className?: string;
}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(
  (
    {
      className,
      children,
      density = "standard",
      radius = "md",
      shadow = "overlay",
      state,
      ...props
    },
    ref
  ) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Drawer",
      recipeName: DRAWER_RECIPE_NAME,
      variant: { density, radius, shadow },
      state,
      slot: "root",
      className,
    });

    const handle = resolvePrimitiveGovernance({
      componentName: "Drawer",
      recipeName: DRAWER_RECIPE_NAME,
      slotKey: "handle",
    });

    return (
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerPrimitive.Content
          ref={ref}
          {...applyGovernedPresentation(props, governed)}
        >
          <div {...applyGovernedPresentation({}, handle)} />
          {children}
        </DrawerPrimitive.Content>
      </DrawerPortal>
    );
  }
);

DrawerContent.displayName = "DrawerContent";

const DrawerHeader = createGovernedDivSlot("DrawerHeader", {
  componentName: "Drawer",
  recipeName: DRAWER_RECIPE_NAME,
  slot: DRAWER_SLOT_ROLES.header,
});

const DrawerFooter = createGovernedDivSlot("DrawerFooter", {
  componentName: "Drawer",
  recipeName: DRAWER_RECIPE_NAME,
  slot: DRAWER_SLOT_ROLES.footer,
});

export interface DrawerTitleProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>,
    "className"
  > {
  readonly className?: string;
}

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  DrawerTitleProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Drawer",
    recipeName: DRAWER_RECIPE_NAME,
    slot: DRAWER_SLOT_ROLES.title,
    className,
  });

  return (
    <DrawerPrimitive.Title
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

DrawerTitle.displayName = "DrawerTitle";

export interface DrawerDescriptionProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>,
    "className"
  > {
  readonly className?: string;
}

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  DrawerDescriptionProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Drawer",
    recipeName: DRAWER_RECIPE_NAME,
    slot: DRAWER_SLOT_ROLES.description,
    className,
  });

  return (
    <DrawerPrimitive.Description
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

DrawerDescription.displayName = "DrawerDescription";

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
