function resolveSupportEmail(): string {
  const configured = process.env["NEXT_PUBLIC_SUPPORT_EMAIL"]?.trim();
  return configured && configured.length > 0
    ? configured
    : "support@afenda.com";
}

function resolveSystemStatusUrl(): string {
  const configured = process.env["NEXT_PUBLIC_SYSTEM_STATUS_URL"]?.trim();
  return configured && configured.length > 0
    ? configured
    : "https://status.afenda.com";
}

export type AuthSupportLinkId =
  | "privacyPolicy"
  | "termsOfService"
  | "contactSupport"
  | "systemStatus"
  | "backToHome";

export type AuthSupportLink = {
  readonly href: string;
  readonly label: string;
  readonly external?: boolean;
};

export const AUTH_SUPPORT_LINKS: Record<AuthSupportLinkId, AuthSupportLink> = {
  privacyPolicy: {
    href: "/legal/privacy",
    label: "Privacy Policy",
  },
  termsOfService: {
    href: "/legal/terms",
    label: "Terms of Service",
  },
  contactSupport: {
    href: `mailto:${resolveSupportEmail()}`,
    label: "Contact Support",
  },
  systemStatus: {
    href: resolveSystemStatusUrl(),
    label: "System Status",
    external: true,
  },
  backToHome: {
    href: "/",
    label: "Back to home",
  },
} as const;

/** Ordered links for auth footer presentation. */
export const AUTH_FOOTER_LINK_IDS: readonly AuthSupportLinkId[] = [
  "privacyPolicy",
  "termsOfService",
  "contactSupport",
  "systemStatus",
] as const;

export function getAuthSupportLink(id: AuthSupportLinkId): AuthSupportLink {
  return AUTH_SUPPORT_LINKS[id];
}
