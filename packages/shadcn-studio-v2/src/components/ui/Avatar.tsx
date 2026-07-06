// biome-ignore lint/style/useFilenamingConvention: V2 taxonomy requires PascalCase React component filenames.
"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import type { ComponentProps } from "react";
import { cn } from "../../lib/cn";

export interface AvatarProps
  extends ComponentProps<typeof AvatarPrimitive.Root> {}
export interface AvatarImageProps
  extends ComponentProps<typeof AvatarPrimitive.Image> {}
export interface AvatarFallbackProps
  extends ComponentProps<typeof AvatarPrimitive.Fallback> {}

export function Avatar({ className, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      {...props}
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        typeof className === "string" ? className : undefined
      )}
      data-slot="avatar"
    />
  );
}

export function AvatarImage({ className, ...props }: AvatarImageProps) {
  return (
    <AvatarPrimitive.Image
      {...props}
      className={cn(
        "aspect-square size-full object-cover",
        typeof className === "string" ? className : undefined
      )}
      data-slot="avatar-image"
    />
  );
}

export function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      {...props}
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-muted-foreground",
        typeof className === "string" ? className : undefined
      )}
      data-slot="avatar-fallback"
    />
  );
}
