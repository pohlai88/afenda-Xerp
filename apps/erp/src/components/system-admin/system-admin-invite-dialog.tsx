"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useState } from "react";

import type { SystemAdminInviteRoleOption } from "@/lib/system-admin/list-system-admin-invite-role-options.server";
import {
  SYSTEM_ADMIN_INVITE_DIALOG_DESCRIPTION,
  SYSTEM_ADMIN_INVITE_DIALOG_TITLE,
  SYSTEM_ADMIN_INVITE_TRIGGER_LABEL,
} from "@/lib/system-admin/system-admin-invite.copy.contract";
import type { WorkspaceApiScope } from "@/lib/workspace/workspace-api-scope.contract";

import { SystemAdminInviteWizard } from "./system-admin-invite-wizard";

export interface SystemAdminInviteDialogProps {
  readonly apiScope: WorkspaceApiScope;
  readonly roleOptions: readonly SystemAdminInviteRoleOption[];
}

export type SystemAdminInviteDialogGovernedComponents = Extract<
  GovernedUiComponentName,
  | "Button"
  | "Dialog"
  | "DialogContent"
  | "DialogDescription"
  | "DialogHeader"
  | "DialogTitle"
  | "DialogTrigger"
>;

export function SystemAdminInviteDialog({
  apiScope,
  roleOptions,
}: SystemAdminInviteDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          emphasis="solid"
          intent="primary"
          presentation="default"
          size="md"
          type="button"
        >
          {SYSTEM_ADMIN_INVITE_TRIGGER_LABEL}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="erp-system-admin-invite-dialog">
          <DialogHeader>
            <DialogTitle>{SYSTEM_ADMIN_INVITE_DIALOG_TITLE}</DialogTitle>
            <DialogDescription>
              {SYSTEM_ADMIN_INVITE_DIALOG_DESCRIPTION}
            </DialogDescription>
          </DialogHeader>
          <SystemAdminInviteWizard
            apiScope={apiScope}
            roleOptions={roleOptions}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
