import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "../utils/utils.js";
import {
  AUTH_SHELL_PIXEL_IMAGE_SOURCES,
  type AuthShellMotionVariant,
} from "./auth-shell-motion.contract.js";
import { AuthShellMotionScene } from "./auth-shell-motion-scene.client.js";

export interface AuthShellStageProps
  extends Omit<ComponentPropsWithoutRef<"main">, "children"> {
  readonly children: ReactNode;
  readonly imageSources?: readonly string[];
  readonly sceneClassName?: string;
  readonly variant: AuthShellMotionVariant;
  readonly viewportClassName?: string;
}

const CENTERED_VIEWPORT_CLASS =
  "relative z-10 flex min-h-dvh items-center justify-center px-4 py-10 sm:px-6 lg:px-8";

const viewportClassNameByVariant = {
  access:
    "relative z-10 flex min-h-dvh w-full items-stretch px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-8",
  recover: CENTERED_VIEWPORT_CLASS,
  verify: CENTERED_VIEWPORT_CLASS,
  invite: CENTERED_VIEWPORT_CLASS,
  security: CENTERED_VIEWPORT_CLASS,
  error: CENTERED_VIEWPORT_CLASS,
} satisfies Record<AuthShellMotionVariant, string>;

export function AuthShellStage({
  children,
  className,
  imageSources = AUTH_SHELL_PIXEL_IMAGE_SOURCES,
  sceneClassName,
  variant,
  viewportClassName,
  ...props
}: AuthShellStageProps) {
  return (
    <main
      className={cn(
        "relative isolate min-h-dvh overflow-hidden bg-background text-foreground",
        className
      )}
      data-auth-shell-stage="floating-ingress"
      data-auth-shell-motion-variant={variant}
      {...props}
    >
      <AuthShellMotionScene
        className={cn("opacity-95", sceneClassName)}
        imageSources={imageSources}
        variant={variant}
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-background/88 via-background/36 to-background/84" />
      <div className="pointer-events-none absolute inset-0 bg-radial-[circle_at_top_right] from-primary/20 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-radial-[circle_at_bottom_left] from-primary/12 via-transparent to-transparent" />
      <div
        className={cn(viewportClassNameByVariant[variant], viewportClassName)}
      >
        {children}
      </div>
    </main>
  );
}
