import type { ReactNode } from "react";

import {
  AUTH_SHELL_V2_ENTRY_DEFAULT_EYEBROW,
  AUTH_SHELL_V2_ENTRY_FORM_HEADING_ID,
  AUTH_SHELL_V2_ERROR_TITLE_ID,
  AUTH_SHELL_V2_FORM_SKIP_TARGET_ID,
} from "./auth-shell-v2.constants.js";
import type {
  AuthShellEntryFormHeaderProps,
  AuthShellErrorTone,
} from "./auth-shell-v2.types.js";

export interface AuthShellV2ChildrenProps {
  readonly children: ReactNode;
}

export interface AuthShellV2SkipLinkProps {
  readonly children?: ReactNode;
  readonly href?: string;
}

export function AuthShellV2Viewport({ children }: AuthShellV2ChildrenProps) {
  return <div className="af-auth-shell__viewport">{children}</div>;
}

export function AuthShellV2SkipLink({
  children = "Skip to authentication form",
  href = `#${AUTH_SHELL_V2_FORM_SKIP_TARGET_ID}`,
}: AuthShellV2SkipLinkProps) {
  return (
    <a className="af-auth-shell__skip-link" href={href}>
      {children}
    </a>
  );
}

export function AuthShellV2Panel({ children }: AuthShellV2ChildrenProps) {
  return <div className="af-auth-shell__panel">{children}</div>;
}

export function AuthShellV2FormColumn({ children }: AuthShellV2ChildrenProps) {
  return (
    <main aria-label="Authentication form" className="af-auth-shell__frame">
      {children}
    </main>
  );
}

export function AuthShellV2FormInner({ children }: AuthShellV2ChildrenProps) {
  return (
    <div
      className="af-auth-shell__form-inner"
      id={AUTH_SHELL_V2_FORM_SKIP_TARGET_ID}
      tabIndex={-1}
    >
      {children}
    </div>
  );
}

export function AuthShellV2FormHeader({
  description,
  eyebrow = AUTH_SHELL_V2_ENTRY_DEFAULT_EYEBROW,
  heading,
}: AuthShellEntryFormHeaderProps) {
  return (
    <header className="af-auth-shell__form-header">
      {eyebrow === undefined ? null : (
        <p className="af-auth-shell__eyebrow" translate="no">
          {eyebrow}
        </p>
      )}
      <h1
        className="af-auth-shell__title"
        id={AUTH_SHELL_V2_ENTRY_FORM_HEADING_ID}
      >
        {heading}
      </h1>
      {description === undefined ? null : (
        <p className="af-auth-shell__description">{description}</p>
      )}
    </header>
  );
}

export function AuthShellV2FormBody({ children }: AuthShellV2ChildrenProps) {
  return <div className="af-auth-shell__form-body">{children}</div>;
}

export function AuthShellV2FormFooter({ children }: AuthShellV2ChildrenProps) {
  return <footer className="af-auth-shell__footer">{children}</footer>;
}

export function AuthShellV2ErrorRoot({ children }: AuthShellV2ChildrenProps) {
  return (
    <main aria-label="Authentication error" className="af-auth-shell__error">
      {children}
    </main>
  );
}

export function AuthShellV2ErrorAlert({
  children,
  tone,
}: AuthShellV2ChildrenProps & { readonly tone?: AuthShellErrorTone }) {
  return (
    <section
      aria-labelledby={AUTH_SHELL_V2_ERROR_TITLE_ID}
      className="af-auth-shell__error-alert"
      data-tone={tone}
      role="alert"
    >
      {children}
    </section>
  );
}

export function AuthShellV2ErrorEyebrow({
  children,
}: AuthShellV2ChildrenProps) {
  return <p className="af-auth-shell__error-eyebrow">{children}</p>;
}

export function AuthShellV2ErrorTitle({ children }: AuthShellV2ChildrenProps) {
  return (
    <h1
      className="af-auth-shell__error-title"
      id={AUTH_SHELL_V2_ERROR_TITLE_ID}
    >
      {children}
    </h1>
  );
}

export function AuthShellV2ErrorDescription({
  children,
}: AuthShellV2ChildrenProps) {
  return <p className="af-auth-shell__error-description">{children}</p>;
}

export function AuthShellV2ErrorActions({
  children,
}: AuthShellV2ChildrenProps) {
  return <div className="af-auth-shell__error-actions">{children}</div>;
}

export const AuthShellV2Compound = {
  Viewport: AuthShellV2Viewport,
  SkipLink: AuthShellV2SkipLink,
  Panel: AuthShellV2Panel,
  FormColumn: AuthShellV2FormColumn,
  FormInner: AuthShellV2FormInner,
  FormHeader: AuthShellV2FormHeader,
  FormBody: AuthShellV2FormBody,
  FormFooter: AuthShellV2FormFooter,
  ErrorRoot: AuthShellV2ErrorRoot,
  ErrorAlert: AuthShellV2ErrorAlert,
  ErrorEyebrow: AuthShellV2ErrorEyebrow,
  ErrorTitle: AuthShellV2ErrorTitle,
  ErrorDescription: AuthShellV2ErrorDescription,
  ErrorActions: AuthShellV2ErrorActions,
} as const;
