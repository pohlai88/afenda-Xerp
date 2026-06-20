import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";

import { Button } from "#/components/button";
import { cn } from "#/lib/utils";
import type { GovernedButtonProps } from "@/governance";
import { createGovernedSpanSlot } from "#/governance/create-governed-slot";
import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

const PAGINATION_RECIPE_NAME = "surface" as const;

const PaginationLinkText = createGovernedSpanSlot("PaginationLinkText", {
  componentName: "Pagination",
  recipeName: PAGINATION_RECIPE_NAME,
  slotKey: "link-text",
});

const PaginationEllipsisLabel = createGovernedSpanSlot("PaginationEllipsisLabel", {
  componentName: "Pagination",
  recipeName: PAGINATION_RECIPE_NAME,
  slotKey: "ellipsis-label",
});

const Pagination = React.forwardRef<
  HTMLElement,
  Omit<React.ComponentPropsWithoutRef<"nav">, "className"> & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Pagination",
    recipeName: PAGINATION_RECIPE_NAME,
    slot: "root",
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
});

Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  Omit<React.ComponentPropsWithoutRef<"ul">, "className"> & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Pagination",
    recipeName: PAGINATION_RECIPE_NAME,
    slot: "body",
    className,
  });

  return (
    <ul ref={ref} {...applyGovernedPresentation(props, governed)} />
  );
});

PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>((props, ref) => (
  <li ref={ref} data-slot="pagination-item" {...props} />
));

PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  readonly isActive?: boolean;
} & Pick<GovernedButtonProps, "intent" | "emphasis" | "size" | "presentation"> &
  React.ComponentProps<"a"> & {
    readonly className?: string;
  };

function PaginationLink({
  className,
  isActive,
  intent = "primary",
  emphasis = isActive ? "outline" : "ghost",
  size = "md",
  presentation = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      asChild
      intent={intent}
      emphasis={emphasis}
      size={size}
      presentation={presentation}
      className={cn(className)}
    >
      <a
        aria-current={isActive ? "page" : undefined}
        data-slot="pagination-link"
        data-active={isActive}
        {...props}
      />
    </Button>
  );
}

function PaginationPrevious({
  className,
  text = "Previous",
  presentation = "default",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { readonly text?: string }) {
  const padding = resolvePrimitiveGovernance({
    componentName: "Pagination",
    recipeName: PAGINATION_RECIPE_NAME,
    slotKey: "link-padding-start",
  });

  return (
    <PaginationLink
      aria-label="Go to previous page"
      presentation={presentation}
      className={cn(padding.className, className)}
      {...props}
    >
      <ChevronLeftIcon data-icon="inline-start" />
      <PaginationLinkText>{text}</PaginationLinkText>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  text = "Next",
  presentation = "default",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { readonly text?: string }) {
  const padding = resolvePrimitiveGovernance({
    componentName: "Pagination",
    recipeName: PAGINATION_RECIPE_NAME,
    slotKey: "link-padding-end",
  });

  return (
    <PaginationLink
      aria-label="Go to next page"
      presentation={presentation}
      className={cn(padding.className, className)}
      {...props}
    >
      <PaginationLinkText>{text}</PaginationLinkText>
      <ChevronRightIcon data-icon="inline-end" />
    </PaginationLink>
  );
}

const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  Omit<React.ComponentPropsWithoutRef<"span">, "className"> & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Pagination",
    recipeName: PAGINATION_RECIPE_NAME,
    slot: "icon",
    className,
  });

  return (
    <span
      ref={ref}
      {...applyGovernedPresentation({ ...props, "aria-hidden": true }, governed)}
    >
      <MoreHorizontalIcon />
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
