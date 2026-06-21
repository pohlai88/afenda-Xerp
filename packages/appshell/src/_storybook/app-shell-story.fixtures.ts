import { brandUserId } from "@afenda/kernel";

import type {
  ApplicationShellIdentity,
  ApplicationShellProps,
} from "../app-shell.types";
import { DEFAULT_APPLICATION_SHELL_PROPS } from "../app-shell.types";

/** Brands a story-only user id at the trust boundary — throws when invalid. */
export function requireStoryUserId(value: string) {
  const userId = brandUserId(value);
  if (userId === null) {
    throw new Error(`Invalid story userId: ${value}`);
  }
  return userId;
}

export const ERP_STORY_SESSION_IDENTITY = {
  displayName: "Jordan Rivera",
  email: "jordan.rivera@afenda.example",
  userId: requireStoryUserId("user_story_finance_controller"),
} satisfies ApplicationShellIdentity;

export const ERP_STORY_BASE_ARGS = {
  brandName: DEFAULT_APPLICATION_SHELL_PROPS.brandName,
  userName: "Alex Morgan",
  welcomeMessage: "Good morning — Finance module",
} satisfies Pick<
  ApplicationShellProps,
  "brandName" | "userName" | "welcomeMessage"
>;

export const FINANCE_MODULE_ARGS = {
  userName: "Jordan Rivera",
  welcomeMessage: "Finance · Q2 2026 close",
  navigationLabel: "Finance modules",
  teamLabel: "Finance team",
  roleLabel: "Controller",
  searchTriggerLabel: "Search finance records…",
} satisfies Pick<
  ApplicationShellProps,
  | "userName"
  | "welcomeMessage"
  | "navigationLabel"
  | "teamLabel"
  | "roleLabel"
  | "searchTriggerLabel"
>;

export const HUMAN_RESOURCES_ARGS = {
  userName: "Sam Chen",
  welcomeMessage: "Human Resources · headcount planning",
  navigationLabel: "HR modules",
  teamLabel: "People team",
  roleLabel: "HR business partner",
  searchTriggerLabel: "Search employees…",
} satisfies Pick<
  ApplicationShellProps,
  | "userName"
  | "welcomeMessage"
  | "navigationLabel"
  | "teamLabel"
  | "roleLabel"
  | "searchTriggerLabel"
>;

export const WHITE_LABEL_ARGS = {
  brandName: "ACME Corp ERP",
  footerBrand: "ACME Corp",
  footerBrandHref: "https://example.com",
  navigationLabel: "Modules",
  teamLabel: "Colleagues",
  welcomeMessage: "Enterprise portal",
} satisfies Pick<
  ApplicationShellProps,
  | "brandName"
  | "footerBrand"
  | "footerBrandHref"
  | "navigationLabel"
  | "teamLabel"
  | "welcomeMessage"
>;
