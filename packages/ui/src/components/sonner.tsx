"use client";

import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { toasterInlineStyleVariables } from "@afenda/ui/governance/recipe-maps";
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import type * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const TOASTER_RECIPE_NAME = "surface" as const;

function ToasterIcon({
  slotKey,
  Icon,
}: {
  readonly slotKey: "success" | "info" | "warning" | "error" | "loading";
  readonly Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Toaster",
    recipeName: TOASTER_RECIPE_NAME,
    slot: "icon",
    slotKey,
  });

  return <Icon {...applyGovernedPresentation({}, governed)} />;
}

const Toaster = ({ className, ...props }: ToasterProps) => {
  const { theme } = useTheme();
  const resolvedTheme: NonNullable<ToasterProps["theme"]> =
    theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : "system";

  const governed = resolvePrimitiveGovernance({
    componentName: "Toaster",
    recipeName: TOASTER_RECIPE_NAME,
    slot: "root",
    className,
  });

  return (
    <Sonner
      theme={resolvedTheme}
      {...applyGovernedPresentation(props, governed)}
      icons={{
        success: <ToasterIcon Icon={CircleCheckIcon} slotKey="success" />,
        info: <ToasterIcon Icon={InfoIcon} slotKey="info" />,
        warning: <ToasterIcon Icon={TriangleAlertIcon} slotKey="warning" />,
        error: <ToasterIcon Icon={OctagonXIcon} slotKey="error" />,
        loading: <ToasterIcon Icon={Loader2Icon} slotKey="loading" />,
      }}
      style={toasterInlineStyleVariables as React.CSSProperties}
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
    />
  );
};

Toaster.displayName = "Toaster";

export { Toaster };
