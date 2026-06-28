"use client";

import type { ReactElement, ReactNode } from "react";

import type { ManifestModuleId } from "../../contracts/navigation.contract.js";
import { resolveManifestModuleNavIcon } from "../../navigation/build-nav-from-manifest.js";
import { resolveAppShellNavIcon } from "../data/app-shell.data.js";

export interface AppShellModuleWorkspaceChromeProps {
  readonly breadcrumbItems?: readonly {
    readonly label: string;
    readonly href?: string;
  }[];
  readonly children: ReactNode;
  readonly moduleId: ManifestModuleId;
  readonly moduleLabel: string;
  readonly primaryAction?: ReactNode;
  readonly tabs?: readonly {
    readonly label: string;
    readonly href: string;
    readonly active?: boolean;
  }[];
}

export function AppShellModuleWorkspaceChrome({
  moduleId,
  moduleLabel,
  breadcrumbItems,
  primaryAction,
  tabs,
  children,
}: AppShellModuleWorkspaceChromeProps): ReactElement {
  const iconId = resolveManifestModuleNavIcon(moduleId);
  const icon = resolveAppShellNavIcon(iconId);

  const hasBreadcrumb =
    breadcrumbItems !== undefined && breadcrumbItems.length > 0;
  const hasTabs = tabs !== undefined && tabs.length > 0;

  return (
    <div>
      <header className="app-shell-module-workspace-header">
        <div className="app-shell-module-workspace-title-row">
          <span className="app-shell-module-workspace-icon">{icon}</span>
          <h1 className="app-shell-module-workspace-heading">{moduleLabel}</h1>
          {primaryAction !== undefined && (
            <div className="app-shell-module-workspace-actions">
              {primaryAction}
            </div>
          )}
        </div>
        {hasBreadcrumb && breadcrumbItems !== undefined && (
          <nav aria-label="Breadcrumb" className="app-shell-module-breadcrumb">
            <ol>
              {breadcrumbItems.map((item) => (
                <li key={item.label}>
                  {item.href === undefined ? (
                    <span>{item.label}</span>
                  ) : (
                    <a href={item.href}>{item.label}</a>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {hasTabs && tabs !== undefined && (
          <nav
            aria-label="Module navigation"
            className="app-shell-module-tab-bar"
          >
            {tabs.map((tab) => (
              <a
                aria-current={tab.active === true ? "page" : undefined}
                className="app-shell-module-tab-item"
                data-active={tab.active === true ? "true" : undefined}
                href={tab.href}
                key={tab.href}
              >
                {tab.label}
              </a>
            ))}
          </nav>
        )}
      </header>
      <div className="app-shell-module-workspace-body">{children}</div>
    </div>
  );
}
