"use client";

import type {
  GovernedSidebarProps,
  SlotRole,
} from "@afenda/ui/governance";
import type {
  SidebarMenuButtonSizeKey,
  SidebarMenuButtonVariantKey,
} from "@afenda/ui/governance/recipe-maps-composite";
import {
  applyGovernedPresentation,
  mergeGovernedPresentation,
} from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { PanelLeftIcon } from "lucide-react";
import { Dialog as SheetPrimitive, Slot } from "radix-ui";
import * as React from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import {
  Sheet,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./sheet";
import { Skeleton } from "./skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const SIDEBAR_RECIPE_NAME = "surface" as const;

const SIDEBAR_SLOT_ROLES = {
  root: "root",
  body: "body",
  header: "header",
  footer: "footer",
  label: "label",
  control: "control",
  state: "state",
  actions: "actions",
  icon: "icon",
} as const satisfies Record<string, SlotRole>;

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

export type SidebarMenuButtonVariant = SidebarMenuButtonVariantKey;
export type SidebarMenuButtonSize = SidebarMenuButtonSizeKey;

interface SidebarContextProps {
  readonly isMobile: boolean;
  readonly open: boolean;
  readonly openMobile: boolean;
  readonly setOpen: (open: boolean) => void;
  readonly setOpenMobile: (open: boolean) => void;
  readonly state: "expanded" | "collapsed";
  readonly toggleSidebar: () => void;
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

function sidebarClass(
  slot?: Parameters<typeof resolvePrimitiveGovernance>[0]["slot"],
  options?: {
    readonly slotKey?: string;
    readonly className?: string | undefined;
    readonly state?: GovernedSidebarProps["state"];
  }
) {
  return resolvePrimitiveGovernance({
    componentName: "Sidebar",
    recipeName: SIDEBAR_RECIPE_NAME,
    ...(options?.state === undefined ? {} : { state: options.state }),
    ...(slot === undefined ? {} : { slot }),
    ...(options?.slotKey === undefined ? {} : { slotKey: options.slotKey }),
    ...(options?.className === undefined
      ? {}
      : { className: options.className }),
  });
}

export interface SidebarProviderProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "className">,
    GovernedSidebarProps {
  readonly className?: string;
  readonly defaultOpen?: boolean;
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
}

const SidebarProvider = React.forwardRef<HTMLDivElement, SidebarProviderProps>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      state: governedState,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;

    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }

        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [setOpenProp, open]
    );

    const toggleSidebar = React.useCallback(
      () =>
        isMobile
          ? setOpenMobile((current) => !current)
          : setOpen((current) => !current),
      [isMobile, setOpen]
    );

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);

    const state = open ? "expanded" : "collapsed";
    const governed = sidebarClass(SIDEBAR_SLOT_ROLES.root, {
      className,
      state: governedState,
    });

    const contextValue = React.useMemo<SidebarContextProps>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, toggleSidebar]
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          ref={ref}
          {...applyGovernedPresentation(
            {
              style: {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties,
              ...props,
            },
            governed
          )}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  }
);

SidebarProvider.displayName = "SidebarProvider";

