import type { ReactNode } from "react";
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
} from "@afenda/ui";
import {
  mapStockButtonProps,
  type GovernedUiComponentName,
} from "@afenda/ui/governance";

import type { ApplicationShellResolvedChrome } from "./app-shell.types";
import { countDefaultAppShellUnreadNotifications } from "./shadcn-studio/data/app-shell.notification.data";
import { AppShellActivityDialog } from "./shadcn-studio/blocks/app-shell-activity-dialog";
import { AppShellLanguageDropdown } from "./shadcn-studio/blocks/app-shell-language-dropdown";
import { AppShellMenuTrigger } from "./shadcn-studio/blocks/app-shell-menu-trigger";
import { AppShellNotificationDropdown } from "./shadcn-studio/blocks/app-shell-notification-dropdown";
import { AppShellProfileDropdown } from "./shadcn-studio/blocks/app-shell-profile-dropdown";
import { AppShellSearchDialog } from "./shadcn-studio/blocks/app-shell-search-dialog";
import { joinAppShellGovernedClassName } from "./wiring/governance";

export type AppShellHeaderGovernedComponents = Extract<
  GovernedUiComponentName,
  "Avatar" | "Button"
>;

interface AppShellHeaderProps {
  readonly chrome: ApplicationShellResolvedChrome;
  readonly identityAccessory?: ReactNode;
}

export function AppShellHeader({ chrome, identityAccessory }: AppShellHeaderProps) {
  const unreadNotificationCount = countDefaultAppShellUnreadNotifications();
  const notificationTriggerLabel =
    unreadNotificationCount > 0
      ? `Notifications, ${unreadNotificationCount} unread`
      : "Notifications";

  return (
    <header
      className={joinAppShellGovernedClassName(
        "app-shell-header-bar",
        "topbar",
        { density: chrome.density }
      )}
    >
      <div className="app-shell-header app-shell-header-grid">
        <div className="app-shell-header-leading">
          <AppShellMenuTrigger
            className="app-shell-menu-trigger"
            variant="outline"
          />
          <div className="app-shell-header-greeting">
            <p className="app-shell-header-greeting-title">
              Hey, {chrome.userName}
            </p>
            <p className="app-shell-header-greeting-subtitle">
              {chrome.welcomeMessage}
            </p>
          </div>
        </div>

        <AppShellSearchDialog
          className={joinAppShellGovernedClassName(
            "app-shell-search-dialog-desktop",
            "command-center",
            { density: chrome.density }
          )}
          trigger={
            <div className="app-shell-search-trigger-desktop">
              <SearchIcon
                aria-hidden
                className="app-shell-search-trigger-icon"
              />
              <span className="app-shell-search-trigger-label">
                {chrome.searchTriggerLabel}
              </span>
            </div>
          }
        />

        <div
          className={joinAppShellGovernedClassName(
            "app-shell-header-actions",
            "utility-bar",
            { density: chrome.density }
          )}
        >
          <AppShellSearchDialog
            className="app-shell-search-dialog-mobile"
            trigger={
              <Button {...mapStockButtonProps("ghost", "icon-lg")} type="button">
                <SearchIcon aria-hidden className="app-shell-header-action-icon" />
                <span className="sr-only">Search</span>
              </Button>
            }
          />
          <AppShellLanguageDropdown
            trigger={
              <Button {...mapStockButtonProps("ghost", "icon-lg")} type="button">
                <LanguagesIcon aria-hidden className="app-shell-header-action-icon" />
                <span className="sr-only">Language</span>
              </Button>
            }
          />
          <AppShellActivityDialog
            trigger={
              <Button {...mapStockButtonProps("ghost", "icon-lg")} type="button">
                <ActivityIcon aria-hidden className="app-shell-header-action-icon" />
                <span className="sr-only">Activity</span>
              </Button>
            }
          />
          <AppShellNotificationDropdown
            trigger={
              <div className="app-shell-notification-trigger">
                <Button
                  {...mapStockButtonProps("ghost", "icon-lg")}
                  aria-label={notificationTriggerLabel}
                  type="button"
                >
                  <BellIcon aria-hidden className="app-shell-header-action-icon" />
                </Button>
                {unreadNotificationCount > 0 ? (
                  <span
                    aria-hidden
                    className="app-shell-notification-unread-dot"
                  />
                ) : null}
              </div>
            }
          />
          <AppShellProfileDropdown
            avatarFallback={chrome.avatarFallback}
            avatarSrc={chrome.avatarSrc}
            displayName={chrome.userName}
            {...(chrome.email === undefined ? {} : { email: chrome.email })}
            trigger={
              <Button
                {...mapStockButtonProps("ghost", "icon-lg")}
                aria-label={`Profile: ${chrome.userName}`}
                type="button"
              >
                <Avatar>
                  <AvatarImage alt={chrome.userName} src={chrome.avatarSrc} />
                  <AvatarFallback>{chrome.avatarFallback}</AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          {identityAccessory}
        </div>
      </div>
    </header>
  );
}
