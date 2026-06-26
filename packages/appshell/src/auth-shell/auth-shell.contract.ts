import type { GovernedUiComponentName } from "@afenda/ui/governance";
import type { ReactNode } from "react";

/**
 * Auth shell public image path.
 *
 * String-compatible because Next/public assets and Figma export paths are
 * string paths — the alias documents intent.
 */
export type AuthShellPublicImageSrc = string;

/** Full-bleed brand artifact — replace with Figma `download_assets` export at same path when ready. */
export const AUTH_SHELL_BRAND_ARTIFACT_SRC =
  "/auth/auth-entry-preview.png" as const satisfies AuthShellPublicImageSrc;

export const AUTH_SHELL_BRAND_ARTIFACT_ALT =
  "Manufacturing operations floor with Afenda ERP workspace context." as const;

/**
 * Optional preview image path for custom `brandPanel` compositions.
 * Not used by the default Memory Gate artifact plane.
 */
export const AUTH_SHELL_ENTRY_PREVIEW_SRC =
  "/auth/auth-entry-preview.png" as const satisfies AuthShellPublicImageSrc;

export const AUTH_SHELL_ENTRY_PREVIEW_ALT =
  "Afenda ERP workspace preview" as const;

export const AUTH_SHELL_ENTRY_PREVIEW_CAPTION =
  "Afenda ERP workspace preview showing the governed operating dashboard layout." as const;

export const AUTH_SHELL_FORM_SKIP_TARGET_ID = "auth-shell-form" as const;

export const AUTH_SHELL_ERROR_TITLE_ID = "auth-shell-error-title" as const;

export const AUTH_SHELL_ENTRY_FORM_HEADING_ID =
  "auth-shell-form-heading" as const;

export const AUTH_SHELL_ENTRY_DEFAULT_FORM_EYEBROW =
  "Access Lane · /sign-in" as const;

export const AUTH_SHELL_ENTRY_DEFAULT_FORM_HEADING =
  "Initialize your operating session." as const;

export const AUTH_SHELL_ENTRY_DEFAULT_FORM_DESCRIPTION =
  "Continue with your organization identity to access Afenda ERP." as const;

export const AUTH_SHELL_BRAND_KICKER = "Secure operating threshold" as const;

/** @deprecated Memory Gate uses AUTH_SHELL_BRAND_HEADLINE + AUTH_SHELL_BRAND_HEADLINE_EMPHASIS. */
export const AUTH_SHELL_BRAND_TITLE =
  "Governed operations for manufacturing enterprises." as const;

/** @deprecated Memory Gate uses AUTH_SHELL_BRAND_SUPPORTING_TEXT. */
export const AUTH_SHELL_BRAND_DESCRIPTION =
  "The first controlled moment before approvals, workspaces, and audit trails." as const;

export const AUTH_SHELL_BRAND_HEADLINE = "Access that feels" as const;

export const AUTH_SHELL_BRAND_HEADLINE_EMPHASIS = "remembered." as const;

export const AUTH_SHELL_BRAND_SUPPORTING_TEXT =
  "The first controlled moment before every workspace, approval, audit trail, and operating decision inside Afenda." as const;

export const AUTH_SHELL_BRAND_PRODUCT_LABEL = "Afenda ERP" as const;

export const AUTH_SHELL_BRAND_SECURITY_LABEL = "Gateway 9.5" as const;

export const AUTH_SHELL_BRAND_READINESS_LABEL = "Gateway readiness" as const;

export const AUTH_SHELL_BRAND_READINESS_SCORE = "9.5" as const;

export const AUTH_SHELL_BRAND_FOOTER_COPY =
  "Authentication is not a page. It is the controlled entry point into the Afenda operating system." as const;

export const AUTH_SHELL_BRAND_PRINCIPLES = [
  {
    label: "Principle 01",
    statement: "One shell, every lane.",
  },
  {
    label: "Principle 02",
    statement: "No leaked identity signals.",
  },
  {
    label: "Principle 03",
    statement: "Governed entry to operations.",
  },
] as const;

