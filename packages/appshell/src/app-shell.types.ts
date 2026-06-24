import type { Density } from "@afenda/ui/governance";
import type { ReactNode } from "react";
import type {
  ApplicationShellIdentity,
  ApplicationShellOperatingContext,
} from "./contracts/context.contract.js";
import {
  DEFAULT_APPLICATION_SHELL_ROLE_LABEL,
  DEFAULT_APPLICATION_SHELL_SEARCH_TRIGGER_LABEL,
} from "./shadcn-studio/data/app-shell.chrome.constants";
import type {
  AppShellMenuItem,
  AppShellRecipientItem,
} from "./shadcn-studio/data/app-shell.data";

export type {
  ApplicationShellIdentity,
  ApplicationShellOperatingContext,
} from "./contracts/context.contract.js";

/** Default chrome labels and links — single source for shell + Storybook args. */
export const DEFAULT_APPLICATION_SHELL_PROPS = {
  brandName: "Afenda ERP",
  welcomeMessage: "Welcome back",
  footerBrand: "Afenda",
  footerBrandHref: "#",
  navigationLabel: "Navigation",
  teamLabel: "Team",
  userName: "User",
  avatarSrc: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
} as const satisfies Required<
  Pick<
    ApplicationShellProps,
    | "brandName"
    | "welcomeMessage"
    | "footerBrand"
    | "footerBrandHref"
    | "navigationLabel"
    | "teamLabel"
  >
> & {
  readonly userName: string;
  readonly avatarSrc: string;
};

export interface ApplicationShellProps {
  /**
   * URL to the current user's avatar image. Falls back to the default CDN avatar
   * when omitted so the profile button is never blank.
   */
  readonly avatarSrc?: string;
  /** Sidebar brand label beside the logo. Defaults to {@link DEFAULT_APPLICATION_SHELL_PROPS.brandName}. */
  readonly brandName?: string;
  readonly children?: ReactNode;
  /** Optional workspace context switcher slot — wired by the host app via server action. */
  readonly contextSwitcher?: ReactNode;
  /** Governed shell density — defaults to `standard` (DOM: `default`). */
  readonly density?: Density;
  /**
   * Footer company / product name. Defaults to {@link DEFAULT_APPLICATION_SHELL_PROPS.footerBrand}.
   * Pass an empty string to suppress the footer brand link.
   */
  readonly footerBrand?: string;
  /** Href for the footer brand link. Defaults to {@link DEFAULT_APPLICATION_SHELL_PROPS.footerBrandHref}. */
  readonly footerBrandHref?: string;
  /** Serializable auth identity — wires displayName, email, avatar fallback. */
  readonly identity?: ApplicationShellIdentity;
  /** Optional auth chrome (e.g. sign-out) rendered after the profile button. */
  readonly identityAccessory?: ReactNode;
  /** Sidebar primary navigation section label. */
  readonly navigationLabel?: string;
  /** Sidebar primary navigation items. Defaults to ERP nav from {@link defaultAppShellPages}. */
  readonly navigationPages?: readonly AppShellMenuItem[];
  /** Server-resolved workspace labels — shell displays only, does not authorize. */
  readonly operatingContext?: ApplicationShellOperatingContext;
  /** Role line under the sidebar user name. */
  readonly roleLabel?: string;
  /** Compact label on the desktop header search trigger. */
  readonly searchTriggerLabel?: string;
  /** Sidebar secondary section label (team / contacts). */
  readonly teamLabel?: string;
  /** Sidebar team / contact recipients. Defaults to {@link defaultAppShellRecipients}. */
  readonly teamRecipients?: readonly AppShellRecipientItem[];
  /** Header greeting name. Prefer `identity.displayName` when omitted. */
  readonly userName?: string;
  /** Secondary header greeting line. */
  readonly welcomeMessage?: string;
}

export interface AppShellMainProps {
  /**
   * Page-level actions rendered to the right of the title row.
   * Use for primary CTAs: "New order", "Export", etc.
   */
  readonly actions?: ReactNode;
  /**
   * Optional status badge slot beside the title.
   * Compose with governed `@afenda/ui` Badge — no `className` on primitives (TIP-004).
   */
  readonly badge?: ReactNode;
  readonly children?: ReactNode;
  /** Optional layout class on the root `<section>` (plain HTML only). */
  readonly className?: string;
  /** Accessible label for the main body region when `children` are provided. */
  readonly contentLabel?: string;
  readonly description?: string;
  readonly title: string;
  /** Override the default heading id used by `aria-labelledby` on the page region. */
  readonly titleId?: string;
}

export type ApplicationShellResolvedChrome = Required<
  Pick<
    ApplicationShellProps,
    | "brandName"
    | "welcomeMessage"
    | "footerBrand"
    | "footerBrandHref"
    | "navigationLabel"
    | "teamLabel"
    | "density"
  >
> & {
  readonly avatarSrc: string;
  readonly userName: string;
  readonly email: string | undefined;
  readonly avatarFallback: string;
  readonly roleLabel: string;
  readonly searchTriggerLabel: string;
};

/** Resolves header/sidebar chrome from optional shell props and identity. */
export function resolveApplicationShellChrome(
  props: ApplicationShellProps
): ApplicationShellResolvedChrome {
  const userName =
    props.userName ??
    props.identity?.displayName ??
    DEFAULT_APPLICATION_SHELL_PROPS.userName;

  return {
    brandName: props.brandName ?? DEFAULT_APPLICATION_SHELL_PROPS.brandName,
    welcomeMessage:
      props.welcomeMessage ?? DEFAULT_APPLICATION_SHELL_PROPS.welcomeMessage,
    footerBrand:
      props.footerBrand ?? DEFAULT_APPLICATION_SHELL_PROPS.footerBrand,
    footerBrandHref:
      props.footerBrandHref ?? DEFAULT_APPLICATION_SHELL_PROPS.footerBrandHref,
    navigationLabel:
      props.navigationLabel ?? DEFAULT_APPLICATION_SHELL_PROPS.navigationLabel,
    teamLabel: props.teamLabel ?? DEFAULT_APPLICATION_SHELL_PROPS.teamLabel,
    avatarSrc: props.avatarSrc ?? DEFAULT_APPLICATION_SHELL_PROPS.avatarSrc,
    userName,
    email: props.identity?.email,
    avatarFallback: resolveApplicationShellAvatarFallback(userName),
    roleLabel: props.roleLabel ?? DEFAULT_APPLICATION_SHELL_ROLE_LABEL,
    searchTriggerLabel:
      props.searchTriggerLabel ??
      DEFAULT_APPLICATION_SHELL_SEARCH_TRIGGER_LABEL,
    density: props.density ?? "standard",
  };
}

/** Initials fallback for avatar when image is unavailable. */
export function resolveApplicationShellAvatarFallback(
  displayName: string
): string {
  return displayName
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("");
}
