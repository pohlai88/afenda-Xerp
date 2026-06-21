"use client";

import {
  ActivityIcon,
  BellIcon,
  LanguagesIcon,
  SearchIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Kbd,
  TooltipProvider,
} from "@afenda/ui";
import ActivityDialog from "./shadcn-studio/blocks/dialog-activity";
import SearchDialog from "./shadcn-studio/blocks/dialog-search";
import LanguageDropdown from "./shadcn-studio/blocks/dropdown-language";
import NotificationDropdown from "./shadcn-studio/blocks/dropdown-notification";
import ProfileDropdown from "./shadcn-studio/blocks/dropdown-profile";
import MenuTrigger from "./shadcn-studio/blocks/menu-trigger";
import { resolveStockButtonProps } from "./shadcn-studio/stock-props";

import { AppShellCommandCenter } from "./app-shell-command-center";
import { AppShellContextSwitcher } from "./app-shell-context-switcher";
import type {
  AppShellCommandItem,
  AppShellContextSwitcherState,
  AppShellIdentity,
  AppShellWorkspaceContext,
} from "./app-shell.types";

function resolveGreetingName(identity?: AppShellIdentity): string {
  if (!identity?.displayName) {
    return "there";
  }

  return identity.displayName.split(/\s+/)[0] ?? identity.displayName;
}

function resolveInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() ?? "?";
  }

  const first = parts[0]?.[0] ?? "";
  const last = parts.at(-1)?.[0] ?? "";

  return `${first}${last}`.toUpperCase();
}

export interface AppShellHeaderProps {
  readonly commandItems?: readonly AppShellCommandItem[];
  readonly contextSwitcherCompact?: boolean;
  readonly contextSwitcherState?: AppShellContextSwitcherState;
  readonly identity?: AppShellIdentity;
  readonly onContextSwitchRequest?: () => void;
  readonly workspace?: AppShellWorkspaceContext;
}

export function AppShellHeader({
  commandItems,
  contextSwitcherCompact = true,
  contextSwitcherState,
  identity,
  onContextSwitchRequest,
  workspace,
}: AppShellHeaderProps) {
  const greetingName = resolveGreetingName(identity);
  const avatarFallback = identity
    ? resolveInitials(identity.displayName)
    : "JD";

  return (
    <header className="text-primary-foreground" role="banner">
      <p className="sr-only">Application header</p>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <MenuTrigger variant="outline" />
          <div className="hidden sm:flex sm:flex-col sm:items-start">
            <p className="text-lg font-semibold">Hey, {greetingName}</p>
            <p className="text-primary-foreground/50 md:max-lg:hidden">
              Welcome back to your workspace
            </p>
            {workspace ? (
              <div className="text-primary-foreground/70 mt-1 text-sm">
                <AppShellContextSwitcher
                  compact={contextSwitcherCompact}
                  {...(onContextSwitchRequest === undefined
                    ? {}
                    : { onSwitchRequest: onContextSwitchRequest })}
                  {...(contextSwitcherState === undefined
                    ? {}
                    : { state: contextSwitcherState })}
                  workspace={workspace}
                />
              </div>
            ) : null}
          </div>
        </div>

        <SearchDialog
          className="hidden w-full max-w-72 xl:block"
          trigger={
            <Button
              {...resolveStockButtonProps({ variant: "secondary", size: "default" })}
            >
              <SearchIcon className="size-4" />
              <span>Type to search...</span>
              <Kbd>⌘K</Kbd>
            </Button>
          }
        />

        <div className="flex items-center gap-1.5">
          <SearchDialog
            className="block xl:hidden"
            trigger={
              <Button
                {...resolveStockButtonProps({
                  variant: "ghost",
                  size: "icon-lg",
                })}
              >
                <SearchIcon />
                <span className="sr-only">Search</span>
              </Button>
            }
          />
          <LanguageDropdown
            trigger={
              <Button
                {...resolveStockButtonProps({
                  variant: "ghost",
                  size: "icon-lg",
                })}
              >
                <LanguagesIcon />
                <span className="sr-only">Language</span>
              </Button>
            }
          />
          <ActivityDialog
            trigger={
              <Button
                {...resolveStockButtonProps({
                  variant: "ghost",
                  size: "icon-lg",
                })}
              >
                <ActivityIcon />
                <span className="sr-only">Activity</span>
              </Button>
            }
          />
          <NotificationDropdown
            trigger={
              <div className="relative">
                <Button
                  {...resolveStockButtonProps({
                    variant: "ghost",
                    size: "icon-lg",
                  })}
                >
                  <BellIcon />
                  <span className="sr-only">Notifications</span>
                </Button>
                <span
                  aria-hidden
                  className="bg-destructive pointer-events-none absolute top-[14%] right-[23%] size-2 rounded-full"
                />
              </div>
            }
          />
          {identity ? (
            <ProfileDropdown
              avatarFallback={avatarFallback}
              displayName={identity.displayName}
              email={identity.email}
              trigger={
                <Button
                  {...resolveStockButtonProps({
                    variant: "ghost",
                    size: "icon-lg",
                  })}
                >
                  <Avatar>
                    <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png" />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Profile menu</span>
                </Button>
              }
            />
          ) : null}
        </div>
      </div>

      <div className="sr-only">
        <TooltipProvider delayDuration={0}>
          <AppShellCommandCenter
            {...(commandItems === undefined ? {} : { items: commandItems })}
          />
        </TooltipProvider>
      </div>
    </header>
  );
}
