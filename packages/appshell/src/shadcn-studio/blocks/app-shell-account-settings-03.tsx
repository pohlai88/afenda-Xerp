"use client";

/**
 * Normalized account-settings-03 (workspace) — shadcn/studio Pro promotion.
 */

import { Separator } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import {
  AppShellAccountSettings03DangerZone,
  type AppShellAccountSettings03DangerZoneProps,
} from "./account-settings-03/content/app-shell-account-settings-03-danger-zone";
import {
  AppShellAccountSettings03WorkspaceData,
  type AppShellAccountSettings03WorkspaceDataProps,
} from "./account-settings-03/content/app-shell-account-settings-03-workspace-data";
import {
  AppShellAccountSettings03WorkspaceDetail,
  type AppShellAccountSettings03WorkspaceDetailProps,
} from "./account-settings-03/content/app-shell-account-settings-03-workspace-detail";
import {
  AppShellAccountSettings03WorkspaceName,
  type AppShellAccountSettings03WorkspaceNameProps,
} from "./account-settings-03/content/app-shell-account-settings-03-workspace-name";
import {
  AppShellAccountSettings03WorkspaceOrganizations,
  type AppShellAccountSettings03WorkspaceOrganizationsProps,
} from "./account-settings-03/content/app-shell-account-settings-03-workspace-organizations";

export interface AppShellAccountSettings03Props {
  readonly dangerZone?: AppShellAccountSettings03DangerZoneProps;
  readonly workspaceData?: AppShellAccountSettings03WorkspaceDataProps;
  readonly workspaceDetail?: AppShellAccountSettings03WorkspaceDetailProps;
  readonly workspaceName?: AppShellAccountSettings03WorkspaceNameProps;
  readonly workspaceOrganizations?: AppShellAccountSettings03WorkspaceOrganizationsProps;
}

export type { AppShellAccountSettings03DangerZoneProps } from "./account-settings-03/content/app-shell-account-settings-03-danger-zone";
export type {
  AppShellAccountSettings03ExportRow,
  AppShellAccountSettings03WorkspaceDataProps,
} from "./account-settings-03/content/app-shell-account-settings-03-workspace-data";
export type { AppShellAccountSettings03WorkspaceDetailProps } from "./account-settings-03/content/app-shell-account-settings-03-workspace-detail";
export type {
  AppShellAccountSettings03TimezoneOption,
  AppShellAccountSettings03WorkspaceNameProps,
} from "./account-settings-03/content/app-shell-account-settings-03-workspace-name";
export type {
  AppShellAccountSettings03OrganizationRow,
  AppShellAccountSettings03WorkspaceOrganizationsProps,
} from "./account-settings-03/content/app-shell-account-settings-03-workspace-organizations";

export function AppShellAccountSettings03({
  dangerZone,
  workspaceData,
  workspaceDetail,
  workspaceName,
  workspaceOrganizations,
}: AppShellAccountSettings03Props) {
  return (
    <div className="app-shell-studio-account-settings-02">
      {workspaceName ? (
        <AppShellAccountSettings03WorkspaceName {...workspaceName} />
      ) : null}
      {workspaceDetail ? (
        <>
          <Separator />
          <AppShellAccountSettings03WorkspaceDetail {...workspaceDetail} />
        </>
      ) : null}
      {workspaceOrganizations ? (
        <>
          <Separator />
          <AppShellAccountSettings03WorkspaceOrganizations
            {...workspaceOrganizations}
          />
        </>
      ) : null}
      {workspaceData ? (
        <>
          <Separator />
          <AppShellAccountSettings03WorkspaceData {...workspaceData} />
        </>
      ) : null}
      {dangerZone ? (
        <>
          <Separator />
          <AppShellAccountSettings03DangerZone {...dangerZone} />
        </>
      ) : null}
    </div>
  );
}

export type AppShellAccountSettings03GovernedComponents = Extract<
  GovernedUiComponentName,
  "Separator"
>;
