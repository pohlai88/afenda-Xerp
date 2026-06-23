import type { GovernedBadgeProps } from "@afenda/ui/governance";
import {
  BarChart3Icon,
  MonitorSmartphoneIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";
import type { ComponentType } from "react";

export type AppShellSearchUserStatusTone = NonNullable<
  GovernedBadgeProps["tone"]
>;

export interface AppShellSearchSuggestion {
  readonly Icon: ComponentType<{ readonly className?: string }>;
  readonly id: string;
  readonly label: string;
}

export interface AppShellSearchParticipant {
  readonly alt: string;
  readonly fallback: string;
  readonly src: string;
}

export interface AppShellSearchInteraction {
  readonly description: string;
  readonly id: string;
  readonly logoSrc: string;
  readonly name: string;
  readonly participants: readonly AppShellSearchParticipant[];
}

export interface AppShellSearchUser {
  readonly avatarSrc: string;
  readonly email: string;
  readonly fallback: string;
  readonly id: string;
  readonly name: string;
  readonly status: string;
  readonly statusTone: AppShellSearchUserStatusTone;
}

export const DEFAULT_APP_SHELL_SEARCH_PLACEHOLDER =
  "Search modules, records, and people…";
export const DEFAULT_APP_SHELL_SEARCH_EMPTY_MESSAGE = "No results found.";
export const DEFAULT_APP_SHELL_SEARCH_DIALOG_TITLE = "Search";
export const DEFAULT_APP_SHELL_SEARCH_RESULTS_LABEL = "Search results";
export const DEFAULT_APP_SHELL_SEARCH_SUGGESTIONS_LABEL = "Suggestions";
export const DEFAULT_APP_SHELL_SEARCH_INTERACTIONS_LABEL = "Interactions";
export const DEFAULT_APP_SHELL_SEARCH_USERS_LABEL = "Users";
export const DEFAULT_APP_SHELL_SEARCH_CLOSE_HINT = "To close";
export const DEFAULT_APP_SHELL_SEARCH_SELECT_HINT = "To select";
export const DEFAULT_APP_SHELL_SEARCH_NAVIGATE_HINT = "To navigate";
export const DEFAULT_APP_SHELL_PARTICIPANT_OVERFLOW_LABEL = "+99";

/** Screen-reader copy when filtered search results change (aria-live="polite"). */
export function formatAppShellSearchResultsLiveMessage(
  resultCount: number,
  query: string
): string {
  const trimmed = query.trim();
  if (trimmed.length === 0) {
    return `${resultCount} search results available`;
  }
  return `${resultCount} results for "${trimmed}"`;
}

const suggestionSource = [
  {
    id: "finance",
    label: "Finance module",
    Icon: MonitorSmartphoneIcon,
  },
  {
    id: "hr",
    label: "Human resources",
    Icon: UsersIcon,
  },
  {
    id: "inventory",
    label: "Inventory & procurement",
    Icon: ShoppingCartIcon,
  },
  {
    id: "sales-crm",
    label: "Sales & CRM",
    Icon: ShoppingBagIcon,
  },
  {
    id: "reports",
    label: "Reports & analytics",
    Icon: BarChart3Icon,
  },
] satisfies readonly AppShellSearchSuggestion[];

const interactionSource = [
  {
    id: "ap-invoices",
    name: "AP invoices",
    description: "Accounts payable — Finance",
    logoSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
    participants: [
      {
        src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
        alt: "Alex Morgan",
        fallback: "AM",
      },
      {
        src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png",
        alt: "Jordan Rivera",
        fallback: "JR",
      },
      {
        src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png",
        alt: "Jordan Lee",
        fallback: "JL",
      },
    ],
  },
  {
    id: "erp-phase2",
    name: "ERP Phase 2",
    description: "Active project — Manufacturing",
    logoSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png",
    participants: [
      {
        src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-9.png",
        alt: "Taylor Kim",
        fallback: "TK",
      },
      {
        src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-11.png",
        alt: "Riley Patel",
        fallback: "RP",
      },
      {
        src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-13.png",
        alt: "Casey Brooks",
        fallback: "CB",
      },
      {
        src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-15.png",
        alt: "Drew Hassan",
        fallback: "DH",
      },
    ],
  },
] satisfies readonly AppShellSearchInteraction[];

const userSource = [
  {
    id: "alex-morgan",
    name: "Alex Morgan",
    email: "alex.morgan@afenda.com",
    avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
    fallback: "AM",
    status: "In office",
    statusTone: "success",
  },
  {
    id: "sam-chen",
    name: "Sam Chen",
    email: "sam.chen@afenda.com",
    avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png",
    fallback: "SC",
    status: "Remote",
    statusTone: "info",
  },
  {
    id: "jordan-lee",
    name: "Jordan Lee",
    email: "jordan.lee@afenda.com",
    avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png",
    fallback: "JL",
    status: "On leave",
    statusTone: "danger",
  },
] satisfies readonly AppShellSearchUser[];

export const defaultAppShellSearchSuggestions: readonly AppShellSearchSuggestion[] =
  suggestionSource;

export const defaultAppShellSearchInteractions: readonly AppShellSearchInteraction[] =
  interactionSource;

export const defaultAppShellSearchUsers: readonly AppShellSearchUser[] =
  userSource;

export function filterAppShellSearchSuggestions(
  suggestions: readonly AppShellSearchSuggestion[],
  query: string
): readonly AppShellSearchSuggestion[] {
  const normalized = query.trim().toLowerCase();
  if (normalized.length === 0) {
    return suggestions;
  }

  return suggestions.filter((item) =>
    item.label.toLowerCase().includes(normalized)
  );
}

export function filterAppShellSearchInteractions(
  interactions: readonly AppShellSearchInteraction[],
  query: string
): readonly AppShellSearchInteraction[] {
  const normalized = query.trim().toLowerCase();
  if (normalized.length === 0) {
    return interactions;
  }

  return interactions.filter(
    (item) =>
      item.name.toLowerCase().includes(normalized) ||
      item.description.toLowerCase().includes(normalized)
  );
}

export function filterAppShellSearchUsers(
  users: readonly AppShellSearchUser[],
  query: string
): readonly AppShellSearchUser[] {
  const normalized = query.trim().toLowerCase();
  if (normalized.length === 0) {
    return users;
  }

  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(normalized) ||
      user.email.toLowerCase().includes(normalized)
  );
}
