import type { GovernedCardProps, SlotRole } from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import * as React from "react";

const CARD_RECIPE_NAME = "card" as const;

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className">,
    GovernedCardProps {
  /**
   * Governed extension point only.
   * Must be validated by primitive governance before reaching className output.
   */
  readonly className?: string;
}

export interface CardSlotProps
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
      recipeName: CARD_RECIPE_NAME,
      variant: { density, radius, shadow },
      layoutSize: size,
      state,
      slot: "root",
      className,
    });

    return (
      <div
        ref={ref}
        {...applyGovernedPresentation(props, governed, {
          "data-density": density,
          "data-radius": radius,
          "data-shadow": shadow,
          "data-size": size,
        })}
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
        recipeName: CARD_RECIPE_NAME,
        slot,
        className,
      });

      return (
        <div ref={ref} {...applyGovernedPresentation(props, governed)} />
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

export type CardHeaderProps = CardSlotProps;
export type CardTitleProps = CardSlotProps;
export type CardDescriptionProps = CardSlotProps;
export type CardActionProps = CardSlotProps;
export type CardContentProps = CardSlotProps;
export type CardFooterProps = CardSlotProps;

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
