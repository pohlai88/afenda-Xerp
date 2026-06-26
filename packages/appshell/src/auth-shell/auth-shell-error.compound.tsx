"use client";

import type { ReactNode } from "react";

import { AppShellAuthErrorIllustration } from "../shadcn-studio/assets/app-shell-auth-error-illustration.js";
import { AUTH_SHELL_ERROR_TITLE_ID } from "./auth-shell.contract.js";

export interface AuthShellErrorChildrenProps {
  readonly children: ReactNode;
}

/**
 * Auth shell error compound primitives.
 *
 * Ownership:
 * - visual composition for safe auth error states
 * - accessible alert semantics
 * - illustration frame
 * - copy and action slots
 *
 * Does not own:
 * - provider error mapping
 * - retry mutation
 * - redirect policy
 * - raw auth error payloads
 */
export function AuthShellErrorRoot({ children }: AuthShellErrorChildrenProps) {
  return (
    <main
      aria-label="Authentication error"
      className="app-shell-studio-auth-memory-gate__error-page"
    >
      <AuthShellErrorBackdrop />
      {children}
    </main>
  );
}

export function AuthShellErrorBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="app-shell-studio-auth-memory-gate__error-backdrop"
    />
  );
}

export function AuthShellErrorAlert({ children }: AuthShellErrorChildrenProps) {
  return (
    <section
      aria-labelledby={AUTH_SHELL_ERROR_TITLE_ID}
      className="app-shell-studio-auth-memory-gate__error-alert"
      role="alert"
    >
      {children}
    </section>
  );
}

export function AuthShellErrorIllustrationFrame({
  children,
}: AuthShellErrorChildrenProps) {
  return (
    <div className="app-shell-studio-auth-memory-gate__error-illustration-frame">
      {children}
    </div>
  );
}

export function AuthShellErrorIllustration() {
  return (
    <AuthShellErrorIllustrationFrame>
      <AppShellAuthErrorIllustration
        aria-hidden="true"
        className="app-shell-studio-auth-memory-gate__error-illustration"
      />
    </AuthShellErrorIllustrationFrame>
  );
}

export function AuthShellErrorCopy({ children }: AuthShellErrorChildrenProps) {
  return (
    <div className="app-shell-studio-auth-memory-gate__error-copy">
      {children}
    </div>
  );
}

export function AuthShellErrorEyebrow({
  children,
}: AuthShellErrorChildrenProps) {
  return (
    <p className="app-shell-studio-auth-memory-gate__error-eyebrow">
      <AuthShellErrorStatusPulse />
      <span>{children}</span>
    </p>
  );
}

export function AuthShellErrorStatusPulse() {
  return (
    <span
      aria-hidden="true"
      className="app-shell-studio-auth-memory-gate__error-status-pulse"
    />
  );
}

export function AuthShellErrorTitle({ children }: AuthShellErrorChildrenProps) {
  return (
    <h1
      className="app-shell-studio-auth-memory-gate__error-title"
      id={AUTH_SHELL_ERROR_TITLE_ID}
    >
      {children}
    </h1>
  );
}

export function AuthShellErrorDescription({
  children,
}: AuthShellErrorChildrenProps) {
  return (
    <p className="app-shell-studio-auth-memory-gate__error-description">
      {children}
    </p>
  );
}

export function AuthShellErrorActions({
  children,
}: AuthShellErrorChildrenProps) {
  return (
    <div className="app-shell-studio-auth-memory-gate__error-actions">
      {children}
    </div>
  );
}

export const AuthShellError = {
  Root: AuthShellErrorRoot,
  Backdrop: AuthShellErrorBackdrop,
  Alert: AuthShellErrorAlert,
  IllustrationFrame: AuthShellErrorIllustrationFrame,
  Illustration: AuthShellErrorIllustration,
  Copy: AuthShellErrorCopy,
  StatusPulse: AuthShellErrorStatusPulse,
  Eyebrow: AuthShellErrorEyebrow,
  Title: AuthShellErrorTitle,
  Description: AuthShellErrorDescription,
  Actions: AuthShellErrorActions,
} as const;
