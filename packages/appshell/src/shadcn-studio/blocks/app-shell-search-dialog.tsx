"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  Badge,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Kbd,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MoreVerticalIcon,
  SearchIcon,
  Undo2Icon,
} from "lucide-react";
import { type ChangeEvent, type ReactNode, useState } from "react";

import {
  type AppShellSearchInteraction,
  type AppShellSearchSuggestion,
  type AppShellSearchUser,
  DEFAULT_APP_SHELL_PARTICIPANT_OVERFLOW_LABEL,
  DEFAULT_APP_SHELL_SEARCH_CLOSE_HINT,
  DEFAULT_APP_SHELL_SEARCH_DIALOG_TITLE,
  DEFAULT_APP_SHELL_SEARCH_EMPTY_MESSAGE,
  DEFAULT_APP_SHELL_SEARCH_INTERACTIONS_LABEL,
  DEFAULT_APP_SHELL_SEARCH_NAVIGATE_HINT,
  DEFAULT_APP_SHELL_SEARCH_PLACEHOLDER,
  DEFAULT_APP_SHELL_SEARCH_RESULTS_LABEL,
  DEFAULT_APP_SHELL_SEARCH_SELECT_HINT,
  DEFAULT_APP_SHELL_SEARCH_SUGGESTIONS_LABEL,
  DEFAULT_APP_SHELL_SEARCH_USERS_LABEL,
  defaultAppShellSearchInteractions,
  defaultAppShellSearchSuggestions,
  defaultAppShellSearchUsers,
  filterAppShellSearchInteractions,
  filterAppShellSearchSuggestions,
  filterAppShellSearchUsers,
  formatAppShellSearchResultsLiveMessage,
} from "../data/app-shell.search.data";

const SEARCH_INPUT_ID = "app-shell-search-input";

export type AppShellSearchDialogGovernedComponents = Extract<
  GovernedUiComponentName,
  "Avatar" | "Badge" | "Dialog" | "Kbd"
>;

export interface AppShellSearchDialogProps {
  /** Layout wrapper for trigger placement (e.g. responsive visibility). */
  readonly className?: string;
  readonly closeHint?: string;
  readonly defaultOpen?: boolean;
  readonly dialogTitle?: string;
  readonly emptyMessage?: string;
  readonly interactions?: readonly AppShellSearchInteraction[];
  readonly interactionsLabel?: string;
  readonly navigateHint?: string;
  readonly onResultSelect?: (resultId: string) => void;
  readonly participantOverflowLabel?: string;
  readonly placeholder?: string;
  readonly resultsLabel?: string;
  readonly searchLabel?: string;
  readonly selectHint?: string;
  readonly suggestions?: readonly AppShellSearchSuggestion[];
  readonly suggestionsLabel?: string;
  readonly trigger: ReactNode;
  readonly users?: readonly AppShellSearchUser[];
  readonly usersLabel?: string;
}

function SearchSuggestionRow({
  item,
  onSelect,
}: {
  readonly item: AppShellSearchSuggestion;
  readonly onSelect: () => void;
}) {
  return (
    <li>
      <button
        className="app-shell-search-result"
        onClick={onSelect}
        type="button"
      >
        <item.Icon aria-hidden className="app-shell-search-suggestion-icon" />
        <span>{item.label}</span>
      </button>
    </li>
  );
}

