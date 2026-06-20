import * as React from "react";
import { Slot } from "radix-ui";
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";

import { createGovernedSpanSlot } from "#/governance/create-governed-slot";
import { applyGovernedPresentation } from "#/governance/governed-render";
import { resolvePrimitiveGovernance } from "#/governance/primitive-governance";

const BREADCRUMB_RECIPE_NAME = "surface" as const;

const BreadcrumbEllipsisLabel = createGovernedSpanSlot("BreadcrumbEllipsisLabel", {
  componentName: "Breadcrumb",
  recipeName: BREADCRUMB_RECIPE_NAME,
  slotKey: "ellipsis-label",
});

const Breadcrumb = React.forwardRef<
  HTMLElement,
  Omit<React.ComponentPropsWithoutRef<"nav">, "className"> & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Breadcrumb",
    recipeName: BREADCRUMB_RECIPE_NAME,
    slot: "root",
    className,
  });

  return (
    <nav
      ref={ref}
      {...applyGovernedPresentation(props, governed, {
        "aria-label": "breadcrumb",
      })}
    />
  );
});

Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  Omit<React.ComponentPropsWithoutRef<"ol">, "className"> & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Breadcrumb",
    recipeName: BREADCRUMB_RECIPE_NAME,
    slot: "body",
    className,
  });

  return (
    <ol ref={ref} {...applyGovernedPresentation(props, governed)} />
  );
});

BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  Omit<React.ComponentPropsWithoutRef<"li">, "className"> & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Breadcrumb",
    recipeName: BREADCRUMB_RECIPE_NAME,
    slot: "content",
    className,
  });

  return (
    <li ref={ref} {...applyGovernedPresentation(props, governed)} />
  );
});

BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  Omit<React.ComponentPropsWithoutRef<"a">, "className"> & {
    readonly className?: string;
    readonly asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Breadcrumb",
    recipeName: BREADCRUMB_RECIPE_NAME,
    slot: "control",
    className,
  });

  const Comp = asChild ? Slot.Root : "a";

  return (
    <Comp ref={ref} {...applyGovernedPresentation(props, governed)} />
  );
});

BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  Omit<React.ComponentPropsWithoutRef<"span">, "className"> & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Breadcrumb",
    recipeName: BREADCRUMB_RECIPE_NAME,
    slot: "label",
    className,
  });

  return (
    <span
      ref={ref}
      {...applyGovernedPresentation(
        { ...props, role: "link", "aria-disabled": true, "aria-current": "page" },
        governed
      )}
    />
  );
});

BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  Omit<React.ComponentPropsWithoutRef<"li">, "className"> & {
    readonly className?: string;
  }
>(({ children, className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Breadcrumb",
    recipeName: BREADCRUMB_RECIPE_NAME,
    slot: "icon",
    className,
  });

  return (
    <li
      ref={ref}
      {...applyGovernedPresentation(
        { ...props, role: "presentation", "aria-hidden": true },
        governed
      )}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  );
});

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = React.forwardRef<
  HTMLSpanElement,
  Omit<React.ComponentPropsWithoutRef<"span">, "className"> & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Breadcrumb",
    recipeName: BREADCRUMB_RECIPE_NAME,
    slot: "state",
    className,
  });

  return (
    <span
      ref={ref}
      {...applyGovernedPresentation(
        { ...props, role: "presentation", "aria-hidden": true },
        governed
      )}
    >
      <MoreHorizontalIcon />
      <BreadcrumbEllipsisLabel>More</BreadcrumbEllipsisLabel>
    </span>
  );
});

BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
