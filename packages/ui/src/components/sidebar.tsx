"use client";

import { applyGovernedPresentation } from "@afenda/ui/governance/governed-render";
import { resolvePrimitiveGovernance } from "@afenda/ui/governance/primitive-governance";
import { cn } from "@afenda/ui/lib/utils";
import { PanelLeftIcon } from "lucide-react";
import { Slot } from "radix-ui";
import * as React from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./sheet";
import { Skeleton } from "./skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const SIDEBAR_RECIPE_NAME = "surface" as const;

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarMenuButtonVariant = "default" | "outline";
type SidebarMenuButtonSize = "default" | "sm" | "lg";

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
  }
) {
  return resolvePrimitiveGovernance({
    componentName: "Sidebar",
    recipeName: SIDEBAR_RECIPE_NAME,
    ...(slot === undefined ? {} : { slot }),
    ...(options?.slotKey === undefined ? {} : { slotKey: options.slotKey }),
    ...(options?.className === undefined
      ? {}
      : { className: options.className }),
  });
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    readonly defaultOpen?: boolean;
    readonly open?: boolean;
    readonly onOpenChange?: (open: boolean) => void;
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
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
    const governed = sidebarClass("root", { className });

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

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  dir,
  ...props
}: React.ComponentProps<"div"> & {
  readonly side?: "left" | "right";
  readonly variant?: "sidebar" | "floating" | "inset";
  readonly collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  const isFloatingVariant = variant === "floating" || variant === "inset";

  if (collapsible === "none") {
    const governed = sidebarClass(undefined, { slotKey: "sidebar", className });

    return (
      <div {...applyGovernedPresentation(props, governed)}>{children}</div>
    );
  }

  if (isMobile) {
    const content = sidebarClass(undefined, { slotKey: "mobile-content" });
    const inner = sidebarClass(undefined, { slotKey: "mobile-inner" });
    const header = sidebarClass(undefined, { slotKey: "mobile-header" });

    return (
      <Sheet onOpenChange={setOpenMobile} open={openMobile} {...props}>
        <SheetContent
          data-mobile="true"
          data-sidebar="sidebar"
          dir={dir}
          {...content.dataAttributes}
          className={cn(content.className)}
          side={side}
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
        >
          <SheetHeader className={cn(header.className)}>
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div {...inner.dataAttributes} className={cn(inner.className)}>
            {children}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const body = sidebarClass("body");
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

  return (
    <div
      {...body.dataAttributes}
      className={cn(body.className)}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-side={side}
      data-state={state}
      data-variant={variant}
    >
      <div
        {...gapBase.dataAttributes}
        className={cn(gapBase.className, gapVariant.className)}
      />
      <div
        {...applyGovernedPresentation(props, containerBase, {
          "data-side": side,
        })}
        className={cn(containerBase.className, containerVariant.className)}
      >
        <div
          data-sidebar="sidebar"
          {...inner.dataAttributes}
          className={cn(inner.className)}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();
  const srOnly = sidebarClass(undefined, { slotKey: "sr-only" });

  return (
    <Button
      {...props}
      {...(className === undefined ? {} : { className })}
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
      <span {...srOnly.dataAttributes} className={cn(srOnly.className)}>
        Toggle Sidebar
      </span>
    </Button>
  );
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
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

const SidebarInset = React.forwardRef<
  HTMLElement,
  Omit<React.ComponentPropsWithoutRef<"main">, "className"> & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = sidebarClass(undefined, { slotKey: "inset", className });

  return <main ref={ref} {...applyGovernedPresentation(props, governed)} />;
});

SidebarInset.displayName = "SidebarInset";

function SidebarInput({
  className,
  size = "sm",
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      {...props}
      {...(className === undefined ? {} : { className })}
      data-sidebar="input"
      size={size}
    />
  );
}

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentPropsWithoutRef<"div">, "className"> & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = sidebarClass("header", { className });

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

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentPropsWithoutRef<"div">, "className"> & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = sidebarClass("footer", { className });

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

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  const governed = sidebarClass(undefined, { slotKey: "separator", className });

  return (
    <Separator
      {...applyGovernedPresentation(props, governed, {
        "data-sidebar": "separator",
      })}
    />
  );
}

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentPropsWithoutRef<"div">, "className"> & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
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

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentPropsWithoutRef<"div">, "className"> & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
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

function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { readonly asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div";
  const governed = sidebarClass("label", { className });

  return (
    <Comp
      {...applyGovernedPresentation(props, governed, {
        "data-sidebar": "group-label",
      })}
    />
  );
}

function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { readonly asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";
  const governed = sidebarClass("control", { className });

  return (
    <Comp
      {...applyGovernedPresentation(props, governed, {
        "data-sidebar": "group-action",
      })}
    />
  );
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const governed = sidebarClass("state", { className });

  return (
    <div
      {...applyGovernedPresentation(props, governed, {
        "data-sidebar": "group-content",
      })}
    />
  );
}

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  Omit<React.ComponentPropsWithoutRef<"ul">, "className"> & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = sidebarClass("actions", { className });

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

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  Omit<React.ComponentPropsWithoutRef<"li">, "className"> & {
    readonly className?: string;
  }
>(({ className, ...props }, ref) => {
  const governed = sidebarClass("icon", { className });

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

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  readonly asChild?: boolean;
  readonly isActive?: boolean;
  readonly variant?: SidebarMenuButtonVariant;
  readonly size?: SidebarMenuButtonSize;
  readonly tooltip?: string | React.ComponentProps<typeof TooltipContent>;
}) {
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

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<"button"> & {
  readonly asChild?: boolean;
  readonly showOnHover?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "button";
  const governed = sidebarClass(undefined, {
    slotKey: "menu-action",
    className,
  });
  const hover = showOnHover
    ? sidebarClass(undefined, { slotKey: "menu-action-hover" })
    : null;

  return (
    <Comp
      {...applyGovernedPresentation(props, governed, {
        "data-sidebar": "menu-action",
      })}
      className={cn(governed.className, hover?.className)}
    />
  );
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
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

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  readonly showIcon?: boolean;
}) {
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
        <Skeleton
          {...icon.dataAttributes}
          className={cn(icon.className)}
          data-sidebar="menu-skeleton-icon"
        />
      ) : null}
      <Skeleton
        {...text.dataAttributes}
        className={cn(text.className)}
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  const governed = sidebarClass(undefined, { slotKey: "menu-sub", className });

  return (
    <ul
      {...applyGovernedPresentation(props, governed, {
        "data-sidebar": "menu-sub",
      })}
    />
  );
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
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

function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  readonly asChild?: boolean;
  readonly size?: "sm" | "md";
  readonly isActive?: boolean;
}) {
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
