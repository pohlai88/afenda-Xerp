"use client";

import type { TenantAppearanceSettings } from "@afenda/database";
import { Button, Checkbox, Input, Label, Textarea } from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { useActionState, useId, useRef, useState } from "react";

import { UPDATE_APPEARANCE_SETTINGS_INTENT } from "@/lib/system-admin/system-admin-settings.schema";
import { resolveAppearanceLogoMimeType } from "@/lib/system-admin/tenant-brand-logo.mime";
import {
  type UpdateAppearanceSettingsActionState,
  updateAppearanceSettingsAction,
} from "@/lib/system-admin/update-appearance-settings.action";

export interface SystemAdminAppearanceSettingsPanelProps {
  readonly initialLogoPreviewUrl: string | null;
  readonly initialSettings: TenantAppearanceSettings;
}

export function SystemAdminAppearanceSettingsPanel({
  initialLogoPreviewUrl,
  initialSettings,
}: SystemAdminAppearanceSettingsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [enabled, setEnabled] = useState(initialSettings.enabled);
  const [productLabel, setProductLabel] = useState(
    initialSettings.productLabel
  );
  const [headline, setHeadline] = useState(initialSettings.headline);
  const [supportingText, setSupportingText] = useState(
    initialSettings.supportingText
  );
  const [primaryColor, setPrimaryColor] = useState(
    initialSettings.primaryColor
  );
  const [logoObjectId, setLogoObjectId] = useState<string | null>(
    initialSettings.logoObjectId
  );
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(
    initialLogoPreviewUrl
  );
  const [logoUploadMeta, setLogoUploadMeta] = useState<
    | {
        mimeType: "image/jpeg" | "image/png" | "image/webp";
        size: number;
      }
    | undefined
  >(undefined);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadPending, setUploadPending] = useState(false);

  const [actionState, formAction, isPending] = useActionState(
    updateAppearanceSettingsAction,
    null satisfies UpdateAppearanceSettingsActionState
  );

  const enabledId = useId();
  const productLabelId = useId();
  const headlineId = useId();
  const supportingTextId = useId();
  const primaryColorId = useId();

  const handleLogoSelect = async (file: File) => {
    const mimeType = resolveAppearanceLogoMimeType(file);

    if (!mimeType) {
      setUploadError("Logo must be PNG, JPEG, or WebP.");
      return;
    }

    if (file.size > 512 * 1024) {
      setUploadError("Logo must be 512KB or smaller.");
      return;
    }

    setUploadError(null);
    setUploadPending(true);

    try {
      const initResponse = await fetch(
        "/api/internal/v1/storage/tenant-brand-logo",
        {
          body: JSON.stringify({
            filename: file.name,
            mimeType,
            size: file.size,
          }),
          headers: {
            "content-type": "application/json",
          },
          method: "POST",
        }
      );

      if (!initResponse.ok) {
        setUploadError("Unable to start logo upload.");
        return;
      }

      const initPayload = (await initResponse.json()) as {
        data?: {
          headers: Record<string, string>;
          objectId: string;
          uploadUrl: string;
        };
      };

      const upload = initPayload.data;

      if (!upload) {
        setUploadError("Upload response was invalid.");
        return;
      }

      const putResponse = await fetch(upload.uploadUrl, {
        body: file,
        headers: upload.headers,
        method: "PUT",
      });

      if (!putResponse.ok) {
        setUploadError("Logo upload failed.");
        return;
      }

      setLogoObjectId(upload.objectId);
      setLogoPreviewUrl(URL.createObjectURL(file));
      setLogoUploadMeta({ mimeType, size: file.size });
    } finally {
      setUploadPending(false);
    }
  };

  const handleLogoRemove = () => {
    setLogoObjectId(null);
    setLogoPreviewUrl(null);
    setLogoUploadMeta(undefined);
    setUploadError(null);
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.set("intent", UPDATE_APPEARANCE_SETTINGS_INTENT);
    formData.set(
      "payload",
      JSON.stringify({
        enabled,
        headline,
        logoObjectId,
        primaryColor,
        productLabel,
        supportingText,
        ...(logoUploadMeta ? { logoUploadMeta } : {}),
      })
    );
    formAction(formData);
  };

  const pending = isPending || uploadPending;

  return (
    <div className="app-shell-studio-account-settings">
      <section
        aria-label="Auth appearance branding"
        className="app-shell-studio-account-settings__section"
      >
        <p className="app-shell-studio-account-settings__lead">
          Configure tenant auth shell branding for sign-in and recovery routes
          on your tenant host.
        </p>
        <div className="app-shell-studio-account-settings-03__form-stack">
          <div className="app-shell-studio-account-settings-03__field">
            <Checkbox
              checked={enabled}
              disabled={pending}
              id={enabledId}
              onCheckedChange={(checked) => setEnabled(checked === true)}
            />
            <Label htmlFor={enabledId}>Enable tenant auth branding</Label>
          </div>
          <div className="app-shell-studio-account-settings-03__upload-zone">
            <input
              accept="image/png,image/jpeg,image/webp"
              aria-hidden
              disabled={pending}
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) {
                  void handleLogoSelect(file);
                }
              }}
              ref={fileInputRef}
              tabIndex={-1}
              type="file"
            />
            <div className="app-shell-studio-account-settings-03__upload-preview">
              {logoPreviewUrl ? (
                // biome-ignore lint/performance/noImgElement: blob preview URL is not compatible with next/image
                <img alt="" height={64} src={logoPreviewUrl} width={64} />
              ) : (
                <span
                  aria-hidden
                  className="erp-system-admin-appearance__logo-placeholder"
                >
                  Logo
                </span>
              )}
            </div>
            <div className="app-shell-studio-account-settings-03__upload-actions">
              <Button
                disabled={pending}
                emphasis="outline"
                intent="secondary"
                onClick={() => fileInputRef.current?.click()}
                presentation="default"
                size="sm"
                type="button"
              >
                Upload logo
              </Button>
              {logoPreviewUrl ? (
                <Button
                  disabled={pending}
                  emphasis="ghost"
                  intent="destructive"
                  onClick={handleLogoRemove}
                  presentation="default"
                  size="sm"
                  type="button"
                >
                  Remove
                </Button>
              ) : null}
            </div>
          </div>
          <div className="app-shell-studio-account-settings-03__field">
            <Label htmlFor={productLabelId}>Product label</Label>
            <Input
              disabled={pending}
              id={productLabelId}
              onChange={(event) => setProductLabel(event.currentTarget.value)}
              value={productLabel}
            />
          </div>
          <div className="app-shell-studio-account-settings-03__field">
            <Label htmlFor={headlineId}>Brand headline</Label>
            <Input
              disabled={pending}
              id={headlineId}
              onChange={(event) => setHeadline(event.currentTarget.value)}
              value={headline}
            />
          </div>
          <div className="app-shell-studio-account-settings-03__field">
            <Label htmlFor={supportingTextId}>Supporting text</Label>
            <Textarea
              disabled={pending}
              id={supportingTextId}
              onChange={(event) => setSupportingText(event.currentTarget.value)}
              value={supportingText}
            />
          </div>
          <div className="app-shell-studio-account-settings-03__field">
            <Label htmlFor={primaryColorId}>Primary brand color</Label>
            <Input
              disabled={pending}
              id={primaryColorId}
              onChange={(event) => setPrimaryColor(event.currentTarget.value)}
              value={primaryColor}
            />
          </div>
          <div className="app-shell-studio-account-settings-02__save-row">
            <Button
              aria-busy={pending}
              disabled={pending}
              emphasis="solid"
              intent="primary"
              onClick={handleSave}
              presentation="default"
              size="md"
              type="button"
            >
              Save changes
            </Button>
          </div>
        </div>
        {uploadError ? (
          <p className="erp-system-admin-settings-form__message" role="alert">
            {uploadError}
          </p>
        ) : null}
        {actionState && !actionState.ok ? (
          <p className="erp-system-admin-settings-form__message" role="alert">
            {actionState.userMessage}
          </p>
        ) : null}
        {actionState?.ok ? (
          <p className="erp-system-admin-settings-form__message" role="status">
            Appearance settings saved.
          </p>
        ) : null}
      </section>
    </div>
  );
}

export type SystemAdminAppearanceSettingsPanelGovernedComponents = Extract<
  GovernedUiComponentName,
  "Button" | "Checkbox" | "Input" | "Label" | "Textarea"
>;
