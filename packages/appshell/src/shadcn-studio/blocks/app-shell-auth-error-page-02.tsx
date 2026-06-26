"use client";

/**
 * error-page-02 (shadcn/studio Pro) — Afenda ERP auth segment error surface.
 *
 * Source: @ss-blocks/error-page-02 (ADR-0017). Centered illustration + retry.
 *
 * Normalization:
 *   Q1 — @afenda/ui Button uses governed props only
 *   Q2 — Semantic `.app-shell-studio-auth-error-page-02-*` classes
 *   Q3 — Layout on plain HTML wrappers only
 */

import { Button } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import { AppShellAuthErrorIllustration } from "../assets/app-shell-auth-error-illustration.js";

export type AppShellAuthErrorPage02GovernedComponents = Extract<
  GovernedUiComponentName,
  "Button"
>;

export interface AppShellAuthErrorPage02Props {
  readonly description: string;
  readonly onRetry?: () => void;
  readonly retryLabel?: string;
  readonly title: string;
}

export function AppShellAuthErrorPage02({
  description,
  onRetry,
  retryLabel = "Try again",
  title,
}: AppShellAuthErrorPage02Props) {
  return (
    <div
      aria-live="assertive"
      className="app-shell-studio-auth-error-page-02"
      role="alert"
    >
      <AppShellAuthErrorIllustration
        aria-hidden
        className="app-shell-studio-auth-error-page-02__illustration"
      />

      <div className="app-shell-studio-auth-error-page-02__copy">
        <p className="app-shell-studio-auth-error-page-02__eyebrow">
          Authentication unavailable
        </p>
        <h1 className="app-shell-studio-auth-error-page-02__title">{title}</h1>
        <p className="app-shell-studio-auth-error-page-02__description">
          {description}
        </p>
        {onRetry === undefined ? null : (
          <div className="app-shell-studio-auth-error-page-02__actions">
            <Button
              emphasis="solid"
              intent="primary"
              onClick={onRetry}
              presentation="default"
              size="md"
              type="button"
            >
              {retryLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
