"use client";

import { useState, type ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  DEFAULT_APP_SHELL_LANGUAGE_ID,
  defaultAppShellLanguages,
  type AppShellLanguageOption,
} from "../data/app-shell.language.data";

const DEFAULT_MENU_LABEL = "Language";

export type AppShellLanguageDropdownGovernedComponents = Extract<
  GovernedUiComponentName,
  "DropdownMenu"
>;

export interface AppShellLanguageDropdownProps {
  readonly trigger: ReactNode;
  readonly defaultOpen?: boolean;
  readonly align?: "start" | "center" | "end";
  /** Language options. Defaults to ERP locale list from `defaultAppShellLanguages`. */
  readonly languages?: readonly AppShellLanguageOption[];
  /** Initial / controlled selection id (e.g. `en`, `de`). */
  readonly defaultLanguage?: string;
  /** Accessible label for the menu section. */
  readonly menuLabel?: string;
  /** Fired when the user selects a language. */
  readonly onLanguageChange?: (languageId: string) => void;
}

function languageMenuLabel(option: AppShellLanguageOption): string {
  return option.nativeLabel ?? option.label;
}

function languageAccessibleName(option: AppShellLanguageOption): string {
  if (option.nativeLabel !== undefined && option.nativeLabel !== option.label) {
    return `${option.label} (${option.nativeLabel})`;
  }
  return option.label;
}

export function AppShellLanguageDropdown({
  defaultOpen,
  align = "end",
  trigger,
  languages = defaultAppShellLanguages,
  defaultLanguage = DEFAULT_APP_SHELL_LANGUAGE_ID,
  menuLabel = DEFAULT_MENU_LABEL,
  onLanguageChange,
}: AppShellLanguageDropdownProps) {
  const resolvedDefault =
    languages.some((language) => language.id === defaultLanguage)
      ? defaultLanguage
      : (languages[0]?.id ?? DEFAULT_APP_SHELL_LANGUAGE_ID);

  const [language, setLanguage] = useState(resolvedDefault);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    onLanguageChange?.(value);
  };

  return (
    <DropdownMenu {...(defaultOpen === undefined ? {} : { defaultOpen })}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuLabel>
          <span className="app-shell-language-menu-label" id="app-shell-language-menu-label">
            {menuLabel}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup onValueChange={handleLanguageChange} value={language}>
          {languages.map((option) => (
            <DropdownMenuRadioItem
              aria-label={languageAccessibleName(option)}
              key={option.id}
              value={option.id}
            >
              {languageMenuLabel(option)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
