"use client";

import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Label,
  Textarea,
} from "@afenda/ui";
import type { GovernedUiComponentName } from "@afenda/ui/governance";
import { ImageIcon, TrashIcon, UploadCloudIcon } from "lucide-react";
import { useId, useRef } from "react";

import { AppShellAccountSettingsPanelSection } from "../../app-shell-account-settings-panel-section";

export interface AppShellAccountSettings03WorkspaceDetailProps {
  readonly description: string;
  readonly logoPreviewUrl?: string | null;
  readonly onDescriptionChange?: (value: string) => void;
  readonly onLogoRemove?: () => void;
  readonly onLogoSelect?: (file: File) => void;
  readonly onSave?: () => void;
  readonly onSlugChange?: (value: string) => void;
  readonly onUrlSuffixChange?: (value: string) => void;
  readonly pending?: boolean;
  readonly slug: string;
  readonly urlPrefix: string;
  readonly urlSuffix: string;
}

export function AppShellAccountSettings03WorkspaceDetail({
  description,
  logoPreviewUrl,
  onDescriptionChange,
  onLogoRemove,
  onLogoSelect,
  onSave,
  onSlugChange,
  onUrlSuffixChange,
  pending = false,
  slug,
  urlPrefix,
  urlSuffix,
}: AppShellAccountSettings03WorkspaceDetailProps) {
  const sectionId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slugId = `${sectionId}-slug`;
  const descriptionId = `${sectionId}-description`;

  return (
    <AppShellAccountSettingsPanelSection
      description="Upload a logo, set your workspace URL, and describe your organization."
      title="Workspace details"
      titleId={sectionId}
    >
      <div className="app-shell-studio-account-settings-03__form-stack">
        <div className="app-shell-studio-account-settings-03__upload-zone">
          <input
            accept="image/*"
            aria-hidden
            disabled={pending || !onLogoSelect}
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file) {
                onLogoSelect?.(file);
              }
            }}
            ref={fileInputRef}
            tabIndex={-1}
            type="file"
          />
          <div className="app-shell-studio-account-settings-03__upload-preview">
            {logoPreviewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- consumer-provided preview URL
              <img alt="" src={logoPreviewUrl} />
            ) : (
              <ImageIcon aria-hidden />
            )}
          </div>
          <div className="app-shell-studio-account-settings-03__upload-actions">
            <Button
              disabled={pending || !onLogoSelect}
              emphasis="outline"
              intent="secondary"
              onClick={() => fileInputRef.current?.click()}
              presentation="default"
              size="sm"
              type="button"
            >
              <UploadCloudIcon aria-hidden />
              Upload logo
            </Button>
            {logoPreviewUrl && onLogoRemove ? (
              <Button
                disabled={pending}
                emphasis="ghost"
                intent="destructive"
                onClick={onLogoRemove}
                presentation="default"
                size="sm"
                type="button"
              >
                <TrashIcon aria-hidden />
                Remove
              </Button>
            ) : null}
          </div>
        </div>
        <div className="app-shell-studio-account-settings-03__field">
          <Label>Workspace URL</Label>
          <InputGroup>
            <InputGroupAddon>{urlPrefix}</InputGroupAddon>
            <InputGroupInput
              disabled={pending || !onUrlSuffixChange}
              onChange={(event) =>
                onUrlSuffixChange?.(event.currentTarget.value)
              }
              value={urlSuffix}
            />
          </InputGroup>
        </div>
        <div className="app-shell-studio-account-settings-03__field">
          <Label htmlFor={slugId}>Slug</Label>
          <Input
            disabled={pending || !onSlugChange}
            id={slugId}
            onChange={(event) => onSlugChange?.(event.currentTarget.value)}
            value={slug}
          />
        </div>
        <div className="app-shell-studio-account-settings-03__field">
          <Label htmlFor={descriptionId}>Description</Label>
          <Textarea
            disabled={pending || !onDescriptionChange}
            id={descriptionId}
            onChange={(event) =>
              onDescriptionChange?.(event.currentTarget.value)
            }
            value={description}
          />
        </div>
        {onSave ? (
          <div className="app-shell-studio-account-settings-02__save-row">
            <Button
              aria-busy={pending}
              disabled={pending}
              emphasis="solid"
              intent="primary"
              onClick={onSave}
              presentation="default"
              size="md"
              type="button"
            >
              Save changes
            </Button>
          </div>
        ) : null}
      </div>
    </AppShellAccountSettingsPanelSection>
  );
}

export type AppShellAccountSettings03WorkspaceDetailGovernedComponents =
  Extract<
    GovernedUiComponentName,
    | "Button"
    | "Input"
    | "InputGroup"
    | "InputGroupAddon"
    | "InputGroupInput"
    | "Label"
    | "Textarea"
  >;