export interface SidebarProps
  extends Omit<React.ComponentProps<"div">, "className">,
    GovernedSidebarProps {
  readonly className?: string;
  readonly side?: "left" | "right";
  readonly variant?: "sidebar" | "floating" | "inset";
  readonly collapsible?: "offcanvas" | "icon" | "none";
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  dir,
  state: governedState,
  ...props
}: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  const isFloatingVariant = variant === "floating" || variant === "inset";

  if (collapsible === "none") {
    const governed = sidebarClass(undefined, {
      slotKey: "sidebar",
      className,
      state: governedState,
    });

    return (
      <div {...applyGovernedPresentation(props, governed)}>{children}</div>
    );
  }

  if (isMobile) {
    const mobileContent = sidebarClass(undefined, { slotKey: "mobile-content" });
    const inner = sidebarClass(undefined, { slotKey: "mobile-inner" });
    const header = sidebarClass(undefined, { slotKey: "mobile-header" });
    const sheetOverlay = resolvePrimitiveGovernance({
      componentName: "Sheet",
      recipeName: SIDEBAR_RECIPE_NAME,
      slot: "body",
    });
    const sheetRoot = resolvePrimitiveGovernance({
      componentName: "Sheet",
      recipeName: SIDEBAR_RECIPE_NAME,
      slot: "root",
      variant: { density: "standard", radius: "md", shadow: "overlay" },
    });
    const mergedPanel = mergeGovernedPresentation(sheetRoot, mobileContent);

    return (
      <Sheet onOpenChange={setOpenMobile} open={openMobile} {...props}>
        <SheetPrimitive.Portal data-slot="sheet-portal">
          <SheetPrimitive.Overlay
            {...applyGovernedPresentation({}, sheetOverlay)}
          />
          <SheetPrimitive.Content
            data-mobile="true"
            data-sidebar="sidebar"
            dir={dir}
            {...applyGovernedPresentation({}, mergedPanel, {
              "data-side": side,
            })}
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
          >
            <div {...applyGovernedPresentation({}, header)}>
              <SheetHeader>
                <SheetTitle>Sidebar</SheetTitle>
                <SheetDescription>Displays the mobile sidebar.</SheetDescription>
              </SheetHeader>
            </div>
            <div {...applyGovernedPresentation({}, inner)}>{children}</div>
          </SheetPrimitive.Content>
        </SheetPrimitive.Portal>
      </Sheet>
    );
  }

  const body = sidebarClass(SIDEBAR_SLOT_ROLES.body);
  const gapBase = sidebarClass(undefined, { slotKey: "gap" });
  const gapVariant = sidebarClass(undefined, {
    slotKey: isFloatingVariant ? "gap-floating" : "gap-sidebar",
  });
  const containerBase = sidebarClass(undefined, {
    slotKey: "container",
    className,
  });
  const containerVariant = sidebarClass(undefined, {
    slotKey: isFloatingVariant ? "container-floating" : "container-sidebar",
  });
  const inner = sidebarClass(undefined, { slotKey: "inner" });
  const gap = mergeGovernedPresentation(gapBase, gapVariant);
  const container = mergeGovernedPresentation(containerBase, containerVariant);

  return (
    <div
      {...applyGovernedPresentation(
        {
          "data-collapsible": state === "collapsed" ? collapsible : "",
          "data-side": side,
          "data-variant": variant,
        },
        body
      )}
      data-state={state}
    >
      <div {...applyGovernedPresentation({}, gap)} />
      <div
        {...applyGovernedPresentation(props, container, {
          "data-side": side,
        })}
      >
        <div
          {...applyGovernedPresentation({}, inner, {
            "data-sidebar": "sidebar",
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export interface SidebarTriggerProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof Button>,
    "className" | "emphasis" | "intent" | "presentation" | "size"
  > {
  readonly className?: string;
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: SidebarTriggerProps) {
  const { toggleSidebar } = useSidebar();
  const triggerShell = sidebarClass(undefined, {
    slotKey: "trigger",
    className,
  });
  const srOnly = sidebarClass(undefined, { slotKey: "sr-only" });

  return (
    <span {...applyGovernedPresentation({}, triggerShell)}>
      <Button
        {...props}
        data-sidebar="trigger"
        emphasis="ghost"
        intent="quiet"
        onClick={(event) => {
          onClick?.(event);
          toggleSidebar();
        }}
        presentation="icon"
        size="sm"
      >
        <PanelLeftIcon />
        <span {...applyGovernedPresentation({}, srOnly)}>Toggle Sidebar</span>
      </Button>
    </span>
  );
}

SidebarTrigger.displayName = "SidebarTrigger";

function SidebarRail({ className, ...props }: SidebarRailProps) {
  const { toggleSidebar } = useSidebar();
  const governed = sidebarClass(undefined, { slotKey: "rail", className });

  return (
    <button
      {...applyGovernedPresentation(
        {
          "aria-label": "Toggle Sidebar",
          tabIndex: -1,
          onClick: toggleSidebar,
          title: "Toggle Sidebar",
          ...props,
        },
        governed,
        { "data-sidebar": "rail" }
      )}
    />
  );
}

SidebarRail.displayName = "SidebarRail";

export interface SidebarRailProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "className"> {
  readonly className?: string;
}

const SidebarInset = React.forwardRef<HTMLElement, SidebarInsetProps>(({ className, ...props }, ref) => {
  const governed = sidebarClass(undefined, { slotKey: "inset", className });

  return <main ref={ref} {...applyGovernedPresentation(props, governed)} />;
});

SidebarInset.displayName = "SidebarInset";

export interface SidebarInsetProps
  extends Omit<React.ComponentPropsWithoutRef<"main">, "className"> {
  readonly className?: string;
}

const SidebarInput = React.forwardRef<HTMLInputElement, SidebarInputProps>(
  ({ className, size = "sm", ...props }, ref) => {
    const governed = sidebarClass(undefined, { slotKey: "input", className });

    return (
      <div {...applyGovernedPresentation({}, governed)}>
        <Input
          ref={ref}
          {...props}
          data-sidebar="input"
          size={size}
        />
      </div>
    );
  }
);

SidebarInput.displayName = "SidebarInput";

export interface SidebarInputProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Input>, "className"> {
  readonly className?: string;
}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(({ className, ...props }, ref) => {
  const governed = sidebarClass(SIDEBAR_SLOT_ROLES.header, { className });

  return (
    <div
      ref={ref}
      {...applyGovernedPresentation(props, governed, {
        "data-sidebar": "header",
      })}
    />
  );
});

SidebarHeader.displayName = "SidebarHeader";

export interface SidebarHeaderProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "className"> {
  readonly className?: string;
}

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(({ className, ...props }, ref) => {
  const governed = sidebarClass(SIDEBAR_SLOT_ROLES.footer, { className });

  return (
    <div
      ref={ref}
      {...applyGovernedPresentation(props, governed, {
        "data-sidebar": "footer",
      })}
    />
  );
});

SidebarFooter.displayName = "SidebarFooter";

export interface SidebarFooterProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "className"> {
  readonly className?: string;
}

const SidebarSeparator = React.forwardRef<HTMLDivElement, SidebarSeparatorProps>(
  ({ className, orientation: _orientation, ...props }, ref) => {
    const governed = sidebarClass(undefined, {
      slotKey: "separator",
      className,
    });

    return (
      <div
        ref={ref}
        {...applyGovernedPresentation(props, governed, {
          "data-sidebar": "separator",
        })}
      >
        <Separator orientation="horizontal" />
      </div>
    );
  }
);

SidebarSeparator.displayName = "SidebarSeparator";

export interface SidebarSeparatorProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Separator>, "className"> {
  readonly className?: string;
}

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(({ className, ...props }, ref) => {
  const governed = sidebarClass(undefined, {
    slotKey: "content-scroll",
    className,
  });

  return (
    <div
      ref={ref}
      {...applyGovernedPresentation(props, governed, {
        "data-sidebar": "content",
      })}
    />
  );
});

SidebarContent.displayName = "SidebarContent";

export interface SidebarContentProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "className"> {
  readonly className?: string;
}

const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(({ className, ...props }, ref) => {
  const governed = sidebarClass(undefined, { slotKey: "group", className });

  return (
    <div
      ref={ref}
      {...applyGovernedPresentation(props, governed, {
        "data-sidebar": "group",
      })}
    />
  );
});

SidebarGroup.displayName = "SidebarGroup";

export interface SidebarGroupProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "className"> {
  readonly className?: string;
}

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, SidebarGroupLabelProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : "div";
    const governed = sidebarClass(SIDEBAR_SLOT_ROLES.label, { className });

    return (
      <Comp
        ref={ref}
        {...applyGovernedPresentation(props, governed, {
          "data-sidebar": "group-label",
        })}
      />
    );
  }
);

SidebarGroupLabel.displayName = "SidebarGroupLabel";

export interface SidebarGroupLabelProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "className"> {
  readonly className?: string;
  readonly asChild?: boolean;
}

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  SidebarGroupActionProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot.Root : "button";
  const governed = sidebarClass(SIDEBAR_SLOT_ROLES.control, { className });

  return (
    <Comp
      ref={ref}
      {...applyGovernedPresentation(props, governed, {
        "data-sidebar": "group-action",
      })}
    />
  );
});

