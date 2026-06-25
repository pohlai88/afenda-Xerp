"use client";

import {
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Separator,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { Trash2Icon } from "lucide-react";
import { useId } from "react";

import { AppShellAccountSettingsPanelSection } from "../../app-shell-account-settings-panel-section";

export interface AppShellAccountSettings03DangerZoneProps {
  readonly canDeleteWorkspace?: boolean;
  readonly deleteDisabledReason?: string;
  readonly onDeleteWorkspace?: () => void;
  readonly onLeaveWorkspace?: () => void;
  readonly pending?: boolean;
}

export function AppShellAccountSettings03DangerZone({
  canDeleteWorkspace = false,
  deleteDisabledReason,
  onDeleteWorkspace,
  onLeaveWorkspace,
  pending = false,
}: AppShellAccountSettings03DangerZoneProps) {
  const sectionId = useId();

  return (
    <AppShellAccountSettingsPanelSection
      description="Irreversible workspace actions. Proceed with caution."
      title="Danger zone"
      titleId={sectionId}
    >
      <div className="app-shell-studio-account-settings-03__danger-stack">
        <Card>
          <div className="app-shell-studio-account-settings-06__panel">
            <div className="app-shell-studio-account-settings-03__danger-row">
              <div>
                <p className="app-shell-studio-account-settings-02__item-title">
                  Leave workspace
                </p>
                <p className="app-shell-studio-account-settings-06__description">
                  Remove yourself from this workspace. You will lose access
                  immediately.
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    disabled={pending || !onLeaveWorkspace}
                    emphasis="outline"
                    intent="destructive"
                    presentation="default"
                    size="sm"
                    type="button"
                  >
                    Leave workspace
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Leave workspace</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone without a new invitation.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      disabled={pending}
                      emphasis="solid"
                      intent="destructive"
                      onClick={onLeaveWorkspace}
                      presentation="default"
                      size="md"
                      type="button"
                    >
                      Confirm leave
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>
        <Separator />
        <Card>
          <div className="app-shell-studio-account-settings-06__panel">
            <div className="app-shell-studio-account-settings-03__danger-row">
              <div>
                <p className="app-shell-studio-account-settings-02__item-title">
                  Delete workspace
                </p>
                <p className="app-shell-studio-account-settings-06__description">
                  {deleteDisabledReason ??
                    "Permanently delete this workspace and all associated data."}
                </p>
              </div>
              <Button
                disabled={pending || !canDeleteWorkspace || !onDeleteWorkspace}
                emphasis="solid"
                intent="destructive"
                onClick={onDeleteWorkspace}
                presentation="default"
                size="sm"
                type="button"
              >
                <Trash2Icon aria-hidden />
                Delete workspace
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppShellAccountSettingsPanelSection>
  );
}

export type AppShellAccountSettings03DangerZoneGovernedComponents = Extract<
  GovernedUiComponentName,
  | "Button"
  | "Card"
  | "Dialog"
  | "DialogContent"
  | "DialogDescription"
  | "DialogFooter"
  | "DialogHeader"
  | "DialogTitle"
  | "DialogTrigger"
  | "Separator"
>;
