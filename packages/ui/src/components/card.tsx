import * as React from "react";

import { cn } from "#/lib/utils";
import type { GovernedCardProps, SlotRole } from "@/governance";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className">,
    GovernedCardProps {
  /**
   * Governed extension point only.
   * Must be validated by primitive governance before reaching className output.
   */
  readonly className?: string;
}

interface CardSlotProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  /**
   * Governed extension point only.
   * Must be validated by primitive governance before reaching className output.
   */
  readonly className?: string;
}

/**
 * Maps Card subcomponent names to design-system SlotRole vocabulary.
 * Do not invent slot names outside the primitive registry.
 */
const CARD_SLOT_ROLES = {
  header: "header",
  title: "label",
  description: "body",
  action: "actions",
  content: "content",
  footer: "footer",
} as const satisfies Record<
  "header" | "title" | "description" | "action" | "content" | "footer",
  SlotRole
>;

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      state,
      density = "standard",
      radius = "md",
      shadow = "raised",
      size,
      ...props
    },
    ref
  ) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Card",
      recipeName: "card",
      variant: { density, radius, shadow },
      layoutSize: size,
      state,
      slot: "root",
      className,
    });

    return (
      <div
        ref={ref}
        {...props}
        data-density={density}
        data-radius={radius}
        data-shadow={shadow}
        {...governed.dataAttributes}
        className={cn(governed.className)}
      />
    );
  }
);

Card.displayName = "Card";

function createCardSlot(
  displayName: string,
  slotKey: keyof typeof CARD_SLOT_ROLES
) {
  const slot = CARD_SLOT_ROLES[slotKey];

  const CardSlot = React.forwardRef<HTMLDivElement, CardSlotProps>(
    ({ className, ...props }, ref) => {
      const governed = resolvePrimitiveGovernance({
        componentName: "Card",
        recipeName: "card",
        slot,
        className,
      });

      return (
        <div
          ref={ref}
          {...props}
          {...governed.dataAttributes}
          className={cn(governed.className)}
        />
      );
    }
  );

  CardSlot.displayName = displayName;

  return CardSlot;
}

const CardHeader = createCardSlot("CardHeader", "header");
const CardTitle = createCardSlot("CardTitle", "title");
const CardDescription = createCardSlot("CardDescription", "description");
const CardAction = createCardSlot("CardAction", "action");
const CardContent = createCardSlot("CardContent", "content");
const CardFooter = createCardSlot("CardFooter", "footer");

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