SidebarGroupAction.displayName = "SidebarGroupAction";

export interface SidebarGroupActionProps
  extends Omit<React.ComponentPropsWithoutRef<"button">, "className"> {
  readonly className?: string;
  readonly asChild?: boolean;
}

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  SidebarGroupContentProps
>(({ className, ...props }, ref) => {
  const governed = sidebarClass(SIDEBAR_SLOT_ROLES.state, { className });

  return (
    <div
      ref={ref}
      {...applyGovernedPresentation(props, governed, {
        "data-sidebar": "group-content",
      })}
    />
  );
});

SidebarGroupContent.displayName = "SidebarGroupContent";

export interface SidebarGroupContentProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "className"> {
  readonly className?: string;
}

const SidebarMenu = React.forwardRef<HTMLUListElement, SidebarMenuProps>(({ className, ...props }, ref) => {
  const governed = sidebarClass(SIDEBAR_SLOT_ROLES.actions, { className });

  return (
    <ul
      ref={ref}
      {...applyGovernedPresentation(props, governed, {
        "data-sidebar": "menu",
      })}
    />
  );
});

SidebarMenu.displayName = "SidebarMenu";

export interface SidebarMenuProps
  extends Omit<React.ComponentPropsWithoutRef<"ul">, "className"> {
  readonly className?: string;
}

