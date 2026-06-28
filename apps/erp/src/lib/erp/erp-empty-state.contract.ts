export type ErpEmptyStateIconKey =
  | "accounting"
  | "module"
  | "settings"
  | "users";

export interface ErpEmptyStateStaticContract {
  readonly description: string;
  readonly iconKey: ErpEmptyStateIconKey;
  readonly surfaceVariant?: string;
  readonly title: string;
  readonly titleId?: string;
  readonly variant: "static";
}

export interface ErpEmptyStateActionContract {
  readonly href: string;
  readonly label: string;
}

export interface ErpEmptyStateWithActionContract {
  readonly action: ErpEmptyStateActionContract;
  readonly description: string;
  readonly iconKey: ErpEmptyStateIconKey;
  readonly surfaceVariant?: string;
  readonly title: string;
  readonly titleId?: string;
  readonly variant: "with-action";
}

export type ErpEmptyStateProps =
  | ErpEmptyStateStaticContract
  | ErpEmptyStateWithActionContract;

export function isErpEmptyStateWithAction(
  props: ErpEmptyStateProps
): props is ErpEmptyStateWithActionContract {
  return props.variant === "with-action";
}

export const SYSTEM_ADMIN_USERS_EMPTY_STATE = {
  description:
    "The user directory is empty for this company scope. Invite a teammate to assign a governed role through the Foundation phase 13 invite API.",
  iconKey: "users",
  surfaceVariant: "system-admin-users",
  title: "User directory",
  variant: "static",
} as const satisfies ErpEmptyStateStaticContract;

export const SYSTEM_ADMIN_SETTINGS_EMPTY_STATE = {
  description:
    "Organization, security, and module configuration mutations are deferred until admin API contracts land. No accounting settings are exposed here.",
  iconKey: "settings",
  surfaceVariant: "system-admin-settings",
  title: "Configuration pending",
  variant: "static",
} as const satisfies ErpEmptyStateStaticContract;