function SearchInteractionRow({
  item,
  overflowLabel,
  onSelect,
}: {
  readonly item: AppShellSearchInteraction;
  readonly overflowLabel: string;
  readonly onSelect: () => void;
}) {
  return (
    <li>
      <button
        className="app-shell-search-result"
        onClick={onSelect}
        type="button"
      >
        <Avatar>
          <AvatarImage alt={item.name} src={item.logoSrc} />
          <AvatarFallback>{item.name.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div className="app-shell-search-result-copy">
          <span className="app-shell-search-result-title">{item.name}</span>
          <span className="app-shell-search-result-subtitle">
            {item.description}
          </span>
        </div>
        <AvatarGroup>
          {item.participants.map((participant) => (
            <Avatar key={participant.alt}>
              <AvatarImage alt={participant.alt} src={participant.src} />
              <AvatarFallback>{participant.fallback}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>{overflowLabel}</AvatarGroupCount>
        </AvatarGroup>
      </button>
    </li>
  );
}

function SearchUserRow({
  item,
  onSelect,
}: {
  readonly item: AppShellSearchUser;
  readonly onSelect: () => void;
}) {
  return (
    <li>
      <button
        className="app-shell-search-result"
        onClick={onSelect}
        type="button"
      >
        <Avatar>
          <AvatarImage alt={item.name} src={item.avatarSrc} />
          <AvatarFallback>{item.fallback}</AvatarFallback>
        </Avatar>
        <div className="app-shell-search-result-copy">
          <span className="app-shell-search-result-title">{item.name}</span>
          <span className="app-shell-search-result-subtitle-light">
            {item.email}
          </span>
        </div>
        <Badge emphasis="soft" tone={item.statusTone}>
          {item.status}
        </Badge>
        <MoreVerticalIcon
          aria-hidden
          className="app-shell-search-result-more-icon"
        />
      </button>
    </li>
  );
}

function SearchKeyboardHints({
  closeHint,
  navigateHint,
  selectHint,
}: {
  readonly closeHint: string;
  readonly selectHint: string;
  readonly navigateHint: string;
}) {
  return (
    <div className="app-shell-search-footer">
      <div className="app-shell-search-footer-hint-row">
        <Kbd>esc</Kbd>
        <span>{closeHint}</span>
      </div>
      <div className="app-shell-search-footer-hint-group">
        <div className="app-shell-search-keycap">
          <Undo2Icon aria-hidden className="app-shell-search-keycap-icon" />
        </div>
        <span>{selectHint}</span>
      </div>
      <div className="app-shell-search-footer-hint-group">
        <div className="app-shell-search-keycap">
          <ArrowUpIcon aria-hidden className="app-shell-search-keycap-icon" />
        </div>
        <div className="app-shell-search-keycap">
          <ArrowDownIcon aria-hidden className="app-shell-search-keycap-icon" />
        </div>
        <span>{navigateHint}</span>
      </div>
    </div>
  );
}

export function AppShellSearchCommand({
  placeholder = DEFAULT_APP_SHELL_SEARCH_PLACEHOLDER,
  emptyMessage = DEFAULT_APP_SHELL_SEARCH_EMPTY_MESSAGE,
  resultsLabel = DEFAULT_APP_SHELL_SEARCH_RESULTS_LABEL,
  searchLabel = DEFAULT_APP_SHELL_SEARCH_DIALOG_TITLE,
  suggestionsLabel = DEFAULT_APP_SHELL_SEARCH_SUGGESTIONS_LABEL,
  interactionsLabel = DEFAULT_APP_SHELL_SEARCH_INTERACTIONS_LABEL,
  usersLabel = DEFAULT_APP_SHELL_SEARCH_USERS_LABEL,
  closeHint = DEFAULT_APP_SHELL_SEARCH_CLOSE_HINT,
  selectHint = DEFAULT_APP_SHELL_SEARCH_SELECT_HINT,
  navigateHint = DEFAULT_APP_SHELL_SEARCH_NAVIGATE_HINT,
  participantOverflowLabel = DEFAULT_APP_SHELL_PARTICIPANT_OVERFLOW_LABEL,
  suggestions = defaultAppShellSearchSuggestions,
  interactions = defaultAppShellSearchInteractions,
  users = defaultAppShellSearchUsers,
  onResultSelect,
  onClose,
}: {
  readonly placeholder?: string;
  readonly emptyMessage?: string;
  readonly resultsLabel?: string;
  readonly searchLabel?: string;
  readonly suggestionsLabel?: string;
  readonly interactionsLabel?: string;
  readonly usersLabel?: string;
  readonly closeHint?: string;
  readonly selectHint?: string;
  readonly navigateHint?: string;
  readonly participantOverflowLabel?: string;
  readonly suggestions?: readonly AppShellSearchSuggestion[];
  readonly interactions?: readonly AppShellSearchInteraction[];
  readonly users?: readonly AppShellSearchUser[];
  readonly onResultSelect?: (resultId: string) => void;
  readonly onClose?: () => void;
}) {
  const [search, setSearch] = useState("");

  const filteredSuggestions = filterAppShellSearchSuggestions(
    suggestions,
    search
  );
  const filteredInteractions = filterAppShellSearchInteractions(
    interactions,
    search
  );
  const filteredUsers = filterAppShellSearchUsers(users, search);
  const resultCount =
    filteredSuggestions.length +
    filteredInteractions.length +
    filteredUsers.length;
  const hasResults = resultCount > 0;
  const resultsLiveMessage = formatAppShellSearchResultsLiveMessage(
    resultCount,
    search
  );

  const handleSelect = (resultId: string) => {
    onResultSelect?.(resultId);
    onClose?.();
  };

  const suggestionsHeadingId = "app-shell-search-suggestions-heading";
  const interactionsHeadingId = "app-shell-search-interactions-heading";
  const usersHeadingId = "app-shell-search-users-heading";

  return (
    <div className="app-shell-search-command" role="search">
      <label className="sr-only" htmlFor={SEARCH_INPUT_ID}>
        {searchLabel}
      </label>
      <div className="app-shell-search-field">
        <SearchIcon aria-hidden className="app-shell-search-field-icon" />
        <input
          autoFocus
          className="app-shell-search-input"
          id={SEARCH_INPUT_ID}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setSearch(event.target.value)
          }
          placeholder={placeholder}
          type="search"
          value={search}
        />
      </div>

      <div
        aria-label={resultsLabel}
        className="app-shell-search-results"
        role="region"
      >
        <p aria-atomic="true" aria-live="polite" className="sr-only">
          {resultsLiveMessage}
        </p>
        {hasResults ? null : (
          <p className="app-shell-search-empty">{emptyMessage}</p>
        )}

        {filteredSuggestions.length > 0 ? (
          <section aria-labelledby={suggestionsHeadingId}>
            <h2 className="sr-only" id={suggestionsHeadingId}>
              {suggestionsLabel}
            </h2>
            <p className="app-shell-search-section-label">{suggestionsLabel}</p>
            <ul className="app-shell-search-list">
              {filteredSuggestions.map((item) => (
                <SearchSuggestionRow
                  item={item}
                  key={item.id}
                  onSelect={() => handleSelect(item.id)}
                />
              ))}
            </ul>
          </section>
        ) : null}

        {filteredInteractions.length > 0 ? (
          <section aria-labelledby={interactionsHeadingId}>
            <h2 className="sr-only" id={interactionsHeadingId}>
              {interactionsLabel}
            </h2>
            <p className="app-shell-search-section-label">
              {interactionsLabel}
            </p>
            <ul className="app-shell-search-list">
              {filteredInteractions.map((item) => (
                <SearchInteractionRow
                  item={item}
                  key={item.id}
                  onSelect={() => handleSelect(item.id)}
                  overflowLabel={participantOverflowLabel}
                />
              ))}
            </ul>
          </section>
        ) : null}

        {filteredUsers.length > 0 ? (
          <section aria-labelledby={usersHeadingId}>
            <h2 className="sr-only" id={usersHeadingId}>
              {usersLabel}
            </h2>
            <p className="app-shell-search-section-label">{usersLabel}</p>
            <ul className="app-shell-search-list">
              {filteredUsers.map((item) => (
                <SearchUserRow
                  item={item}
                  key={item.id}
                  onSelect={() => handleSelect(item.id)}
                />
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <div className="app-shell-search-divider" />

      <SearchKeyboardHints
        closeHint={closeHint}
        navigateHint={navigateHint}
        selectHint={selectHint}
      />
    </div>
  );
}

export function AppShellSearchDialog({
  defaultOpen = false,
  trigger,
  className,
  placeholder,
  emptyMessage,
  dialogTitle = DEFAULT_APP_SHELL_SEARCH_DIALOG_TITLE,
  searchLabel,
  resultsLabel,
  suggestionsLabel,
  interactionsLabel,
  usersLabel,
  closeHint,
  selectHint,
  navigateHint,
  participantOverflowLabel,
  suggestions,
  interactions,
  users,
  onResultSelect,
}: AppShellSearchDialogProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={className}>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent aria-describedby={undefined} showCloseButton={false}>
          <DialogTitle>
            <span className="sr-only">{dialogTitle}</span>
          </DialogTitle>
          <AppShellSearchCommand
            {...(closeHint === undefined ? {} : { closeHint })}
            {...(emptyMessage === undefined ? {} : { emptyMessage })}
            {...(interactions === undefined ? {} : { interactions })}
            {...(interactionsLabel === undefined ? {} : { interactionsLabel })}
            {...(navigateHint === undefined ? {} : { navigateHint })}
            {...(onResultSelect === undefined ? {} : { onResultSelect })}
            {...(participantOverflowLabel === undefined
              ? {}
              : { participantOverflowLabel })}
            {...(placeholder === undefined ? {} : { placeholder })}
            {...(resultsLabel === undefined ? {} : { resultsLabel })}
            {...(searchLabel === undefined ? {} : { searchLabel })}
            {...(selectHint === undefined ? {} : { selectHint })}
            {...(suggestions === undefined ? {} : { suggestions })}
            {...(suggestionsLabel === undefined ? {} : { suggestionsLabel })}
            {...(users === undefined ? {} : { users })}
            {...(usersLabel === undefined ? {} : { usersLabel })}
            onClose={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
