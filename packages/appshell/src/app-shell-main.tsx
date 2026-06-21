import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  DEFAULT_APP_SHELL_MAIN_CONTENT_LABEL,
  DEFAULT_APP_SHELL_MAIN_TITLE_ID,
} from "./shadcn-studio/data/app-shell.main.constants";
import type { AppShellMainProps } from "./app-shell.types";

export type AppShellMainGovernedComponents = Extract<
  GovernedUiComponentName,
  "Badge" | "Button"
>;

export function AppShellMain({
  children,
  title,
  description,
  actions,
  badge,
  contentLabel = DEFAULT_APP_SHELL_MAIN_CONTENT_LABEL,
  titleId = DEFAULT_APP_SHELL_MAIN_TITLE_ID,
  className,
}: AppShellMainProps) {
  const sectionClassName =
    className === undefined
      ? "app-shell-page"
      : `app-shell-page ${className}`;

  return (
    <section aria-labelledby={titleId} className={sectionClassName}>
      <header className="app-shell-page-header">
        <div className="app-shell-page-title-row">
          <div className="app-shell-page-title-group">
            <h1 className="app-shell-page-title" id={titleId}>{title}</h1>
            {badge !== undefined ? (
              <span className="app-shell-page-badge">{badge}</span>
            ) : null}
          </div>
          {actions !== undefined ? (
            <div className="app-shell-page-actions">{actions}</div>
          ) : null}
        </div>
        {description !== undefined ? (
          <p className="app-shell-page-description">{description}</p>
        ) : null}
      </header>
      {children !== undefined ? (
        <div
          aria-label={contentLabel}
          className="app-shell-page-body"
          role="region"
        >
          {children}
        </div>
      ) : null}
    </section>
  );
}
