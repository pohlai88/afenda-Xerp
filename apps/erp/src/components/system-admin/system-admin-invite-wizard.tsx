"use client";

import {
  Button,
  Field,
  FieldLabel,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useId, useState } from "react";

import { SystemAdminFormSection } from "@/components/system-admin/system-admin-form-section";
import type { SystemAdminInviteRoleOption } from "@/lib/system-admin/list-system-admin-invite-role-options.server";
import { inviteSystemAdminUser } from "@/lib/system-admin/system-admin-invite.client";
import {
  SYSTEM_ADMIN_INVITE_CONFIRM_SECTION,
  SYSTEM_ADMIN_INVITE_FAILURE_MESSAGE,
  SYSTEM_ADMIN_INVITE_FIELD_LABELS,
  SYSTEM_ADMIN_INVITE_IDENTITY_SECTION,
  SYSTEM_ADMIN_INVITE_NAV_LABELS,
  SYSTEM_ADMIN_INVITE_ROLE_SECTION,
  SYSTEM_ADMIN_INVITE_STEP_LABELS,
  SYSTEM_ADMIN_INVITE_SUCCESS_MESSAGE,
} from "@/lib/system-admin/system-admin-invite.copy.contract";
import type { WorkspaceApiScope } from "@/lib/workspace/workspace-api-scope.contract";

import {
  advanceSystemAdminInviteWizardStep,
  retreatSystemAdminInviteWizardStep,
  type SystemAdminInviteWizardStep,
} from "./system-admin-invite-wizard.types";

export interface SystemAdminInviteWizardProps {
  readonly apiScope: WorkspaceApiScope;
  readonly roleOptions: readonly SystemAdminInviteRoleOption[];
}

export type SystemAdminInviteWizardGovernedComponents = Extract<
  GovernedUiComponentName,
  | "Button"
  | "Field"
  | "FieldLabel"
  | "Input"
  | "Label"
  | "RadioGroup"
  | "RadioGroupItem"
>;

function resolveSelectedRoleName(
  roleOptions: readonly SystemAdminInviteRoleOption[],
  roleId: string
): string {
  return (
    roleOptions.find((option) => option.roleId === roleId)?.roleName ?? roleId
  );
}

