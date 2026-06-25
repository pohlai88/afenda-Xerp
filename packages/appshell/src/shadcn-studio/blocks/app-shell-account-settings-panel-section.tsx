"use client";

import type { ReactNode } from "react";

export interface AppShellAccountSettingsPanelSectionProps {
  readonly ariaLabel?: string;
  readonly children: ReactNode;
  readonly description?: string;
  readonly title: string;
  readonly titleId?: string;
}

/**
 * Shared 3-column settings section layout (account-settings-02–07).
 * Reuses account-settings-06 studio geometry (STUDIO-PATTERN-MAP §J).
 */
export function AppShellAccountSettingsPanelSection({
  ariaLabel,
  children,
  description,
  title,
  titleId,
}: AppShellAccountSettingsPanelSectionProps) {
  return (
    <section
      aria-label={ariaLabel}
      aria-labelledby={titleId}
      className="app-shell-studio-account-settings-06__section"
    >
      <div className="app-shell-studio-account-settings-06__row">
        <div className="app-shell-studio-account-settings-06__aside">
          <h3
            className="app-shell-studio-account-settings-06__title"
            id={titleId}
          >
            {title}
          </h3>
          {description ? (
            <p className="app-shell-studio-account-settings-06__description">
              {description}
            </p>
          ) : null}
        </div>
        <div className="app-shell-studio-account-settings-06__content">
          {children}
        </div>
      </div>
    </section>
  );
}
