/**
 * ADR-0001 AppShell command-center authority — header search, notifications, and palette slots.
 * Serializable descriptors only (no ReactNode / ComponentType in contract surface).
 */

export const APPSHELL_HEADER_COMMAND_CENTER_SLOTS = [
  "search",
  "notifications",
  "activity",
  "language",
  "profile",
  "context-switcher",
] as const;

export type AppShellHeaderCommandCenterSlot =
  (typeof APPSHELL_HEADER_COMMAND_CENTER_SLOTS)[number];

export function isAppShellHeaderCommandCenterSlot(
  value: string
): value is AppShellHeaderCommandCenterSlot {
  return (APPSHELL_HEADER_COMMAND_CENTER_SLOTS as readonly string[]).includes(
    value
  );
}

/** Governed primitives for AppShell header chrome. */
export type AppShellHeaderGovernedComponentName = "Avatar" | "Button";

export const APPSHELL_HEADER_GOVERNED_COMPONENT_NAMES = [
  "Avatar",
  "Button",
] as const satisfies readonly AppShellHeaderGovernedComponentName[];

/** Governed primitives for search dialog composition. */
export type AppShellSearchDialogGovernedComponentName =
  | "Avatar"
  | "Badge"
  | "Dialog"
  | "Kbd";

export const APPSHELL_SEARCH_DIALOG_GOVERNED_COMPONENT_NAMES = [
  "Avatar",
  "Badge",
  "Dialog",
  "Kbd",
] as const satisfies readonly AppShellSearchDialogGovernedComponentName[];

export type AppShellSearchUserStatusTone =
  | "danger"
  | "info"
  | "neutral"
  | "success"
  | "warning";

export interface AppShellSearchSuggestionDescriptor {
  readonly iconId: string;
  readonly id: string;
  readonly label: string;
}

export interface AppShellSearchParticipantDescriptor {
  readonly alt: string;
  readonly fallback: string;
  readonly src: string;
}

export interface AppShellSearchInteractionDescriptor {
  readonly description: string;
  readonly id: string;
  readonly logoSrc: string;
  readonly name: string;
  readonly participants: readonly AppShellSearchParticipantDescriptor[];
}

export interface AppShellSearchUserDescriptor {
  readonly avatarSrc: string;
  readonly email: string;
  readonly fallback: string;
  readonly id: string;
  readonly name: string;
  readonly status: string;
  readonly statusTone: AppShellSearchUserStatusTone;
}

/** Serializable search dialog copy and labels — host owns trigger rendering. */
export interface AppShellCommandCenterSearchLabels {
  readonly closeHint?: string;
  readonly dialogTitle?: string;
  readonly emptyMessage?: string;
  readonly interactionsLabel?: string;
  readonly navigateHint?: string;
  readonly participantOverflowLabel?: string;
  readonly placeholder?: string;
  readonly resultsLabel?: string;
  readonly searchLabel?: string;
  readonly selectHint?: string;
  readonly suggestionsLabel?: string;
  readonly usersLabel?: string;
}

/** Frozen default search copy keys (runtime defaults live in app-shell.search.data). */
export const APPSHELL_COMMAND_CENTER_SEARCH_LABEL_KEYS = [
  "closeHint",
  "dialogTitle",
  "emptyMessage",
  "interactionsLabel",
  "navigateHint",
  "participantOverflowLabel",
  "placeholder",
  "resultsLabel",
  "searchLabel",
  "selectHint",
  "suggestionsLabel",
  "usersLabel",
] as const;

export type AppShellCommandCenterSearchLabelKey =
  (typeof APPSHELL_COMMAND_CENTER_SEARCH_LABEL_KEYS)[number];
