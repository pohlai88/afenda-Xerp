"use client";

import {
  ApplicationShell,
  type ApplicationShellProps,
  type AppShellNavItemSerializable,
  hydrateManifestNavigation,
} from "@afenda/appshell";
import { type ReactNode, useMemo } from "react";
import { ErpFeedbackToaster } from "@/components/erp-feedback-toaster.client";
import { ErpThemeProvider } from "@/components/erp-theme-provider.client";
import { resolveAppShellProfileMenuGroups } from "@/lib/user-settings/resolve-app-shell-profile-menu-groups";

type ErpApplicationShellProps = Omit<
  ApplicationShellProps,
  "navigationPages" | "profileMenuGroups"
> & {
  readonly children?: ReactNode;
  readonly manifestNavigation?:
    | readonly AppShellNavItemSerializable[]
    | undefined;
};

/**
 * Client boundary for ERP ApplicationShell — hydrates manifest nav icons and
 * profile menu actions so server layouts pass only serializable props.
 */
export function ErpApplicationShell({
  children,
  manifestNavigation,
  ...shellProps
}: ErpApplicationShellProps) {
  const navigationPages = useMemo(
    () =>
      manifestNavigation === undefined
        ? undefined
        : hydrateManifestNavigation(manifestNavigation),
    [manifestNavigation]
  );
  const profileMenuGroups = useMemo(
    () => resolveAppShellProfileMenuGroups(),
    []
  );

  return (
    <ErpThemeProvider>
      <ApplicationShell
        profileMenuGroups={profileMenuGroups}
        {...(navigationPages ? { navigationPages } : {})}
        {...shellProps}
      >
        {children}
        <ErpFeedbackToaster />
      </ApplicationShell>
    </ErpThemeProvider>
  );
}

/** @deprecated Use `ErpApplicationShell` — alias for protected layout imports. */
export const AppShell = ErpApplicationShell;
