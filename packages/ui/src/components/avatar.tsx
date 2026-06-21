"use client";

import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { Avatar as AvatarPrimitive } from "radix-ui";
import * as React from "react";

const AVATAR_RECIPE_NAME = "form-control" as const;

export interface AvatarProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    "className"
  > {
  readonly className?: string;
  readonly size?: "default" | "sm" | "lg";
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size = "default", ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Avatar",
    recipeName: AVATAR_RECIPE_NAME,
    slot: "root",
    className,
  });

  return (
    <AvatarPrimitive.Root
      ref={ref}
      {...applyGovernedPresentation(props, governed, { "data-size": size })}
    />
  );
});

Avatar.displayName = "Avatar";

interface AvatarImageProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>,
    "className"
  > {
  readonly className?: string;
}

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Avatar",
    recipeName: AVATAR_RECIPE_NAME,
    slot: "body",
    className,
  });

  return (
    <AvatarPrimitive.Image
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>,
    "className"
  > {
  readonly className?: string;
}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Avatar",
    recipeName: AVATAR_RECIPE_NAME,
    slot: "control",
    className,
  });

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      {...applyGovernedPresentation(props, governed)}
    />
  );
});

AvatarFallback.displayName = "AvatarFallback";

interface AvatarBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "className"> {
  readonly className?: string;
}

const AvatarBadge = React.forwardRef<HTMLSpanElement, AvatarBadgeProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Avatar",
      recipeName: AVATAR_RECIPE_NAME,
      slot: "icon",
      className,
    });

    return <span ref={ref} {...applyGovernedPresentation(props, governed)} />;
  }
);

AvatarBadge.displayName = "AvatarBadge";

interface AvatarGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Avatar",
      recipeName: AVATAR_RECIPE_NAME,
      slot: "header",
      className,
    });

    return <div ref={ref} {...applyGovernedPresentation(props, governed)} />;
  }
);

AvatarGroup.displayName = "AvatarGroup";

interface AvatarGroupCountProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const AvatarGroupCount = React.forwardRef<
  HTMLDivElement,
  AvatarGroupCountProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Avatar",
    recipeName: AVATAR_RECIPE_NAME,
    slot: "state",
    className,
  });

  return <div ref={ref} {...applyGovernedPresentation(props, governed)} />;
});

AvatarGroupCount.displayName = "AvatarGroupCount";

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
};
