"use client";

import {
  Checkbox,
  Label,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { CircleQuestionMarkIcon } from "lucide-react";
import { useId } from "react";

import { AppShellAccountSettingsPanelSection } from "../../app-shell-account-settings-panel-section";

export interface AppShellAccountSettings02BrowserItem {
  readonly checked: boolean;
  readonly id: string;
  readonly label: string;
}

export interface AppShellAccountSettings02BrowserNotificationProps {
  readonly items: readonly AppShellAccountSettings02BrowserItem[];
  readonly onItemChange?: (id: string, checked: boolean) => void;
  readonly onPlaySoundChange?: (enabled: boolean) => void;
  readonly pending?: boolean;
  readonly playSoundOnBlink: boolean;
}

export function AppShellAccountSettings02BrowserNotification({
  items,
  onItemChange,
  onPlaySoundChange,
  pending = false,
  playSoundOnBlink,
}: AppShellAccountSettings02BrowserNotificationProps) {
  const sectionId = useId();
  const playSoundId = `${sectionId}-play-sound`;

  return (
    <AppShellAccountSettingsPanelSection
      description="Manage your browser notification settings and preferences."
      title="Browser notifications"
      titleId={sectionId}
    >
      <div className="app-shell-studio-account-settings-02__checkbox-list">
        {items.map((item) => {
          const controlId = `${sectionId}-${item.id}`;

          return (
            <div
              className="app-shell-studio-account-settings-02__checkbox-row"
              key={item.id}
            >
              <Checkbox
                checked={item.checked}
                disabled={pending || !onItemChange}
                id={controlId}
                {...(onItemChange
                  ? {
                      onCheckedChange: (checked: boolean | "indeterminate") =>
                        onItemChange(item.id, checked === true),
                    }
                  : {})}
              />
              <Label htmlFor={controlId}>{item.label}</Label>
            </div>
          );
        })}
      </div>
      <div className="app-shell-studio-account-settings-02__sound-row">
        <p className="app-shell-studio-account-settings-02__sound-label">
          Play sound when your tab blinks
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                aria-label="Play sound on alert help"
                className="app-shell-studio-account-settings-02__help-trigger"
                type="button"
              >
                <CircleQuestionMarkIcon
                  aria-hidden
                  className="app-shell-studio-account-settings-06__status-icon"
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Play sound on alert</p>
            </TooltipContent>
          </Tooltip>
        </p>
        <Switch
          aria-busy={pending}
          checked={playSoundOnBlink}
          disabled={pending || !onPlaySoundChange}
          id={playSoundId}
          {...(onPlaySoundChange ? { onCheckedChange: onPlaySoundChange } : {})}
          size="md"
        />
      </div>
    </AppShellAccountSettingsPanelSection>
  );
}

export type AppShellAccountSettings02BrowserNotificationGovernedComponents =
  Extract<
    GovernedUiComponentName,
    | "Checkbox"
    | "Label"
    | "Switch"
    | "Tooltip"
    | "TooltipContent"
    | "TooltipTrigger"
  >;
