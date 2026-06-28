"use client";

/**
 * application-shell-02 (shadcn/studio Pro) — system-admin nav chrome.
 *
 * Source: @ss-blocks/application-shell-02 (ADR-0017). Sub-blocks (search, profile
 * dropdowns) remain in TIP-006 AppShell header; this block adapts the grouped nav
 * pattern for system-admin sections without replacing shell authority.
 *
 * Normalization:
 *   Q1 — @afenda/ui primitives use governed props only
 *   Q2 — Semantic `.app-shell-studio-application-shell-02-*` classes
 *   Q3 — Layout flex/grid on plain HTML wrappers only
 */

import { Avatar, AvatarFallback } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { resolveApplicationShellAvatarFallback } from "../../app-shell.types.js";

export type AppShellApplicationShell02GovernedComponents = Extract<
  GovernedUiComponentName,
  "Avatar"
>;

export interface AppShellApplicationShell02Section {
  readonly href: string;
  readonly label: string;
  readonly sectionId: string;
}

export interface AppShellApplicationShell02UserProfile {
  readonly displayName: string;
  readonly email?: string;
  readonly workspaceLabel?: string;
}

export interface AppShellApplicationShell02SystemAdminChromeProps {
  readonly activeHref?: string;
  readonly sections: readonly AppShellApplicationShell02Section[];
  readonly userProfile?: AppShellApplicationShell02UserProfile;
}

function isSectionActive(
  activeHref: string | undefined,
  sectionHref: string
): boolean {
  if (activeHref === undefined) {
    return false;
  }

  return activeHref === sectionHref || activeHref.startsWith(`${sectionHref}/`);
}

export function AppShellApplicationShell02SystemAdminChrome({
  sections,
  activeHref,
  userProfile,
}: AppShellApplicationShell02SystemAdminChromeProps) {
  const avatarFallback =
    userProfile === undefined
      ? undefined
      : resolveApplicationShellAvatarFallback(userProfile.displayName);

  return (
    <div className="app-shell-studio-application-shell-02-chrome">
      {userProfile !== undefined && (
        <div className="app-shell-studio-application-shell-02-profile">
          <Avatar>
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="app-shell-studio-application-shell-02-profile-copy">
            <span className="app-shell-studio-application-shell-02-profile-name">
              {userProfile.displayName}
            </span>
            {userProfile.email !== undefined && (
              <span className="app-shell-studio-application-shell-02-profile-email">
                {userProfile.email}
              </span>
            )}
            {userProfile.workspaceLabel !== undefined && (
              <span className="app-shell-studio-application-shell-02-profile-workspace">
                {userProfile.workspaceLabel}
              </span>
            )}
          </div>
        </div>
      )}
      {sections.length > 0 && (
        <nav
          aria-label="System admin sections"
          className="app-shell-studio-application-shell-02-nav"
        >
          <ul className="app-shell-studio-application-shell-02-nav-list">
            {sections.map((section) => {
              const active = isSectionActive(activeHref, section.href);
              return (
                <li key={section.sectionId}>
                  <a
                    aria-current={active ? "page" : undefined}
                    className="app-shell-studio-application-shell-02-nav-link"
                    data-active={active ? "true" : undefined}
                    href={section.href}
                  >
                    {section.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