export type AuthShellBrandPrincipleEntry =
  (typeof AUTH_SHELL_BRAND_PRINCIPLES)[number];

export interface AuthShellBrandPrinciple {
  readonly label: ReactNode;
  readonly statement: ReactNode;
}

export const AUTH_SHELL_BRAND_MANIFESTO =
  "One shell for invitation, verification, workspace selection, and audit-ready entry." as const;

export const AUTH_SHELL_ENTRY_CAPABILITIES = [
  "Multi-tenant context",
  "Better Auth identity",
  "Governed enterprise UI",
] as const;

export type AuthShellEntryCapability =
  (typeof AUTH_SHELL_ENTRY_CAPABILITIES)[number];

export const AUTH_SHELL_ERROR_EYEBROW = "Authentication unavailable" as const;

export const AUTH_SHELL_ERROR_DEFAULT_RETRY_LABEL = "Try again" as const;

export interface AuthShellEntryBrandPanelProps {
  readonly artifactAlt?: string;
  readonly artifactSrc?: AuthShellPublicImageSrc;

  /** @deprecated Compound-only — not forwarded by AuthShellEntryBrandPanel. */
  readonly capabilities?: readonly string[];

  /** @deprecated Use supportingText. Kept only for legacy adapter compatibility. */
  readonly description?: ReactNode;

  readonly footerCopy?: ReactNode;
  readonly headline?: ReactNode;
  readonly highlightedHeadline?: ReactNode;
  readonly kicker?: ReactNode;

  /** @deprecated Compound-only — not forwarded by AuthShellEntryBrandPanel. */
  readonly manifesto?: ReactNode;

  /** @deprecated Compound-only — not forwarded by AuthShellEntryBrandPanel. */
  readonly previewSrc?: AuthShellPublicImageSrc;

  readonly principles?: readonly AuthShellBrandPrinciple[];

  readonly productLabel?: ReactNode;
  readonly readinessLabel?: ReactNode;
  readonly readinessScore?: ReactNode;
  readonly securityLabel?: ReactNode;
  readonly supportingText?: ReactNode;

  /** @deprecated Use headline. Kept only for legacy adapter compatibility. */
  readonly title?: ReactNode;
}

export interface AuthShellEntryBrandManifestoProps {
  readonly children?: ReactNode;
}

export interface AuthShellEntryBrandCapabilitiesProps {
  readonly capabilities?: readonly string[];
}

export interface AuthShellEntryPageProps {
  readonly brandPanel?: ReactNode;
  readonly children: ReactNode;
  readonly formDescription?: ReactNode;
  readonly formEyebrow?: ReactNode;
  readonly formFooter?: ReactNode;
  readonly formHeading?: ReactNode;
}

export interface AuthShellEntryFormHeaderProps {
  readonly description?: ReactNode;
  readonly eyebrow?: ReactNode;
  readonly heading: ReactNode;

  /** @deprecated Use eyebrow. */
  readonly kicker?: ReactNode;
}

export interface AuthShellErrorSurfaceProps {
  readonly description: ReactNode;
  readonly eyebrow?: ReactNode;
  readonly isRetrying?: boolean;
  readonly onRetry?: () => void;
  readonly retryLabel?: ReactNode;
  readonly title: ReactNode;
}

export type AuthShellErrorGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button"
>;

/** @deprecated Use `AuthShellEntryPageProps` */
export type AppShellAuthLoginPage04Props = AuthShellEntryPageProps;

/** @deprecated Use `AuthShellErrorSurfaceProps` */
export type AppShellAuthErrorPage02Props = AuthShellErrorSurfaceProps;

/** @deprecated Use `AuthShellErrorGovernedComponents` */
export type AppShellAuthErrorPage02GovernedComponents =
  AuthShellErrorGovernedComponents;
