"use client";

import type { ReactNode } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";

import type { AppShellActivityItem } from "../data/app-shell.data";
import { AppShellActivityFeed } from "./app-shell-activity-feed";

export type AppShellActivityDialogGovernedComponents = Extract<
  GovernedUiComponentName,
  "Avatar" | "Badge" | "Separator" | "Sheet"
>;

export interface AppShellActivityDialogProps {
  readonly trigger: ReactNode;
  readonly defaultOpen?: boolean;
  /** Activity feed rows. Defaults to ERP demo data from `defaultAppShellActivities`. */
  readonly activities?: readonly AppShellActivityItem[];
}

export function AppShellActivityDialog({
  defaultOpen = false,
  trigger,
  activities,
}: AppShellActivityDialogProps) {
  return (
    <Sheet defaultOpen={defaultOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>Activity</SheetTitle>
          <SheetDescription>
            Recent activity from your team across modules, approvals, and shared
            documents.
          </SheetDescription>
        </SheetHeader>

        <AppShellActivityFeed
          {...(activities === undefined ? {} : { activities })}
        />
      </SheetContent>
    </Sheet>
  );
}