export function SystemAdminInviteWizard({
  apiScope,
  roleOptions,
}: SystemAdminInviteWizardProps) {
  const stepListId = useId();
  const displayNameId = useId();
  const emailId = useId();
  const [wizardStep, setWizardStep] = useState<SystemAdminInviteWizardStep>({
    step: "identity",
  });
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState(
    roleOptions[0]?.roleId ?? ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"error" | "success" | null>(
    null
  );

  const activeStepId =
    wizardStep.step === "identity"
      ? "identity"
      : wizardStep.step === "role"
        ? "role"
        : "confirm";

  function handleIdentityContinue(): void {
    const identity = {
      displayName: displayName.trim(),
      email: email.trim(),
    };

    const nextStep = advanceSystemAdminInviteWizardStep(wizardStep, {
      kind: "identity-complete",
      identity,
    });

    if (nextStep) {
      setWizardStep(nextStep);
      setStatusMessage(null);
      setStatusTone(null);
    }
  }

  function handleRoleContinue(): void {
    if (!selectedRoleId) {
      return;
    }

    const nextStep = advanceSystemAdminInviteWizardStep(wizardStep, {
      kind: "role-selected",
      roleId: selectedRoleId,
    });

    if (nextStep) {
      setWizardStep(nextStep);
      setStatusMessage(null);
      setStatusTone(null);
    }
  }

  function handleBack(): void {
    const previousStep = retreatSystemAdminInviteWizardStep(wizardStep);

    if (previousStep) {
      setWizardStep(previousStep);
      setStatusMessage(null);
      setStatusTone(null);
    }
  }

  async function handleSubmit(): Promise<void> {
    if (wizardStep.step !== "confirm") {
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);
    setStatusTone(null);

    try {
      await inviteSystemAdminUser(apiScope, {
        displayName: wizardStep.identity.displayName,
        email: wizardStep.identity.email,
        roleId: wizardStep.roleId,
      });
      setStatusMessage(SYSTEM_ADMIN_INVITE_SUCCESS_MESSAGE);
      setStatusTone("success");
    } catch {
      setStatusMessage(SYSTEM_ADMIN_INVITE_FAILURE_MESSAGE);
      setStatusTone("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div aria-busy={isSubmitting} className="erp-system-admin-invite-wizard">
      <nav aria-label="Invite wizard steps">
        <ol className="erp-system-admin-invite-wizard__steps" id={stepListId}>
          {(["identity", "role", "confirm"] as const).map((stepId) => (
            <li
              aria-current={activeStepId === stepId ? "step" : undefined}
              className="erp-system-admin-invite-wizard__step"
              key={stepId}
            >
              <span className="erp-system-admin-invite-wizard__step-label">
                {SYSTEM_ADMIN_INVITE_STEP_LABELS[stepId]}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      {wizardStep.step === "identity" ? (
        <SystemAdminFormSection
          description={SYSTEM_ADMIN_INVITE_IDENTITY_SECTION.description}
          sectionId="invite-identity"
          title={SYSTEM_ADMIN_INVITE_IDENTITY_SECTION.title}
        >
          <Field orientation="vertical">
            <FieldLabel htmlFor={displayNameId}>
              {SYSTEM_ADMIN_INVITE_FIELD_LABELS.displayName}
            </FieldLabel>
            <Input
              id={displayNameId}
              name="displayName"
              onChange={(event) => setDisplayName(event.target.value)}
              required
              value={displayName}
            />
          </Field>
          <Field orientation="vertical">
            <FieldLabel htmlFor={emailId}>
              {SYSTEM_ADMIN_INVITE_FIELD_LABELS.email}
            </FieldLabel>
            <Input
              id={emailId}
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </Field>
        </SystemAdminFormSection>
      ) : null}

      {wizardStep.step === "role" ? (
        <SystemAdminFormSection
          description={SYSTEM_ADMIN_INVITE_ROLE_SECTION.description}
          sectionId="invite-role"
          title={SYSTEM_ADMIN_INVITE_ROLE_SECTION.title}
        >
          <fieldset className="erp-system-admin-invite-wizard__role-fieldset">
            <legend className="erp-system-admin-invite-wizard__role-legend">
              {SYSTEM_ADMIN_INVITE_FIELD_LABELS.role}
            </legend>
            <RadioGroup
              onValueChange={setSelectedRoleId}
              value={selectedRoleId}
            >
              {roleOptions.map((option) => {
                const optionId = `system-admin-invite-role-${option.roleId}`;

                return (
                  <div
                    className="erp-system-admin-invite-wizard__role-option"
                    key={option.roleId}
                  >
                    <RadioGroupItem id={optionId} value={option.roleId} />
                    <Label htmlFor={optionId}>
                      <span className="erp-system-admin-invite-wizard__role-name">
                        {option.roleName}
                      </span>
                      {option.description ? (
                        <span className="erp-system-admin-invite-wizard__role-description">
                          {option.description}
                        </span>
                      ) : null}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </fieldset>
        </SystemAdminFormSection>
      ) : null}

      {wizardStep.step === "confirm" ? (
        <SystemAdminFormSection
          description={SYSTEM_ADMIN_INVITE_CONFIRM_SECTION.description}
          sectionId="invite-confirm"
          title={SYSTEM_ADMIN_INVITE_CONFIRM_SECTION.title}
        >
          <dl className="erp-system-admin-invite-wizard__summary">
            <div className="erp-system-admin-invite-wizard__summary-row">
              <dt>{SYSTEM_ADMIN_INVITE_FIELD_LABELS.displayName}</dt>
              <dd>{wizardStep.identity.displayName}</dd>
            </div>
            <div className="erp-system-admin-invite-wizard__summary-row">
              <dt>{SYSTEM_ADMIN_INVITE_FIELD_LABELS.email}</dt>
              <dd>{wizardStep.identity.email}</dd>
            </div>
            <div className="erp-system-admin-invite-wizard__summary-row">
              <dt>{SYSTEM_ADMIN_INVITE_FIELD_LABELS.role}</dt>
              <dd>{resolveSelectedRoleName(roleOptions, wizardStep.roleId)}</dd>
            </div>
          </dl>
        </SystemAdminFormSection>
      ) : null}

      {statusMessage ? (
        <p
          className="erp-system-admin-invite-wizard__message"
          role={statusTone === "error" ? "alert" : "status"}
        >
          {statusMessage}
        </p>
      ) : null}

      <div className="erp-system-admin-invite-wizard__actions">
        {wizardStep.step === "identity" ? null : (
          <Button
            disabled={isSubmitting}
            emphasis="outline"
            intent="primary"
            onClick={handleBack}
            presentation="default"
            size="md"
            type="button"
          >
            {SYSTEM_ADMIN_INVITE_NAV_LABELS.back}
          </Button>
        )}
        {wizardStep.step === "identity" ? (
          <Button
            disabled={
              displayName.trim().length === 0 || email.trim().length === 0
            }
            emphasis="solid"
            intent="primary"
            onClick={handleIdentityContinue}
            presentation="default"
            size="md"
            type="button"
          >
            {SYSTEM_ADMIN_INVITE_NAV_LABELS.next}
          </Button>
        ) : null}
        {wizardStep.step === "role" ? (
          <Button
            disabled={selectedRoleId.length === 0}
            emphasis="solid"
            intent="primary"
            onClick={handleRoleContinue}
            presentation="default"
            size="md"
            type="button"
          >
            {SYSTEM_ADMIN_INVITE_NAV_LABELS.next}
          </Button>
        ) : null}
        {wizardStep.step === "confirm" ? (
          <Button
            disabled={isSubmitting}
            emphasis="solid"
            intent="primary"
            onClick={() => {
              void handleSubmit();
            }}
            presentation="default"
            size="md"
            type="button"
          >
            {isSubmitting
              ? SYSTEM_ADMIN_INVITE_NAV_LABELS.submitting
              : SYSTEM_ADMIN_INVITE_NAV_LABELS.submit}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
