"use client";

import { Button, FormSurface, Input } from "@afenda/shadcn-studio-v2/clients";

export interface SettingsProfilePanelProps {
  readonly blockId: string | null;
  readonly correlationId: string;
  readonly description: string;
  readonly surfaceTemplateId: string;
  readonly tenantLabel: string;
  readonly title: string;
  readonly userId: string;
}

export function SettingsProfilePanel({
  blockId,
  correlationId,
  description,
  surfaceTemplateId,
  tenantLabel,
  title,
  userId,
}: SettingsProfilePanelProps) {
  return (
    <FormSurface
      actions={
        <Button disabled type="button" variant="secondary">
          Save profile (read-only proof)
        </Button>
      }
      description={description}
      fields={[
        {
          control: (
            <Input
              defaultValue={userId}
              id="settings-profile-user-id"
              name="userId"
              readOnly
            />
          ),
          description: "Normalized actor id from operating context.",
          id: "settings-profile-user-id",
          label: "Operator user id",
          required: true,
        },
        {
          control: (
            <Input
              defaultValue={tenantLabel}
              id="settings-profile-tenant"
              name="tenantLabel"
              readOnly
            />
          ),
          id: "settings-profile-tenant",
          label: "Tenant",
        },
        {
          control: (
            <Input
              defaultValue={surfaceTemplateId}
              id="settings-profile-surface-template"
              name="surfaceTemplateId"
              readOnly
            />
          ),
          description: "PAS-006D metadata surface template binding.",
          id: "settings-profile-surface-template",
          label: "Surface template",
        },
        {
          control: (
            <Input
              defaultValue={blockId ?? "unresolved"}
              id="settings-profile-block-id"
              name="blockId"
              readOnly
            />
          ),
          description: "Hydrated studio block id from metadata ingress.",
          id: "settings-profile-block-id",
          label: "Metadata block",
        },
        {
          control: (
            <Input
              defaultValue={correlationId}
              id="settings-profile-correlation"
              name="correlationId"
              readOnly
            />
          ),
          id: "settings-profile-correlation",
          label: "Correlation id",
        },
      ]}
      state="ready"
      title={title}
    />
  );
}
