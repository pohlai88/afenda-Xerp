import type {
  GovernedButtonProps,
  GovernedPaginationProps,
  SlotRole,
} from "@afenda/ui/governance";
import { createGovernedSpanSlot } from "@afenda/ui/governance/create-governed-slot";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { cn } from "@afenda/ui/lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import * as React from "react";
import { Button } from "./button";

const PAGINATION_RECIPE_NAME = "surface" as const;

const PAGINATION_SLOT_ROLES = {
  root: "root",
  body: "body",
  icon: "icon",
} as const satisfies Record<"root" | "body" | "icon", SlotRole>;

const PaginationLinkText = createGovernedSpanSlot("PaginationLinkText", {
  componentName: "Pagination",
  recipeName: PAGINATION_RECIPE_NAME,
  slotKey: "link-text",
});

const PaginationEllipsisLabel = createGovernedSpanSlot(
  "PaginationEllipsisLabel",
  {
    componentName: "Pagination",
    recipeName: PAGINATION_RECIPE_NAME,
    slotKey: "ellipsis-label",
  }
);

export interface PaginationProps
  extends Omit<React.ComponentPropsWithoutRef<"nav">, "className">,
    GovernedPaginationProps {
  readonly className?: string;
}

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ className, state, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Pagination",
      recipeName: PAGINATION_RECIPE_NAME,
      slot: PAGINATION_SLOT_ROLES.root,
      state,
      className,
    });

    return (
      <nav
        ref={ref}
        {...applyGovernedPresentation(
          { ...props, role: "navigation" },
          governed,
          { "aria-label": "pagination" }
        )}
      />
    );
  }
);

Pagination.displayName = "Pagination";

export interface PaginationContentProps
  extends Omit<React.ComponentPropsWithoutRef<"ul">, "className"> {
  readonly className?: string;
}

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  PaginationContentProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Pagination",
    recipeName: PAGINATION_RECIPE_NAME,
    slot: PAGINATION_SLOT_ROLES.body,
    className,
  });

  return <ul ref={ref} {...applyGovernedPresentation(props, governed)} />;
});

PaginationContent.displayName = "PaginationContent";

/**
 * Structural list-item wrapper — intentional governance passthrough.
 * Emits `data-slot="pagination-item"` for composition hooks but does not use
 * primitive governance; styling is delegated to PaginationLink/Button.
 */
const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>((props, ref) => <li ref={ref} {...props} data-slot="pagination-item" />);

PaginationItem.displayName = "PaginationItem";

export type PaginationLinkProps = {
  readonly anchorClassName?: string;
  readonly isActive?: boolean;
} & Pick<GovernedButtonProps, "intent" | "emphasis" | "size" | "presentation"> &
  React.ComponentProps<"a"> & {
    readonly className?: string;
  };

const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  (
    {
      anchorClassName,
      className,
      isActive,
      intent = "primary",
      emphasis = isActive ? "outline" : "ghost",
      size = "md",
      presentation = "icon",
      ...props
    },
    ref
  ) => {
    return (
      <Button
        asChild
        className={cn(className)}
        emphasis={emphasis}
        intent={intent}
        presentation={presentation}
        size={size}
      >
        <a
          ref={ref}
          {...props}
          aria-current={isActive ? "page" : undefined}
          className={cn(anchorClassName)}
          data-active={isActive}
          data-slot="pagination-link"
        />
      </Button>
    );
  }
);

PaginationLink.displayName = "PaginationLink";

export type PaginationPreviousProps = React.ComponentProps<
  typeof PaginationLink
> & {
  readonly text?: string;
};

const PaginationPrevious = React.forwardRef<
  HTMLAnchorElement,
  PaginationPreviousProps
>(({ text = "Previous", presentation = "default", ...props }, ref) => {
  const padding = resolvePrimitiveGovernance({
    componentName: "Pagination",
    recipeName: PAGINATION_RECIPE_NAME,
    slotKey: "link-padding-start",
  });

  return (
    <PaginationLink
      ref={ref}
      anchorClassName={padding.className}
      aria-label="Go to previous page"
      presentation={presentation}
      {...props}
    >
      <ChevronLeftIcon aria-hidden="true" data-icon="inline-start" />
      <PaginationLinkText>{text}</PaginationLinkText>
    </PaginationLink>
  );
});

PaginationPrevious.displayName = "PaginationPrevious";

export type PaginationNextProps = React.ComponentProps<typeof PaginationLink> & {
  readonly text?: string;
};

const PaginationNext = React.forwardRef<
  HTMLAnchorElement,
  PaginationNextProps
>(({ text = "Next", presentation = "default", ...props }, ref) => {
  const padding = resolvePrimitiveGovernance({
    componentName: "Pagination",
    recipeName: PAGINATION_RECIPE_NAME,
    slotKey: "link-padding-end",
  });

  return (
    <PaginationLink
      ref={ref}
      anchorClassName={padding.className}
      aria-label="Go to next page"
      presentation={presentation}
      {...props}
    >
      <PaginationLinkText>{text}</PaginationLinkText>
      <ChevronRightIcon aria-hidden="true" data-icon="inline-end" />
    </PaginationLink>
  );
});

PaginationNext.displayName = "PaginationNext";

export interface PaginationEllipsisProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "className"> {
  readonly className?: string;
}

const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  PaginationEllipsisProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Pagination",
    recipeName: PAGINATION_RECIPE_NAME,
    slot: PAGINATION_SLOT_ROLES.icon,
    className,
  });

  return (
    <span ref={ref} {...applyGovernedPresentation(props, governed)}>
      <MoreHorizontalIcon aria-hidden="true" />
      <PaginationEllipsisLabel>More pages</PaginationEllipsisLabel>
    </span>
  );
});

PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
