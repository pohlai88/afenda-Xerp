"use client";

import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useId, useState } from "react";

import { AppShellAccountSettingsPanelSection } from "../../app-shell-account-settings-panel-section";

export interface AppShellAccountSettings03TimezoneOption {
  readonly label: string;
  readonly value: string;
}

export interface AppShellAccountSettings03WorkspaceNameProps {
  readonly appId: string;
  readonly onSave?: () => void;
  readonly onTimezoneChange?: (timezone: string) => void;
  readonly onWorkspaceNameChange?: (name: string) => void;
  readonly pending?: boolean;
  readonly timezones: readonly AppShellAccountSettings03TimezoneOption[];
  readonly timezoneValue: string;
  readonly workspaceName: string;
}

export function AppShellAccountSettings03WorkspaceName({
  appId,
  onSave,
  onTimezoneChange,
  onWorkspaceNameChange,
  pending = false,
  timezones,
  timezoneValue,
  workspaceName,
}: AppShellAccountSettings03WorkspaceNameProps) {
  const sectionId = useId();
  const workspaceNameId = `${sectionId}-workspace-name`;
  const appIdControlId = `${sectionId}-app-id`;
  const [open, setOpen] = useState(false);

  return (
    <AppShellAccountSettingsPanelSection
      description="Manage your workspace name and time zone settings."
      title="Workspace name & timezone"
      titleId={sectionId}
    >
      <div className="app-shell-studio-account-settings-03__form-stack">
        <div className="app-shell-studio-account-settings-03__field">
          <Label htmlFor={workspaceNameId}>Workspace name</Label>
          <Input
            disabled={pending || !onWorkspaceNameChange}
            id={workspaceNameId}
            onChange={(event) =>
              onWorkspaceNameChange?.(event.currentTarget.value)
            }
            value={workspaceName}
          />
        </div>
        <div className="app-shell-studio-account-settings-03__field">
          <Label htmlFor={appIdControlId}>App ID</Label>
          <Input id={appIdControlId} readOnly value={appId} />
        </div>
        <div className="app-shell-studio-account-settings-03__field">
          <Label htmlFor={sectionId}>Timezone</Label>
          <Popover onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild>
              <Button
                aria-expanded={open}
                disabled={pending || !onTimezoneChange}
                emphasis="outline"
                intent="secondary"
                presentation="default"
                size="md"
                type="button"
              >
                {timezones.find((tz) => tz.value === timezoneValue)?.label ??
                  "Select timezone"}
                <ChevronsUpDownIcon aria-hidden />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Command>
                <CommandInput placeholder="Search timezone..." />
                <CommandList>
                  <CommandEmpty>No timezone found.</CommandEmpty>
                  <CommandGroup>
                    {timezones.map((timezone) => (
                      <CommandItem
                        key={timezone.value}
                        onSelect={() => {
                          onTimezoneChange?.(timezone.value);
                          setOpen(false);
                        }}
                        value={timezone.value}
                      >
                        {timezone.label}
                        {timezoneValue === timezone.value ? (
                          <CheckIcon aria-hidden />
                        ) : null}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        {onSave ? (
          <div className="app-shell-studio-account-settings-02__save-row">
            <Button
              aria-busy={pending}
              disabled={pending}
              emphasis="solid"
              intent="primary"
              onClick={onSave}
              presentation="default"
              size="md"
              type="button"
            >
              Save changes
            </Button>
          </div>
        ) : null}
      </div>
    </AppShellAccountSettingsPanelSection>
  );
}

export type AppShellAccountSettings03WorkspaceNameGovernedComponents = Extract<
  GovernedUiComponentName,
  | "Button"
  | "Command"
  | "CommandEmpty"
  | "CommandGroup"
  | "CommandInput"
  | "CommandItem"
  | "CommandList"
  | "Input"
  | "Label"
  | "Popover"
  | "PopoverContent"
  | "PopoverTrigger"
>;
