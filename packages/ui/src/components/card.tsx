import * as React from "react";

import { cn } from "@afenda/ui/lib/utils";
import type { GovernedCardProps } from "@afenda/ui/governance";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";

export interface CardProps
  extends Omit<React.ComponentProps<"div">, "className">,
    GovernedCardProps {
  readonly className?: string;
  readonly state?: string;
  readonly size?: "default" | "sm";
}

function Card({
  className,
  state,
  density = "standard",
  radius = "md",
  shadow = "raised",
  size = "default",
  ...props
}: CardProps) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Card",
    recipeName: "card",
    variant: { density, radius, shadow },
    state,
    slot: "root",
    className,
  });

  return (
    <div
      {...governed.dataAttributes}
      data-size={size}
      className={cn(governed.className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Card",
    slot: "header",
    className,
  });

  return (
    <div {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Card",
    slot: "label",
    className,
  });

  return (
    <div {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Card",
    slot: "body",
    className,
  });

  return (
    <div {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Card",
    slot: "actions",
    className,
  });

  return (
    <div {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Card",
    slot: "content",
    className,
  });

  return (
    <div {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  const governed = resolvePrimitiveGovernance({
    componentName: "Card",
    slot: "footer",
    className,
  });

  return (
    <div {...governed.dataAttributes} className={cn(governed.className)} {...props} />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
