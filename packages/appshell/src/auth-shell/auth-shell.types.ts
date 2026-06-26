import type { CSSProperties, ReactNode } from "react";

import type { AUTH_SHELL_LANES } from "./auth-shell.constants.js";

/**
 * Serializable copy contract for app route registries and metadata.
 * JSON-safe strings only — no ReactNode at registry boundaries.
 */
export interface AuthShellSerializableCopy {
  readonly description?: string;
  readonly eyebrow?: string;
  readonly title: string;
}

export type AuthShellLane = (typeof AUTH_SHELL_LANES)[number];

export type AuthShellEntryLane = Extract<
  AuthShellLane,
  "access" | "verify" | "recover" | "error"
>;

export type AuthShellErrorTone =
  | "neutral"
  | "warning"
  | "critical"
  | "expired"
  | "forbidden";

export type AuthShellStatusTone = "info" | "positive" | "warning" | "neutral";

export interface AuthShellProps {
  readonly children: ReactNode;
  /** Layout-only shell chrome extension — not for governed primitives. */
  readonly className?: string | undefined;
  readonly footer?: ReactNode;
  readonly lane: AuthShellLane;
  /** Inline CSS variables for tenant brand overrides (e.g. `--af-auth-brand`). */
  readonly shellStyle?: CSSProperties;
  readonly support?: ReactNode;
  /** Applied to root `aria-label` — page title for assistive tech. */
  readonly title: string;
  readonly visual?: ReactNode;
}

export interface AuthShellEntryPageProps extends AuthShellSerializableCopy {
  readonly alternateAction?: ReactNode;
  readonly children: ReactNode;
  readonly escapeAction?: ReactNode;
  readonly lane: AuthShellEntryLane;
  readonly legalNotice?: ReactNode;
  readonly shellStyle?: CSSProperties;
  readonly support?: ReactNode;
  readonly visual?: ReactNode;
}

export interface AuthShellFormFrameProps {
  readonly children: ReactNode;
  readonly footer?: ReactNode;
}

export interface AuthShellErrorSurfaceProps {
  readonly actions?: ReactNode;
  readonly description?: string;
  /** When true, renders alert only — for split auth shell form column (no full-viewport root). */
  readonly embedded?: boolean;
  readonly reason?: string | undefined;
  readonly title: string;
  readonly tone?: AuthShellErrorTone;
}

export interface AuthShellErrorEntryPageProps
  extends AuthShellErrorSurfaceProps {
  readonly escapeAction?: ReactNode;
  readonly legalNotice?: ReactNode;
  readonly shellStyle?: CSSProperties;
  readonly support?: ReactNode;
  readonly visual?: ReactNode;
}

export type AuthShellStatusHeadingLevel = 1 | 2;

export interface AuthShellStatusSurfaceProps {
  readonly actions?: ReactNode;
  readonly description?: string;
  /** Defaults to `2` — entry pages already expose the route `h1` in the form header. */
  readonly headingLevel?: AuthShellStatusHeadingLevel;
  readonly title: string;
  readonly tone?: AuthShellStatusTone;
}

export interface AuthShellSlotProps {
  readonly children: ReactNode;
}

export interface AuthShellVisualPanelProps {
  readonly children?: ReactNode;
}

export interface AuthShellBrandCopy {
  readonly headline: string;
  readonly productLabel: string;
  readonly supportingText: string;
}

export interface AuthShellBrandPanelProps {
  readonly brandColor?: string;
  readonly headline?: ReactNode;
  readonly logoAlt?: string;
  readonly logoUrl?: string;
  readonly productLabel?: ReactNode;
  readonly supportingText?: ReactNode;
}

export interface AuthShellEntryFormHeaderProps {
  readonly description?: ReactNode;
  readonly eyebrow?: ReactNode;
  readonly heading: ReactNode;
}
