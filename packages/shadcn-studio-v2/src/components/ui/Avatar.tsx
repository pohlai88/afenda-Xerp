"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface AvatarProps
  extends Omit<ComponentProps<typeof AvatarPrimitive.Root>, "className"> {
  readonly className?: string | undefined;
}
export interface AvatarImageProps
  extends Omit<ComponentProps<typeof AvatarPrimitive.Image>, "className"> {
  readonly className?: string | undefined;
}
export interface AvatarFallbackProps
  extends Omit<ComponentProps<typeof AvatarPrimitive.Fallback>, "className"> {
  readonly className?: string | undefined;
}

const AVATAR_CLASS =
  "relative flex size-10 shrink-0 overflow-hidden rounded-full";
const AVATAR_IMAGE_CLASS = "aspect-square size-full object-cover";
const AVATAR_FALLBACK_CLASS =
  "flex size-full items-center justify-center rounded-full bg-muted text-muted-foreground";

export function avatarClassName({
  className,
}: Pick<AvatarProps, "className"> = {}): string {
  return cn(AVATAR_CLASS, className);
}

export function avatarImageClassName({
  className,
}: Pick<AvatarImageProps, "className"> = {}): string {
  return cn(AVATAR_IMAGE_CLASS, className);
}

export function avatarFallbackClassName({
  className,
}: Pick<AvatarFallbackProps, "className"> = {}): string {
  return cn(AVATAR_FALLBACK_CLASS, className);
}

export function Avatar({ className, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      {...props}
      className={avatarClassName({ className })}
      data-slot="avatar"
    />
  );
}

export function AvatarImage({ className, ...props }: AvatarImageProps) {
  return (
    <AvatarPrimitive.Image
      {...props}
      className={avatarImageClassName({ className })}
      data-slot="avatar-image"
    />
  );
}

export function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      {...props}
      className={avatarFallbackClassName({ className })}
      data-slot="avatar-fallback"
    />
  );
}
