import type { ReactNode } from "react";

import {
  AUTH_SHELL_ENTRY_DEFAULT_FORM_EYEBROW,
  AUTH_SHELL_ENTRY_FORM_HEADING_ID,
  AUTH_SHELL_FORM_SKIP_TARGET_ID,
  type AuthShellEntryFormHeaderProps,
} from "./auth-shell.contract.js";

export interface AuthShellEntryChildrenProps {
  readonly children: ReactNode;
}

export interface AuthShellEntrySkipLinkProps {
  readonly children?: ReactNode;
  readonly href?: string;
}

export interface AuthShellEntryFormKickerProps {
  readonly children?: ReactNode;
}

export function AuthShellEntryRoot({ children }: AuthShellEntryChildrenProps) {
  return (
    <div className="app-shell-studio-auth-memory-gate app-shell-root">
      {children}
    </div>
  );
}

export function AuthShellEntryCard({ children }: AuthShellEntryChildrenProps) {
  return (
    <div className="app-shell-studio-auth-memory-gate__card">{children}</div>
  );
}

export function AuthShellEntrySkipLink({
  children = "Skip to authentication form",
  href = `#${AUTH_SHELL_FORM_SKIP_TARGET_ID}`,
}: AuthShellEntrySkipLinkProps) {
  return (
    <a className="app-shell-studio-auth-memory-gate__skip-link" href={href}>
      {children}
    </a>
  );
}

export function AuthShellEntryFormColumn({
  children,
}: AuthShellEntryChildrenProps) {
  return (
    <main
      aria-label="Authentication form"
      className="app-shell-studio-auth-memory-gate__form-column"
    >
      <AuthShellEntryFormColumnBackdrop />
      {children}
    </main>
  );
}

export function AuthShellEntryFormInner({
  children,
}: AuthShellEntryChildrenProps) {
  return (
    <div
      className="app-shell-studio-auth-memory-gate__form-inner"
      id={AUTH_SHELL_FORM_SKIP_TARGET_ID}
      tabIndex={-1}
    >
      {children}
    </div>
  );
}

export function AuthShellEntryFormKicker({
  children = AUTH_SHELL_ENTRY_DEFAULT_FORM_EYEBROW,
}: AuthShellEntryFormKickerProps) {
  return (
    <p
      className="app-shell-studio-auth-memory-gate__form-kicker"
      translate="no"
    >
      {children}
    </p>
  );
}

export function AuthShellEntryFormHeader({
  description,
  eyebrow,
  heading,
  kicker,
}: AuthShellEntryFormHeaderProps) {
  const resolvedEyebrow = eyebrow ?? kicker;

  return (
    <header className="app-shell-studio-auth-memory-gate__form-header">
      {resolvedEyebrow === undefined ? null : (
        <AuthShellEntryFormKicker>{resolvedEyebrow}</AuthShellEntryFormKicker>
      )}

      <h1
        className="app-shell-studio-auth-memory-gate__form-title"
        id={AUTH_SHELL_ENTRY_FORM_HEADING_ID}
      >
        {heading}
      </h1>

      {description === undefined ? null : (
        <p className="app-shell-studio-auth-memory-gate__form-description">
          {description}
        </p>
      )}
    </header>
  );
}

export function AuthShellEntryFormDivider() {
  return (
    <div
      aria-hidden="true"
      className="app-shell-studio-auth-memory-gate__form-divider"
    />
  );
}

export function AuthShellEntryFormColumnBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="app-shell-studio-auth-memory-gate__form-column-backdrop"
    />
  );
}

export function AuthShellEntryFormBody({
  children,
}: AuthShellEntryChildrenProps) {
  return (
    <div className="app-shell-studio-auth-memory-gate__form-body">
      {children}
    </div>
  );
}

export function AuthShellEntryFormFooter({
  children,
}: AuthShellEntryChildrenProps) {
  return (
    <footer className="app-shell-studio-auth-memory-gate__form-footer">
      {children}
    </footer>
  );
}

export const AuthShellEntry = {
  Root: AuthShellEntryRoot,
  Card: AuthShellEntryCard,
  SkipLink: AuthShellEntrySkipLink,
  FormColumn: AuthShellEntryFormColumn,
  FormColumnBackdrop: AuthShellEntryFormColumnBackdrop,
  FormInner: AuthShellEntryFormInner,
  FormKicker: AuthShellEntryFormKicker,
  FormHeader: AuthShellEntryFormHeader,
  FormDivider: AuthShellEntryFormDivider,
  FormBody: AuthShellEntryFormBody,
  FormFooter: AuthShellEntryFormFooter,
} as const;
