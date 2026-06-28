"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import type { ReactNode } from "react";
import { AppShellActivityFeed } from "../blocks/app-shell-activity-feed";
import type { AppShellActivityItem } from "../data/app-shell.data";
import { createPresentationMcpWrapper } from "./create-presentation-mcp-wrapper";

export type AppShellActivityDialogGovernedComponents = Extract<
  GovernedUiComponentName,
  "Avatar" | "Badge" | "Separator" | "Sheet"
>;

const DEFAULT_ACTIVITY_FEED_LABEL = "Team activity feed";

export interface AppShellActivityDialogProps {
  /** Activity feed rows. Defaults to ERP demo data from `defaultAppShellActivities`. */
  readonly activities?: readonly AppShellActivityItem[];
  readonly defaultOpen?: boolean;
  /** Accessible name for the feed landmark inside the sheet. */
  readonly feedLabel?: string;
  readonly trigger: ReactNode;
}

function GovernedAppShellActivityDialog({
  defaultOpen = false,
  trigger,
  activities,
  feedLabel = DEFAULT_ACTIVITY_FEED_LABEL,
}: AppShellActivityDialogProps) {
  return (
    <Sheet defaultOpen={defaultOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent showCloseButton={false}>
        <div className="app-shell-studio-activity-panel">
          <SheetHeader>
            <SheetTitle>Activity</SheetTitle>
            <SheetDescription>
              Recent activity from your team across modules, approvals, and
              shared documents.
            </SheetDescription>
          </SheetHeader>

          <AppShellActivityFeed
            {...(activities === undefined ? {} : { activities })}
            feedLabel={feedLabel}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export const AppShellActivityDialog = createPresentationMcpWrapper({
  status: "governed-compose",
  GovernedComponent: GovernedAppShellActivityDialog,
});
