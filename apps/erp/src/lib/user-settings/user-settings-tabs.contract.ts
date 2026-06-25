export const USER_SETTINGS_TABS = [
  { label: "Profile", href: "/settings/profile" },
  { label: "Security", href: "/settings/security" },
  { label: "Notifications", href: "/settings/notifications" },
  { label: "Preferences", href: "/settings/preferences" },
] as const satisfies ReadonlyArray<{
  readonly href: string;
  readonly label: string;
}>;
