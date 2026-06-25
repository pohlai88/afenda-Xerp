"use client";

import {
  Button,
  Card,
  Input,
  Label,
  Separator,
  ToggleGroup,
  ToggleGroupItem,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { BellIcon, BellOffIcon } from "lucide-react";
import { useId } from "react";

import { AppShellAccountSettingsPanelSection } from "../../app-shell-account-settings-panel-section";

export interface AppShellAccountSettings02DndDay {
  readonly label: string;
  readonly value: string;
}

export interface AppShellAccountSettings02DoNotDisturbProps {
  readonly daysOff: readonly string[];
  readonly dndEnabled: boolean;
  readonly fromTime: string;
  readonly onDaysOffChange?: (days: readonly string[]) => void;
  readonly onDndEnabledChange?: (enabled: boolean) => void;
  readonly onTimeChange?: (field: "from" | "to", value: string) => void;
  readonly pending?: boolean;
  readonly toTime: string;
  readonly weekDays: readonly AppShellAccountSettings02DndDay[];
}

export function AppShellAccountSettings02DoNotDisturb({
  daysOff,
  dndEnabled,
  fromTime,
  onDaysOffChange,
  onDndEnabledChange,
  onTimeChange,
  pending = false,
  toTime,
  weekDays,
}: AppShellAccountSettings02DoNotDisturbProps) {
  const sectionId = useId();
  const fromId = `${sectionId}-from`;
  const toId = `${sectionId}-to`;

  return (
    <AppShellAccountSettingsPanelSection
      description="Adjust your Do Not Disturb settings and preferences."
      title="Do not disturb"
      titleId={sectionId}
    >
      <Card>
        <div className="app-shell-studio-account-settings-06__panel">
          <div className="app-shell-studio-account-settings-02__dnd-toolbar">
            <div className="app-shell-studio-account-settings-02__dnd-field">
              <Label>Notifications</Label>
              <Button
                aria-busy={pending}
                disabled={pending || !onDndEnabledChange}
                emphasis="outline"
                intent="secondary"
                onClick={() => onDndEnabledChange?.(!dndEnabled)}
                presentation="default"
                size="sm"
                type="button"
              >
                {dndEnabled ? (
                  <BellOffIcon aria-hidden />
                ) : (
                  <BellIcon aria-hidden />
                )}
                {dndEnabled ? "Disable notifications" : "Enable notifications"}
              </Button>
            </div>
            <div className="app-shell-studio-account-settings-02__dnd-times">
              <div className="app-shell-studio-account-settings-02__dnd-field">
                <Label htmlFor={fromId}>From</Label>
                <Input
                  defaultValue={fromTime}
                  disabled={pending || !onTimeChange}
                  id={fromId}
                  onChange={(event) =>
                    onTimeChange?.("from", event.currentTarget.value)
                  }
                  type="time"
                />
              </div>
              <div className="app-shell-studio-account-settings-02__dnd-field">
                <Label htmlFor={toId}>To</Label>
                <Input
                  defaultValue={toTime}
                  disabled={pending || !onTimeChange}
                  id={toId}
                  onChange={(event) =>
                    onTimeChange?.("to", event.currentTarget.value)
                  }
                  type="time"
                />
              </div>
            </div>
          </div>
          <Separator />
          <div className="app-shell-studio-account-settings-02__dnd-days">
            <Label>Do not disturb me on my days off</Label>
            <ToggleGroup
              disabled={pending || !onDaysOffChange}
              type="multiple"
              value={[...daysOff]}
              {...(onDaysOffChange
                ? { onValueChange: (value: string[]) => onDaysOffChange(value) }
                : {})}
            >
              {weekDays.map((day) => (
                <ToggleGroupItem key={day.value} value={day.value}>
                  {day.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
      </Card>
    </AppShellAccountSettingsPanelSection>
  );
}

export type AppShellAccountSettings02DoNotDisturbGovernedComponents = Extract<
  GovernedUiComponentName,
  | "Button"
  | "Card"
  | "Input"
  | "Label"
  | "Separator"
  | "ToggleGroup"
  | "ToggleGroupItem"
>;
