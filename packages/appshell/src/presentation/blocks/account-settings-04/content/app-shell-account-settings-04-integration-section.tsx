"use client";

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { CheckIcon, ChevronRightIcon, LinkIcon } from "lucide-react";

import { AppShellAccountSettingsPanelSection } from "../../app-shell-account-settings-panel-section";

export interface AppShellAccountSettings04IntegrationApp {
  readonly connected: boolean;
  readonly description: string;
  readonly dialogDescription?: string;
  readonly dialogFeatures?: readonly string[];
  readonly dialogSubtitle?: string;
  readonly id: string;
  readonly imageUrl?: string;
  readonly name: string;
  readonly pricingLabel?: string;
}

export interface AppShellAccountSettings04IntegrationSectionProps {
  readonly apps: readonly AppShellAccountSettings04IntegrationApp[];
  readonly description: string;
  readonly onConnectToggle?: (appId: string, connected: boolean) => void;
  readonly onInstall?: (appId: string) => void;
  readonly pending?: boolean;
  readonly title: string;
}

export function AppShellAccountSettings04IntegrationSection({
  apps,
  description,
  onConnectToggle,
  onInstall,
  pending = false,
  title,
}: AppShellAccountSettings04IntegrationSectionProps) {
  return (
    <AppShellAccountSettingsPanelSection
      description={description}
      title={title}
    >
      <div className="app-shell-studio-account-settings-04__grid">
        {apps.map((app) => (
          <Card key={app.id}>
            <div className="app-shell-studio-account-settings-04__card">
              <div className="app-shell-studio-account-settings-04__card-header">
                <Avatar>
                  <AvatarFallback>
                    {app.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- consumer brand asset
                      <img alt="" src={app.imageUrl} />
                    ) : (
                      app.name.slice(0, 2).toUpperCase()
                    )}
                  </AvatarFallback>
                </Avatar>
                <Button
                  aria-label={`Toggle connect for ${app.name}`}
                  disabled={pending || !onConnectToggle}
                  emphasis="outline"
                  intent={app.connected ? "primary" : "secondary"}
                  onClick={() => onConnectToggle?.(app.id, !app.connected)}
                  presentation="default"
                  size="sm"
                  type="button"
                >
                  {app.connected ? (
                    <CheckIcon aria-hidden />
                  ) : (
                    <LinkIcon aria-hidden />
                  )}
                  {app.connected ? "Connected" : "Connect"}
                </Button>
              </div>
              <div>
                <p className="app-shell-studio-account-settings-02__item-title">
                  {app.name}
                </p>
                <p className="app-shell-studio-account-settings-06__description">
                  {app.description}
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    emphasis="outline"
                    intent="secondary"
                    presentation="default"
                    size="sm"
                    type="button"
                  >
                    View integration
                    <ChevronRightIcon aria-hidden />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <div className="app-shell-studio-account-settings-04__dialog-header">
                    <Avatar>
                      <AvatarFallback>
                        {app.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element -- consumer brand asset
                          <img alt="" src={app.imageUrl} />
                        ) : (
                          app.name.slice(0, 2).toUpperCase()
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle>{app.name}</DialogTitle>
                      <DialogDescription>
                        {app.dialogSubtitle ?? app.description}
                      </DialogDescription>
                      {app.pricingLabel ? (
                        <Badge emphasis="soft" tone="info">
                          {app.pricingLabel}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                  {app.dialogDescription ? (
                    <p className="app-shell-studio-account-settings-06__description">
                      {app.dialogDescription}
                    </p>
                  ) : null}
                  {app.dialogFeatures && app.dialogFeatures.length > 0 ? (
                    <ul className="app-shell-studio-account-settings-04__feature-list">
                      {app.dialogFeatures.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  ) : null}
                  {onInstall ? (
                    <Button
                      disabled={pending}
                      emphasis="solid"
                      intent="primary"
                      onClick={() => onInstall(app.id)}
                      presentation="default"
                      size="md"
                      type="button"
                    >
                      Install integration
                    </Button>
                  ) : null}
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        ))}
      </div>
    </AppShellAccountSettingsPanelSection>
  );
}

export type AppShellAccountSettings04IntegrationSectionGovernedComponents =
  Extract<
    GovernedUiComponentName,
    | "Avatar"
    | "AvatarFallback"
    | "Badge"
    | "Button"
    | "Card"
    | "Dialog"
    | "DialogContent"
    | "DialogDescription"
    | "DialogTitle"
    | "DialogTrigger"
  >;
