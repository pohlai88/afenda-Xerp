import type { GovernedBreadcrumbProps, SlotRole } from "@afenda/ui/governance";
import { createGovernedSpanSlot } from "@afenda/ui/governance/create-governed-slot";
import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import { Slot } from "radix-ui";
import * as React from "react";

const BREADCRUMB_RECIPE_NAME = "surface" as const;

const BREADCRUMB_SLOT_ROLES = {
  list: "body",
  item: "content",
  link: "control",
  page: "label",
  separator: "icon",
  ellipsis: "state",
} as const satisfies Record<string, SlotRole>;

interface BreadcrumbClassNameProps {
  readonly className?: string;
}

export interface BreadcrumbProps
  extends Omit<React.ComponentPropsWithoutRef<"nav">, "className">,
    GovernedBreadcrumbProps {
  readonly className?: string;
}

const BreadcrumbEllipsisLabel = createGovernedSpanSlot(
  "BreadcrumbEllipsisLabel",
  {
    componentName: "Breadcrumb",
    recipeName: BREADCRUMB_RECIPE_NAME,
    slotKey: "ellipsis-label",
  }
);

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, state, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Breadcrumb",
      recipeName: BREADCRUMB_RECIPE_NAME,
      state,
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
  }
);

Breadcrumb.displayName = "Breadcrumb";

export interface BreadcrumbListProps
  extends Omit<React.ComponentPropsWithoutRef<"ol">, "className">,
    BreadcrumbClassNameProps {}

function createBreadcrumbOlSlot(displayName: string) {
  const BreadcrumbOlSlot = React.forwardRef<
    HTMLOListElement,
    BreadcrumbListProps
  >(({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Breadcrumb",
      recipeName: BREADCRUMB_RECIPE_NAME,
      slot: BREADCRUMB_SLOT_ROLES.list,
      className,
    });

    return <ol ref={ref} {...applyGovernedPresentation(props, governed)} />;
  });

  BreadcrumbOlSlot.displayName = displayName;

  return BreadcrumbOlSlot;
}

export interface BreadcrumbItemProps
  extends Omit<React.ComponentPropsWithoutRef<"li">, "className">,
    BreadcrumbClassNameProps {}

function createBreadcrumbLiSlot(
  displayName: string,
  slot: typeof BREADCRUMB_SLOT_ROLES.item
) {
  const BreadcrumbLiSlot = React.forwardRef<
    HTMLLIElement,
    BreadcrumbItemProps
  >(({ className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Breadcrumb",
      recipeName: BREADCRUMB_RECIPE_NAME,
      slot,
      className,
    });

    return <li ref={ref} {...applyGovernedPresentation(props, governed)} />;
  });

  BreadcrumbLiSlot.displayName = displayName;

  return BreadcrumbLiSlot;
}

const BreadcrumbList = createBreadcrumbOlSlot("BreadcrumbList");
const BreadcrumbItem = createBreadcrumbLiSlot(
  "BreadcrumbItem",
  BREADCRUMB_SLOT_ROLES.item
);

export interface BreadcrumbLinkProps
  extends Omit<React.ComponentPropsWithoutRef<"a">, "className">,
    BreadcrumbClassNameProps {
  readonly asChild?: boolean;
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Breadcrumb",
      recipeName: BREADCRUMB_RECIPE_NAME,
      slot: BREADCRUMB_SLOT_ROLES.link,
      className,
    });

    const Comp = asChild ? Slot.Root : "a";

    return <Comp ref={ref} {...applyGovernedPresentation(props, governed)} />;
  }
);

BreadcrumbLink.displayName = "BreadcrumbLink";

export interface BreadcrumbPageProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "className">,
    BreadcrumbClassNameProps {}

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, role, ...props }, ref) => {
    const governed = resolvePrimitiveGovernance({
      componentName: "Breadcrumb",
      recipeName: BREADCRUMB_RECIPE_NAME,
      slot: BREADCRUMB_SLOT_ROLES.page,
      className,
    });

    return (
      <span
        ref={ref}
        {...applyGovernedPresentation(props, governed, {
          role: role ?? "link",
          "aria-disabled": true,
          "aria-current": "page",
        })}
      />
    );
  }
);

BreadcrumbPage.displayName = "BreadcrumbPage";

export interface BreadcrumbSeparatorProps
  extends Omit<React.ComponentPropsWithoutRef<"li">, "className">,
    BreadcrumbClassNameProps {}

const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>(({ children, className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Breadcrumb",
    recipeName: BREADCRUMB_RECIPE_NAME,
    slot: BREADCRUMB_SLOT_ROLES.separator,
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
      {children ?? <ChevronRightIcon aria-hidden="true" />}
    </li>
  );
});

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export interface BreadcrumbEllipsisProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "className">,
    BreadcrumbClassNameProps {}

const BreadcrumbEllipsis = React.forwardRef<
  HTMLSpanElement,
  BreadcrumbEllipsisProps
>(({ className, ...props }, ref) => {
  const governed = resolvePrimitiveGovernance({
    componentName: "Breadcrumb",
    recipeName: BREADCRUMB_RECIPE_NAME,
    slot: BREADCRUMB_SLOT_ROLES.ellipsis,
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
      <MoreHorizontalIcon aria-hidden="true" />
      <BreadcrumbEllipsisLabel>More</BreadcrumbEllipsisLabel>
    </span>
  );
});

BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
