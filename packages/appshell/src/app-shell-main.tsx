import type { GovernedUiComponentName } from "@afenda/ui/governance";
import type { AppShellMainProps } from "./app-shell.types";
import {
  DEFAULT_APP_SHELL_MAIN_CONTENT_LABEL,
  DEFAULT_APP_SHELL_MAIN_TITLE_ID,
} from "./presentation/data/app-shell.main.constants";

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
    className === undefined ? "app-shell-page" : `app-shell-page ${className}`;

  return (
    <section aria-labelledby={titleId} className={sectionClassName}>
      <header className="app-shell-page-header">
        <div className="app-shell-page-title-row">
          <div className="app-shell-page-title-group">
            <h1 className="app-shell-page-title" id={titleId}>
              {title}
            </h1>
            {badge === undefined ? null : (
              <span className="app-shell-page-badge">{badge}</span>
            )}
          </div>
          {actions === undefined ? null : (
            <div className="app-shell-page-actions">{actions}</div>
          )}
        </div>
        {description === undefined ? null : (
          <p className="app-shell-page-description">{description}</p>
        )}
      </header>
      {children === undefined ? null : (
        <div
          aria-label={contentLabel}
          className="app-shell-page-body"
          role="region"
        >
          {children}
        </div>
      )}
    </section>
  );
}
