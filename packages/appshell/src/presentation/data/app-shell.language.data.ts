export interface AppShellLanguageOption {
  readonly id: string;
  /** Accessible language name in the UI locale (typically English). */
  readonly label: string;
  /** Endonym shown in the menu when different from `label`. */
  readonly nativeLabel?: string;
}

const erpLanguageSource = [
  { id: "en", label: "English" },
  { id: "de", label: "German", nativeLabel: "Deutsch" },
  { id: "es", label: "Spanish", nativeLabel: "Español" },
  { id: "pt", label: "Portuguese", nativeLabel: "Português" },
  { id: "ko", label: "Korean", nativeLabel: "한국어" },
  { id: "zh", label: "Chinese", nativeLabel: "中文" },
] satisfies readonly AppShellLanguageOption[];

export const defaultAppShellLanguages: readonly AppShellLanguageOption[] =
  erpLanguageSource;

export const DEFAULT_APP_SHELL_LANGUAGE_ID = "en";
