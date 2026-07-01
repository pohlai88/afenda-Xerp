"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import type * as React from "react";

import type { WithoutGovernedDataSlot } from "@/lib/governed-primitive-props";
import { cn } from "@/utils/utils";

import {
  AVATAR_SLOTS,
  avatarBadgeClassName,
  avatarFallbackClassName,
  avatarGroupClassName,
  avatarGroupCountClassName,
  avatarImageClassName,
  avatarRootClassName,
} from "./avatar.contract.js";

type AvatarSize = "default" | "sm" | "lg";

type AvatarProps = WithoutGovernedDataSlot<
  AvatarPrimitive.Root.Props & {
    size?: AvatarSize;
  }
>;
type AvatarImageProps = WithoutGovernedDataSlot<AvatarPrimitive.Image.Props>;
type AvatarFallbackProps =
  WithoutGovernedDataSlot<AvatarPrimitive.Fallback.Props>;
type AvatarBadgeProps = WithoutGovernedDataSlot<React.ComponentProps<"span">>;
type AvatarGroupProps = WithoutGovernedDataSlot<React.ComponentProps<"div">>;
type AvatarGroupCountProps = WithoutGovernedDataSlot<
  React.ComponentProps<"div">
>;

function Avatar({ className, size = "default", ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      {...props}
      className={cn(avatarRootClassName, className)}
      data-size={size}
      data-slot={AVATAR_SLOTS.root}
    />
  );
}

function AvatarImage({ className, ...props }: AvatarImageProps) {
  return (
    <AvatarPrimitive.Image
      {...props}
      className={cn(avatarImageClassName, className)}
      data-slot={AVATAR_SLOTS.image}
    />
  );
}

function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      {...props}
      className={cn(avatarFallbackClassName, className)}
      data-slot={AVATAR_SLOTS.fallback}
    />
  );
}

function AvatarBadge({ className, ...props }: AvatarBadgeProps) {
  return (
    <span
      {...props}
      className={cn(avatarBadgeClassName, className)}
      data-slot={AVATAR_SLOTS.badge}
    />
  );
}

function AvatarGroup({ className, ...props }: AvatarGroupProps) {
  return (
    <div
      {...props}
      className={cn(avatarGroupClassName, className)}
      data-slot={AVATAR_SLOTS.group}
    />
  );
}

function AvatarGroupCount({ className, ...props }: AvatarGroupCountProps) {
  return (
    <div
      {...props}
      className={cn(avatarGroupCountClassName, className)}
      data-slot={AVATAR_SLOTS.groupCount}
    />
  );
}

export type { AvatarSlot } from "./avatar.contract.js";
export type {
  AvatarBadgeProps,
  AvatarFallbackProps,
  AvatarGroupCountProps,
  AvatarGroupProps,
  AvatarImageProps,
  AvatarProps,
  AvatarSize,
};
export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
};
