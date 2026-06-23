"use client";

import type { GovernedToasterProps, SlotRole } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import {
  toasterInlineStyleVariables,
  toasterRootWrapperClassName,
  toasterToastClassName,
} from "@afenda/ui/governance/recipe-maps";
import { cn } from "@afenda/ui/lib/utils";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { Toaster as Sonner, type ToasterProps as SonnerToasterProps } from "sonner";

const TOASTER_RECIPE_NAME = "surface" as const;

const TOASTER_SLOT_ROLES = {
  root: "root",
  icon: "icon",
} as const satisfies Record<string, SlotRole>;

const TOASTER_ICON_SLOT_KEYS = {
  success: "success",
  info: "info",
  warning: "warning",
  error: "error",
  loading: "loading",
} as const;

type ToasterIconSlotKey = keyof typeof TOASTER_ICON_SLOT_KEYS;

function ToasterIcon({
  slotKey,
  Icon,
}: {
  readonly slotKey: ToasterIconSlotKey;
  readonly Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Toaster",
    recipeName: TOASTER_RECIPE_NAME,
    slot: TOASTER_SLOT_ROLES.icon,
    slotKey,
  });

  return (
    <Icon
      aria-hidden="true"
      {...applyGovernedPresentation({}, governed)}
    />
  );
}

export interface ToasterProps
  extends Omit<SonnerToasterProps, "className">,
    GovernedToasterProps {
  readonly className?: string;
}

const Toaster = React.forwardRef<HTMLDivElement, ToasterProps>(
  ({ className, state, theme, ...props }, ref) => {
    const { theme: activeTheme } = useTheme();
    const resolvedTheme: NonNullable<SonnerToasterProps["theme"]> =
      theme ??
      (activeTheme === "light" ||
      activeTheme === "dark" ||
      activeTheme === "system"
        ? activeTheme
        : "system");

    const governed = resolvePrimitiveGovernance({
      componentName: "Toaster",
      recipeName: TOASTER_RECIPE_NAME,
      state,
      slot: TOASTER_SLOT_ROLES.root,
      className,
    });

    return (
      <div
        ref={ref}
        {...applyGovernedPresentation({}, {
          ...governed,
          className: toasterRootWrapperClassName,
        })}
      >
        <Sonner
          {...props}
          theme={resolvedTheme}
          icons={{
            success: (
              <ToasterIcon
                Icon={CircleCheckIcon}
                slotKey={TOASTER_ICON_SLOT_KEYS.success}
              />
            ),
            info: (
              <ToasterIcon
                Icon={InfoIcon}
                slotKey={TOASTER_ICON_SLOT_KEYS.info}
              />
            ),
            warning: (
              <ToasterIcon
                Icon={TriangleAlertIcon}
                slotKey={TOASTER_ICON_SLOT_KEYS.warning}
              />
            ),
            error: (
              <ToasterIcon
                Icon={OctagonXIcon}
                slotKey={TOASTER_ICON_SLOT_KEYS.error}
              />
            ),
            loading: (
              <ToasterIcon
                Icon={Loader2Icon}
                slotKey={TOASTER_ICON_SLOT_KEYS.loading}
              />
            ),
          }}
          style={toasterInlineStyleVariables as React.CSSProperties}
          toastOptions={{
            classNames: {
              toast: toasterToastClassName,
            },
          }}
          className={cn(governed.className)}
        />
      </div>
    );
  }
);

Toaster.displayName = "Toaster";

export { Toaster };
