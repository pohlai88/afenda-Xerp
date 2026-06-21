import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { Slot } from "radix-ui";
import * as React from "react";
import { Separator } from "./separator";

const ITEM_RECIPE_NAME = "surface" as const;

export type ItemVariant = "default" | "outline" | "muted";
export type ItemSize = "default" | "sm" | "xs";
export type ItemMediaVariant = "default" | "icon" | "image";

interface ItemGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const ItemGroup = React.forwardRef<HTMLDivElement, ItemGroupProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Item",
      recipeName: ITEM_RECIPE_NAME,
      slot: "body",
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

interface ItemSeparatorProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Separator>, "className"> {
  readonly className?: string;
}

const ItemSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  ItemSeparatorProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Item",
    recipeName: ITEM_RECIPE_NAME,
    slot: "icon",
    className,
  });

  return (
    <Separator
      ref={ref}
      {...applyGovernedPresentation(
        { ...props, orientation: "horizontal" },
        governed
      )}
    />
  );
});

ItemSeparator.displayName = "ItemSeparator";

interface ItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly asChild?: boolean;
  readonly className?: string;
  readonly size?: ItemSize;
  readonly variant?: ItemVariant;
}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Item",
      recipeName: ITEM_RECIPE_NAME,
      slot: "root",
      slotKey: `${variant}-${size}`,
      className,
    });

    const Comp = asChild ? Slot.Root : "div";

    return (
      <Comp
        ref={ref}
        {...applyGovernedPresentation(props, governed, {
          "data-variant": variant,
          "data-size": size,
        })}
      />
    );
  }
);

Item.displayName = "Item";

interface ItemMediaProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
  readonly variant?: ItemMediaVariant;
}

const ItemMedia = React.forwardRef<HTMLDivElement, ItemMediaProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Item",
      recipeName: ITEM_RECIPE_NAME,
      slot: "control",
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

interface ItemContentProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const ItemContent = React.forwardRef<HTMLDivElement, ItemContentProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Item",
      recipeName: ITEM_RECIPE_NAME,
      slot: "content",
      className,
    });

    return <div ref={ref} {...applyGovernedPresentation(props, governed)} />;
  }
);

ItemContent.displayName = "ItemContent";

interface ItemTitleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const ItemTitle = React.forwardRef<HTMLDivElement, ItemTitleProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Item",
      recipeName: ITEM_RECIPE_NAME,
      slot: "label",
      className,
    });

    return <div ref={ref} {...applyGovernedPresentation(props, governed)} />;
  }
);

ItemTitle.displayName = "ItemTitle";

interface ItemDescriptionProps
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
    slot: "state",
    className,
  });

  return <p ref={ref} {...applyGovernedPresentation(props, governed)} />;
});

ItemDescription.displayName = "ItemDescription";

interface ItemActionsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const ItemActions = React.forwardRef<HTMLDivElement, ItemActionsProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Item",
      recipeName: ITEM_RECIPE_NAME,
      slot: "actions",
      className,
    });

    return <div ref={ref} {...applyGovernedPresentation(props, governed)} />;
  }
);

ItemActions.displayName = "ItemActions";

interface ItemHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const ItemHeader = React.forwardRef<HTMLDivElement, ItemHeaderProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Item",
      recipeName: ITEM_RECIPE_NAME,
      slot: "header",
      className,
    });

    return <div ref={ref} {...applyGovernedPresentation(props, governed)} />;
  }
);

ItemHeader.displayName = "ItemHeader";

interface ItemFooterProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
  readonly className?: string;
}

const ItemFooter = React.forwardRef<HTMLDivElement, ItemFooterProps>(
  ({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Item",
      recipeName: ITEM_RECIPE_NAME,
      slot: "footer",
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
