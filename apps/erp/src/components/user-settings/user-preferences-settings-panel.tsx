"use client";

import {
  type AppShellAccountSettings03TimezoneOption,
  AppShellAccountSettingsPanelSection,
  AppShellLanguageDropdown,
} from "@afenda/appshell";
import {
  USER_DISPLAY_DENSITY_VALUES,
  USER_DISPLAY_THEME_VALUES,
  type UserDisplayPreferences,
} from "@afenda/database";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useActionState, useId, useMemo, useState } from "react";

import {
  UPDATE_USER_PREFERENCES_SETTINGS_INTENT,
  type UpdateUserPreferencesSettingsActionState,
  updateUserPreferencesSettingsAction,
} from "@/lib/user-settings/update-user-preferences-settings.action";

const THEME_LABELS: Record<(typeof USER_DISPLAY_THEME_VALUES)[number], string> =
  {
    light: "Light",
    dark: "Dark",
    system: "System",
  };

const DENSITY_LABELS: Record<
  (typeof USER_DISPLAY_DENSITY_VALUES)[number],
  string
> = {
  comfortable: "Comfortable",
  compact: "Compact",
};

export interface UserPreferencesSettingsPanelProps {
  readonly initialPreferences: UserDisplayPreferences;
}

export type UserPreferencesSettingsPanelGovernedComponents = Extract<
  GovernedUiComponentName,
  | "Button"
  | "Command"
  | "CommandEmpty"
  | "CommandGroup"
  | "CommandInput"
  | "CommandItem"
  | "CommandList"
  | "DropdownMenu"
  | "Label"
  | "Popover"
  | "PopoverContent"
  | "PopoverTrigger"
  | "RadioGroup"
  | "RadioGroupItem"
>;

function UserPreferencesTimezoneField({
  onChange,
  pending,
  timezones,
  value,
}: {
  readonly onChange: (timezone: string) => void;
  readonly pending: boolean;
  readonly timezones: readonly AppShellAccountSettings03TimezoneOption[];
  readonly value: string;
}) {
  const fieldId = useId();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Label htmlFor={fieldId}>Timezone</Label>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={open}
            disabled={pending}
            emphasis="outline"
            id={fieldId}
            intent="secondary"
            presentation="default"
            size="md"
            type="button"
          >
            {timezones.find((tz) => tz.value === value)?.label ??
              "Select timezone"}
            <span aria-hidden>▾</span>
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
                      onChange(timezone.value);
                      setOpen(false);
                    }}
                    value={timezone.value}
                  >
                    {timezone.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function UserPreferencesSettingsPanel({
  initialPreferences,
}: UserPreferencesSettingsPanelProps) {
  const appearanceSectionId = useId();
  const languageSectionId = useId();
  const regionalSectionId = useId();

  const [theme, setTheme] = useState(initialPreferences.theme);
  const [density, setDensity] = useState(initialPreferences.density);
  const [locale, setLocale] = useState(initialPreferences.locale);
  const [timezone, setTimezone] = useState(initialPreferences.timezone);

  const [actionState, formAction, isPending] = useActionState(
    updateUserPreferencesSettingsAction,
    null satisfies UpdateUserPreferencesSettingsActionState
  );

  const timezones = useMemo(
    (): AppShellAccountSettings03TimezoneOption[] =>
      Intl.supportedValuesOf("timeZone").map((zone) => ({
        value: zone,
        label: zone.replace(/_/g, " "),
      })),
    []
  );

  const handleSave = () => {
    const formData = new FormData();
    formData.set("intent", UPDATE_USER_PREFERENCES_SETTINGS_INTENT);
    formData.set(
      "payload",
      JSON.stringify({
        theme,
        density,
        locale,
        timezone,
      } satisfies UserDisplayPreferences)
    );
    formAction(formData);
  };

  return (
    <div className="app-shell-studio-account-settings-06__sections">
      <AppShellAccountSettingsPanelSection
        description="Choose how Afenda looks on your devices."
        title="Appearance"
        titleId={appearanceSectionId}
      >
        <div className="erp-system-admin-settings-form">
          <div>
            <Label>Theme</Label>
            <RadioGroup
              onValueChange={(value) => {
                if (
                  USER_DISPLAY_THEME_VALUES.includes(
                    value as UserDisplayPreferences["theme"]
                  )
                ) {
                  setTheme(value as UserDisplayPreferences["theme"]);
                }
              }}
              value={theme}
            >
              {USER_DISPLAY_THEME_VALUES.map((option) => {
                const optionId = `${appearanceSectionId}-theme-${option}`;
                return (
                  <div
                    className="erp-system-admin-invite-wizard__role-option"
                    key={option}
                  >
                    <RadioGroupItem id={optionId} value={option} />
                    <Label htmlFor={optionId}>{THEME_LABELS[option]}</Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
          <div>
            <Label>Density</Label>
            <RadioGroup
              onValueChange={(value) => {
                if (
                  USER_DISPLAY_DENSITY_VALUES.includes(
                    value as UserDisplayPreferences["density"]
                  )
                ) {
                  setDensity(value as UserDisplayPreferences["density"]);
                }
              }}
              value={density}
            >
              {USER_DISPLAY_DENSITY_VALUES.map((option) => {
                const optionId = `${appearanceSectionId}-density-${option}`;
                return (
                  <div
                    className="erp-system-admin-invite-wizard__role-option"
                    key={option}
                  >
                    <RadioGroupItem id={optionId} value={option} />
                    <Label htmlFor={optionId}>{DENSITY_LABELS[option]}</Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        </div>
      </AppShellAccountSettingsPanelSection>

      <AppShellAccountSettingsPanelSection
        description="Set the language used across menus and labels."
        title="Language"
        titleId={languageSectionId}
      >
        <AppShellLanguageDropdown
          defaultLanguage={locale}
          menuLabel="Display language"
          onLanguageChange={setLocale}
          trigger={
            <Button
              disabled={isPending}
              emphasis="outline"
              intent="secondary"
              presentation="default"
              size="md"
              type="button"
            >
              Change language
            </Button>
          }
        />
      </AppShellAccountSettingsPanelSection>

      <AppShellAccountSettingsPanelSection
        description="Used for dates, times, and scheduled notifications."
        title="Regional"
        titleId={regionalSectionId}
      >
        <UserPreferencesTimezoneField
          onChange={setTimezone}
          pending={isPending}
          timezones={timezones}
          value={timezone}
        />
      </AppShellAccountSettingsPanelSection>

      <div className="erp-system-admin-settings-form__actions">
        <Button
          disabled={isPending}
          intent="primary"
          onClick={handleSave}
          presentation="default"
          size="md"
          type="button"
        >
          Save preferences
        </Button>
      </div>

      {actionState && !actionState.ok ? (
        <p className="erp-system-admin-settings-form__message" role="alert">
          {actionState.userMessage}
        </p>
      ) : null}
      {actionState?.ok ? (
        <p className="erp-system-admin-settings-form__message" role="status">
          Preference settings saved.
        </p>
      ) : null}
    </div>
  );
}
