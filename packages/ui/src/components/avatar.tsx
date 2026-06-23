"use client";

import type {
  GovernedAvatarBadgeProps,
  GovernedAvatarProps,
} from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { Avatar as AvatarPrimitive } from "radix-ui";
import * as React from "react";

const AVATAR_RECIPE_NAME = "form-control" as const;

export interface AvatarProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
      "className"
    >,
    GovernedAvatarProps {
  readonly className?: string;
}

const Avatar = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size = "default", state, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Avatar",
    recipeName: AVATAR_RECIPE_NAME,
    state,
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

export interface AvatarImageProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>,
    "className"
  > {
  readonly className?: string;
}

const AvatarImage = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Image>,
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

export interface AvatarFallbackProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>,
    "className"
  > {
  readonly className?: string;
}

const AvatarFallback = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Fallback>,
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

export interface AvatarBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "className">,
    GovernedAvatarBadgeProps {
  readonly className?: string;
}

const AvatarBadge = React.forwardRef<HTMLSpanElement, AvatarBadgeProps>(
  ({ className, state, tone, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Avatar",
      recipeName: AVATAR_RECIPE_NAME,
      variant: tone === undefined ? undefined : { tone },
      state,
      slot: "icon",
      className,
    });

    return (
      <span
        ref={ref}
        {...applyGovernedPresentation(
          props,
          governed,
          tone === undefined ? undefined : { "data-tone": tone }
        )}
      />
    );
  }
);

AvatarBadge.displayName = "AvatarBadge";

export interface AvatarGroupProps
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

export interface AvatarGroupCountProps
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
