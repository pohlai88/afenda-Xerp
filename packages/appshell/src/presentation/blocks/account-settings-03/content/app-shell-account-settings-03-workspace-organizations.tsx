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

export interface AppShellAccountSettings03OrganizationRow {
  readonly description: string;
  readonly href?: string;
  readonly id: string;
  readonly imageUrl?: string;
  readonly name: string;
}

export interface AppShellAccountSettings03WorkspaceOrganizationsProps {
  readonly onLeave?: (organizationId: string) => void;
  readonly organizations: readonly AppShellAccountSettings03OrganizationRow[];
  readonly pending?: boolean;
}

export function AppShellAccountSettings03WorkspaceOrganizations({
  onLeave,
  organizations,
  pending = false,
}: AppShellAccountSettings03WorkspaceOrganizationsProps) {
  const sectionId = useId();

  return (
    <AppShellAccountSettingsPanelSection
      description="Organizations linked to this workspace."
      title="Organizations"
      titleId={sectionId}
    >
      <Card>
        <div className="app-shell-studio-account-settings-06__panel">
          {organizations.map((organization, index) => (
            <div key={organization.id}>
              <div className="app-shell-studio-account-settings-03__org-row">
                <div className="app-shell-studio-account-settings-03__org-copy">
                  {organization.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- consumer-provided brand asset
                    <img alt="" src={organization.imageUrl} />
                  ) : null}
                  <div>
                    <p className="app-shell-studio-account-settings-02__item-title">
                      {organization.name}
                    </p>
                    <p className="app-shell-studio-account-settings-06__description">
                      {organization.description}
                    </p>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      disabled={pending || !onLeave}
                      emphasis="outline"
                      intent="destructive"
                      presentation="default"
                      size="sm"
                      type="button"
                    >
                      <Trash2Icon aria-hidden />
                      Leave
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Leave organization</DialogTitle>
                      <DialogDescription>
                        You will lose access to {organization.name} resources
                        linked to this workspace.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        disabled={pending}
                        emphasis="solid"
                        intent="destructive"
                        onClick={() => onLeave?.(organization.id)}
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
              {index < organizations.length - 1 ? <Separator /> : null}
            </div>
          ))}
        </div>
      </Card>
    </AppShellAccountSettingsPanelSection>
  );
}

export type AppShellAccountSettings03WorkspaceOrganizationsGovernedComponents =
  Extract<
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
