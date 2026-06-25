"use client";

import { Button, Field, FieldLabel, Input } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useActionState } from "react";

import { SystemAdminFormSection } from "@/components/system-admin/system-admin-form-section";
import type { SystemAdminSettingsFormValues } from "@/lib/system-admin/resolve-system-admin-settings-form-values";
import {
  EDITABLE_SYSTEM_ADMIN_SETTINGS_FIELD_IDS,
  SYSTEM_ADMIN_SETTINGS_FIELD_FORM_NAMES,
  SYSTEM_ADMIN_SETTINGS_SCAFFOLD_SUBMIT_LABEL,
} from "@/lib/system-admin/system-admin-settings.copy.contract";
import { UPDATE_SYSTEM_ADMIN_SETTINGS_INTENT } from "@/lib/system-admin/system-admin-settings.schema";
import {
  type UpdateSystemAdminSettingsActionState,
  updateSystemAdminSettingsAction,
} from "@/lib/system-admin/update-system-admin-settings.action";

export interface SystemAdminSettingsFormProps {
  readonly formValues: SystemAdminSettingsFormValues;
  readonly variant?: "full" | "general";
}

export type SystemAdminSettingsFormGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Field" | "FieldLabel" | "Input"
>;

function isEditableField(fieldId: string): boolean {
  return EDITABLE_SYSTEM_ADMIN_SETTINGS_FIELD_IDS.includes(
    fieldId as (typeof EDITABLE_SYSTEM_ADMIN_SETTINGS_FIELD_IDS)[number]
  );
}

export function SystemAdminSettingsForm({
  formValues,
  variant = "full",
}: SystemAdminSettingsFormProps) {
  const [actionState, formAction, isPending] = useActionState(
    updateSystemAdminSettingsAction,
    null satisfies UpdateSystemAdminSettingsActionState
  );

  const sections =
    variant === "general"
      ? formValues.sections.filter((section) => section.sectionId === "tenant")
      : formValues.sections;

  return (
    <form action={formAction} className="erp-system-admin-settings-form">
      {sections.map((section) => (
        <SystemAdminFormSection
          description={section.description}
          key={section.sectionId}
          sectionId={section.sectionId}
          title={section.title}
        >
          {section.fields.map((field) => {
            const inputId = `system-admin-settings-${field.fieldId}`;
            const editable = isEditableField(field.fieldId);
            const formName = editable
              ? SYSTEM_ADMIN_SETTINGS_FIELD_FORM_NAMES[
                  field.fieldId as keyof typeof SYSTEM_ADMIN_SETTINGS_FIELD_FORM_NAMES
                ]
              : undefined;

            return (
              <Field key={field.fieldId} orientation="vertical">
                <FieldLabel htmlFor={inputId}>{field.label}</FieldLabel>
                {editable ? (
                  <Input
                    defaultValue={field.value}
                    disabled={isPending}
                    id={inputId}
                    name={formName}
                  />
                ) : (
                  <Input disabled id={inputId} readOnly value={field.value} />
                )}
              </Field>
            );
          })}
        </SystemAdminFormSection>
      ))}
      <input
        name="intent"
        type="hidden"
        value={UPDATE_SYSTEM_ADMIN_SETTINGS_INTENT}
      />
      {actionState && !actionState.ok ? (
        <p className="erp-system-admin-settings-form__message" role="alert">
          {actionState.userMessage}
        </p>
      ) : null}
      {actionState?.ok ? (
        <p className="erp-system-admin-settings-form__message" role="status">
          Settings saved.
        </p>
      ) : null}
      <div className="erp-system-admin-settings-form__actions">
        <Button
          disabled={isPending}
          emphasis="solid"
          intent="primary"
          presentation="default"
          size="md"
          type="submit"
        >
          {isPending ? "Saving…" : SYSTEM_ADMIN_SETTINGS_SCAFFOLD_SUBMIT_LABEL}
        </Button>
      </div>
    </form>
  );
}