const SidebarMenuItem = React.forwardRef<HTMLLIElement, SidebarMenuItemProps>(({ className, ...props }, ref) => {
  const governed = sidebarClass(SIDEBAR_SLOT_ROLES.icon, { className });

  return (
    <li
      ref={ref}
      {...applyGovernedPresentation(props, governed, {
        "data-sidebar": "menu-item",
      })}
    />
  );
});

SidebarMenuItem.displayName = "SidebarMenuItem";

export interface SidebarMenuItemProps
  extends Omit<React.ComponentPropsWithoutRef<"li">, "className"> {
  readonly className?: string;
}

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: SidebarMenuButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  const { isMobile, state } = useSidebar();

  const governed = sidebarClass(undefined, {
    slotKey: `menu-button-${variant}-${size}`,
    className,
  });

  const button = (
    <Comp
      {...applyGovernedPresentation(props, governed, {
        "data-sidebar": "menu-button",
        "data-size": size,
        "data-active": isActive,
      })}
    />
  );

  if (!tooltip) {
    return button;
  }

  const tooltipProps =
    typeof tooltip === "string"
      ? {
          children: tooltip,
        }
      : tooltip;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        align="center"
        hidden={state !== "collapsed" || isMobile}
        side="right"
        {...tooltipProps}
      />
    </Tooltip>
  );
}

export interface SidebarMenuButtonProps
  extends Omit<React.ComponentProps<"button">, "className"> {
  readonly asChild?: boolean;
  readonly isActive?: boolean;
  readonly variant?: SidebarMenuButtonVariant;
  readonly size?: SidebarMenuButtonSize;
  readonly className?: string;
  readonly tooltip?: string | React.ComponentProps<typeof TooltipContent>;
}

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: SidebarMenuActionProps) {
  const Comp = asChild ? Slot.Root : "button";
  const governed = showOnHover
    ? mergeGovernedPresentation(
        sidebarClass(undefined, { slotKey: "menu-action", className }),
        sidebarClass(undefined, { slotKey: "menu-action-hover" })
      )
    : sidebarClass(undefined, { slotKey: "menu-action", className });

  return (
    <Comp
      {...applyGovernedPresentation(props, governed, {
        "data-sidebar": "menu-action",
      })}
    />
  );
}

