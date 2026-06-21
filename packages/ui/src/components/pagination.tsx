import type { GovernedButtonProps } from "@afenda/ui/governance";
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

  return <ul ref={ref} {...applyGovernedPresentation(props, governed)} />;
});

PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>((props, ref) => <li data-slot="pagination-item" ref={ref} {...props} />);

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
      className={cn(className)}
      emphasis={emphasis}
      intent={intent}
      presentation={presentation}
      size={size}
    >
      <a
        aria-current={isActive ? "page" : undefined}
        data-active={isActive}
        data-slot="pagination-link"
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
      className={cn(padding.className, className)}
      presentation={presentation}
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
      className={cn(padding.className, className)}
      presentation={presentation}
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
      {...applyGovernedPresentation(
        { ...props, "aria-hidden": true },
        governed
      )}
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
