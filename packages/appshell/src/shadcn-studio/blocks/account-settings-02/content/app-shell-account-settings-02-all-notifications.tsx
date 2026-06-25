"use client";

import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { MailIcon, MonitorIcon, TabletSmartphoneIcon } from "lucide-react";
import { Fragment, useId } from "react";

import { AppShellAccountSettingsPanelSection } from "../../app-shell-account-settings-panel-section";

export type AppShellAccountSettings02NotificationChannel =
  | "app"
  | "desktop"
  | "email";

export interface AppShellAccountSettings02NotificationChannels {
  readonly app: boolean;
  readonly desktop: boolean;
  readonly email: boolean;
}

export interface AppShellAccountSettings02NotificationItem {
  readonly channels: AppShellAccountSettings02NotificationChannels;
  readonly description?: string;
  readonly id: string;
  readonly title: string;
}

export interface AppShellAccountSettings02NotificationSection {
  readonly id: string;
  readonly items: readonly AppShellAccountSettings02NotificationItem[];
  readonly title: string;
}

export interface AppShellAccountSettings02AllNotificationsProps {
  readonly onChannelToggle?: (
    sectionId: string,
    itemId: string,
    channel: AppShellAccountSettings02NotificationChannel,
    enabled: boolean
  ) => void;
  readonly onColumnToggle?: (
    channel: AppShellAccountSettings02NotificationChannel,
    enabled: boolean
  ) => void;
  readonly pending?: boolean;
  readonly sections: readonly AppShellAccountSettings02NotificationSection[];
}

function columnAllEnabled(
  sections: readonly AppShellAccountSettings02NotificationSection[],
  channel: AppShellAccountSettings02NotificationChannel
): boolean {
  return sections.every((section) =>
    section.items.every((item) => item.channels[channel])
  );
}

export function AppShellAccountSettings02AllNotifications({
  onChannelToggle,
  onColumnToggle,
  pending = false,
  sections,
}: AppShellAccountSettings02AllNotificationsProps) {
  const sectionId = useId();
  const emailAll = columnAllEnabled(sections, "email");
  const desktopAll = columnAllEnabled(sections, "desktop");
  const appAll = columnAllEnabled(sections, "app");

  return (
    <AppShellAccountSettingsPanelSection
      description="Manage your notification settings and preferences."
      title="Notifications"
      titleId={sectionId}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <span className="app-shell-studio-account-settings-02__table-heading">
                Notify me about
              </span>
            </TableHead>
            <TableHead>
              <div className="app-shell-studio-account-settings-02__channel-head">
                <MailIcon aria-hidden />
                <span>Email</span>
                <Button
                  disabled={pending || !onColumnToggle}
                  emphasis="ghost"
                  intent="secondary"
                  onClick={() => onColumnToggle?.("email", !emailAll)}
                  presentation="default"
                  size="sm"
                  type="button"
                >
                  Toggle all
                </Button>
              </div>
            </TableHead>
            <TableHead>
              <div className="app-shell-studio-account-settings-02__channel-head">
                <MonitorIcon aria-hidden />
                <span>Desktop</span>
                <Button
                  disabled={pending || !onColumnToggle}
                  emphasis="ghost"
                  intent="secondary"
                  onClick={() => onColumnToggle?.("desktop", !desktopAll)}
                  presentation="default"
                  size="sm"
                  type="button"
                >
                  Toggle all
                </Button>
              </div>
            </TableHead>
            <TableHead>
              <div className="app-shell-studio-account-settings-02__channel-head">
                <TabletSmartphoneIcon aria-hidden />
                <span>App</span>
                <Button
                  disabled={pending || !onColumnToggle}
                  emphasis="ghost"
                  intent="secondary"
                  onClick={() => onColumnToggle?.("app", !appAll)}
                  presentation="default"
                  size="sm"
                  type="button"
                >
                  Toggle all
                </Button>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sections.map((section) => (
            <Fragment key={section.id}>
              <TableRow>
                <TableCell>
                  <span className="app-shell-studio-account-settings-02__section-label">
                    {section.title}
                  </span>
                </TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
              {section.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="app-shell-studio-account-settings-02__item-copy">
                      <p className="app-shell-studio-account-settings-02__item-title">
                        {item.title}
                      </p>
                      {item.description ? (
                        <p className="app-shell-studio-account-settings-06__description">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </TableCell>
                  {(["email", "desktop", "app"] as const).map((channel) => (
                    <TableCell key={channel}>
                      <div className="app-shell-studio-account-settings-02__channel-cell">
                        <Checkbox
                          aria-label={`${item.title} ${channel}`}
                          checked={item.channels[channel]}
                          disabled={pending || !onChannelToggle}
                          onCheckedChange={(checked) =>
                            onChannelToggle?.(
                              section.id,
                              item.id,
                              channel,
                              checked === true
                            )
                          }
                        />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </AppShellAccountSettingsPanelSection>
  );
}

export type AppShellAccountSettings02AllNotificationsGovernedComponents =
  Extract<
    GovernedUiComponentName,
    | "Button"
    | "Checkbox"
    | "Table"
    | "TableBody"
    | "TableCell"
    | "TableHead"
    | "TableHeader"
    | "TableRow"
  >;