export interface SidebarMenuActionProps
  extends Omit<React.ComponentProps<"button">, "className"> {
  readonly asChild?: boolean;
  readonly showOnHover?: boolean;
  readonly className?: string;
}

function SidebarMenuBadge({
  className,
  ...props
}: SidebarMenuBadgeProps) {
  const governed = sidebarClass(undefined, {
    slotKey: "menu-badge",
    className,
  });

  return (
    <div
      {...applyGovernedPresentation(props, governed, {
        "data-sidebar": "menu-badge",
      })}
    />
  );
}

export interface SidebarMenuBadgeProps
  extends Omit<React.ComponentProps<"div">, "className"> {
  readonly className?: string;
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: SidebarMenuSkeletonProps) {
  const [width] = React.useState(
    () => `${Math.floor(Math.random() * 40) + 50}%`
  );
  const governed = sidebarClass(undefined, {
    slotKey: "menu-skeleton",
    className,
  });
  const icon = sidebarClass(undefined, { slotKey: "menu-skeleton-icon" });
  const text = sidebarClass(undefined, { slotKey: "menu-skeleton-text" });

  return (
    <div
      {...applyGovernedPresentation(props, governed, {
        "data-sidebar": "menu-skeleton",
      })}
    >
      {showIcon ? (
        <div
          {...applyGovernedPresentation({}, icon, {
            "data-sidebar": "menu-skeleton-icon",
          })}
        >
          <Skeleton />
        </div>
      ) : null}
      <div
        {...applyGovernedPresentation(
          {
            style: {
              "--skeleton-width": width,
            } as React.CSSProperties,
          },
          text,
          { "data-sidebar": "menu-skeleton-text" }
        )}
      >
        <Skeleton />
      </div>
    </div>
  );
}

export interface SidebarMenuSkeletonProps
  extends Omit<React.ComponentProps<"div">, "className"> {
  readonly showIcon?: boolean;
  readonly className?: string;
}

function SidebarMenuSub({ className, ...props }: SidebarMenuSubProps) {
  const governed = sidebarClass(undefined, { slotKey: "menu-sub", className });

  return (
    <ul
      {...applyGovernedPresentation(props, governed, {
        "data-sidebar": "menu-sub",
      })}
    />
  );
}

export interface SidebarMenuSubProps
  extends Omit<React.ComponentProps<"ul">, "className"> {
  readonly className?: string;
}

function SidebarMenuSubItem({
  className,
  ...props
}: SidebarMenuSubItemProps) {
  const governed = sidebarClass(undefined, {
    slotKey: "menu-sub-item",
    className,
  });

  return (
    <li
      {...applyGovernedPresentation(props, governed, {
        "data-sidebar": "menu-sub-item",
      })}
    />
  );
}

export interface SidebarMenuSubItemProps
  extends Omit<React.ComponentProps<"li">, "className"> {
  readonly className?: string;
}

function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}: SidebarMenuSubButtonProps) {
  const Comp = asChild ? Slot.Root : "a";
  const governed = sidebarClass(undefined, {
    slotKey: "menu-sub-button",
    className,
  });

  return (
    <Comp
      {...applyGovernedPresentation(props, governed, {
        "data-sidebar": "menu-sub-button",
        "data-size": size,
        "data-active": isActive,
      })}
    />
  );
}

export interface SidebarMenuSubButtonProps
  extends Omit<React.ComponentProps<"a">, "className"> {
  readonly asChild?: boolean;
  readonly size?: "sm" | "md";
  readonly isActive?: boolean;
  readonly className?: string;
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
