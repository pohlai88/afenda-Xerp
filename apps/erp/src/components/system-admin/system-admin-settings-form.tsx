"use client";

import { Button, Field, FieldLabel, Input } from "@afenda/ui";
import { mapStockButtonProps } from "@afenda/ui/governance";
import { useActionState } from "react";

import { SystemAdminFormSection } from "@/components/system-admin/system-admin-form-section";
import type { SystemAdminSettingsFormValues } from "@/lib/system-admin/resolve-system-admin-settings-form-values";
import { SYSTEM_ADMIN_SETTINGS_SCAFFOLD_SUBMIT_LABEL } from "@/lib/system-admin/system-admin-settings.copy.contract";
import { UPDATE_SYSTEM_ADMIN_SETTINGS_INTENT } from "@/lib/system-admin/system-admin-settings.schema";
import {
  type UpdateSystemAdminSettingsActionState,
  updateSystemAdminSettingsAction,
} from "@/lib/system-admin/update-system-admin-settings.action";

export interface SystemAdminSettingsFormProps {
  readonly formValues: SystemAdminSettingsFormValues;
}

export function SystemAdminSettingsForm({
  formValues,
}: SystemAdminSettingsFormProps) {
  const [actionState, formAction, isPending] = useActionState(
    updateSystemAdminSettingsAction,
    null satisfies UpdateSystemAdminSettingsActionState
  );

  return (
    <form action={formAction} className="erp-system-admin-settings-form">
      {formValues.sections.map((section) => (
        <SystemAdminFormSection
          description={section.description}
          key={section.sectionId}
          sectionId={section.sectionId}
          title={section.title}
        >
          {section.fields.map((field) => {
            const inputId = `system-admin-settings-${field.fieldId}`;

            return (
              <Field key={field.fieldId} orientation="vertical">
                <FieldLabel htmlFor={inputId}>{field.label}</FieldLabel>
                <Input
                  disabled
                  id={inputId}
                  name={field.fieldId}
                  readOnly
                  value={field.value}
                />
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
      <div className="erp-system-admin-settings-form__actions">
        <Button
          {...mapStockButtonProps("default", "default")}
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Saving…" : SYSTEM_ADMIN_SETTINGS_SCAFFOLD_SUBMIT_LABEL}
        </Button>
      </div>
    </form>
  );
}
