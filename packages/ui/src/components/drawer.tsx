"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "#/lib/utils";
import type { GovernedSurfaceProps, SlotRole } from "@/governance";
import { createGovernedDivSlot } from "#/governance/create-governed-slot";
import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

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

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

interface DrawerOverlayProps
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
    GovernedSurfaceProps {
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
      ...props
    },
    ref
  ) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Drawer",
      recipeName: DRAWER_RECIPE_NAME,
      variant: { density, radius, shadow },
      slot: "root",
      className,
    });

    const handle = resolvePrimitiveGovernance({
      componentName: "Drawer",
      recipeName: DRAWER_RECIPE_NAME,
      slotKey: "handle",
    });

    return (
      <DrawerPortal data-slot="drawer-portal">
        <DrawerOverlay />
        <DrawerPrimitive.Content
          ref={ref}
          {...applyGovernedPresentation(props, governed)}
        >
          <div {...handle.dataAttributes} className={cn(handle.className)} />
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

interface DrawerTitleProps
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

interface DrawerDescriptionProps
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
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
