"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";
import { toasterInlineStyleVariables } from "#/governance/recipe-maps";

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
        success: <ToasterIcon slotKey="success" Icon={CircleCheckIcon} />,
        info: <ToasterIcon slotKey="info" Icon={InfoIcon} />,
        warning: <ToasterIcon slotKey="warning" Icon={TriangleAlertIcon} />,
        error: <ToasterIcon slotKey="error" Icon={OctagonXIcon} />,
        loading: <ToasterIcon slotKey="loading" Icon={Loader2Icon} />,
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
