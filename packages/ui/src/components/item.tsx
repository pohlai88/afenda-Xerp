import type {
  GovernedItemMediaVariant,
  GovernedItemProps,
  GovernedItemSize,
  GovernedItemVariant,
  SlotRole,
} from "@afenda/ui/governance";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { Slot } from "radix-ui";
import * as React from "react";
import { Separator } from "./separator";

const ITEM_RECIPE_NAME = "surface" as const;

const ITEM_SLOT_ROLES = {
  group: "body",
  root: "root",
  media: "control",
  content: "content",
  title: "label",
  description: "state",
  actions: "actions",
  header: "header",
  footer: "footer",
  separator: "icon",
} as const satisfies Record<string, SlotRole>;

export type ItemVariant = GovernedItemVariant;
export type ItemSize = GovernedItemSize;
export type ItemMediaVariant = GovernedItemMediaVariant;

export interface ItemGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const ItemGroup = React.forwardRef<HTMLDivElement, ItemGroupProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Item",
      recipeName: ITEM_RECIPE_NAME,
      slot: ITEM_SLOT_ROLES.group,
      className,
    });

    return (
      <div
        ref={ref}
        {...applyGovernedPresentation({ ...props, role: "list" }, governed)}
      />
    );
  }
);

ItemGroup.displayName = "ItemGroup";

export interface ItemSeparatorProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Separator>, "className"> {
  readonly className?: string;
}

const ItemSeparator = React.forwardRef<HTMLDivElement, ItemSeparatorProps>(
  ({ className, orientation: _orientation, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Item",
      recipeName: ITEM_RECIPE_NAME,
      slot: ITEM_SLOT_ROLES.separator,
      className,
    });

    return (
      <div ref={ref} {...applyGovernedPresentation(props, governed)}>
        <Separator orientation="horizontal" />
      </div>
    );
  }
);

ItemSeparator.displayName = "ItemSeparator";

export interface ItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className">,
    GovernedItemProps {
  readonly asChild?: boolean;
  readonly className?: string;
}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      state,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Item",
      recipeName: ITEM_RECIPE_NAME,
      slot: ITEM_SLOT_ROLES.root,
      slotKey: `${variant}-${size}`,
      state,
      className,
    });

    const Comp = asChild ? Slot.Root : "div";

    return (
      <Comp
        ref={ref}
        {...applyGovernedPresentation(props, governed, {
          "data-size": size,
          "data-variant": variant,
        })}
      />
    );
  }
);

Item.displayName = "Item";

export interface ItemMediaProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
  readonly variant?: ItemMediaVariant;
}

const ItemMedia = React.forwardRef<HTMLDivElement, ItemMediaProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Item",
      recipeName: ITEM_RECIPE_NAME,
      slot: ITEM_SLOT_ROLES.media,
      slotKey: `media-${variant}`,
      className,
    });

    return (
      <div
        ref={ref}
        {...applyGovernedPresentation(props, governed, {
          "data-variant": variant,
        })}
      />
    );
  }
);

ItemMedia.displayName = "ItemMedia";

export interface ItemContentProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const ItemContent = React.forwardRef<HTMLDivElement, ItemContentProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Item",
      recipeName: ITEM_RECIPE_NAME,
      slot: ITEM_SLOT_ROLES.content,
      className,
    });

    return <div ref={ref} {...applyGovernedPresentation(props, governed)} />;
  }
);

ItemContent.displayName = "ItemContent";

export interface ItemTitleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const ItemTitle = React.forwardRef<HTMLDivElement, ItemTitleProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Item",
      recipeName: ITEM_RECIPE_NAME,
      slot: ITEM_SLOT_ROLES.title,
      className,
    });

    return <div ref={ref} {...applyGovernedPresentation(props, governed)} />;
  }
);

ItemTitle.displayName = "ItemTitle";

export interface ItemDescriptionProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, "className"> {
  readonly className?: string;
}

const ItemDescription = React.forwardRef<
  HTMLParagraphElement,
  ItemDescriptionProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Item",
    recipeName: ITEM_RECIPE_NAME,
    slot: ITEM_SLOT_ROLES.description,
    className,
  });

  return <p ref={ref} {...applyGovernedPresentation(props, governed)} />;
});

ItemDescription.displayName = "ItemDescription";

export interface ItemActionsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const ItemActions = React.forwardRef<HTMLDivElement, ItemActionsProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Item",
      recipeName: ITEM_RECIPE_NAME,
      slot: ITEM_SLOT_ROLES.actions,
      className,
    });

    return <div ref={ref} {...applyGovernedPresentation(props, governed)} />;
  }
);

ItemActions.displayName = "ItemActions";

export interface ItemHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const ItemHeader = React.forwardRef<HTMLDivElement, ItemHeaderProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Item",
      recipeName: ITEM_RECIPE_NAME,
      slot: ITEM_SLOT_ROLES.header,
      className,
    });

    return <div ref={ref} {...applyGovernedPresentation(props, governed)} />;
  }
);

ItemHeader.displayName = "ItemHeader";

export interface ItemFooterProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const ItemFooter = React.forwardRef<HTMLDivElement, ItemFooterProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Item",
      recipeName: ITEM_RECIPE_NAME,
      slot: ITEM_SLOT_ROLES.footer,
      className,
    });

    return <div ref={ref} {...applyGovernedPresentation(props, governed)} />;
  }
);

ItemFooter.displayName = "ItemFooter";

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
};
