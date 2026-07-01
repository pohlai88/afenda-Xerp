"use client";

import { CheckIcon, TrashIcon, UploadCloudIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/utils";

import {
  userProfileAvatarHeroClassName,
  userProfileAvatarPanelClassName,
  userProfileAvatarPresetButtonClassName,
  userProfileAvatarPresetGridClassName,
  userProfileAvatarPresetIdleClassName,
  userProfileAvatarPresetSelectedClassName,
} from "../lib/user-profile-avatar.contract.js";
import {
  DEFAULT_USER_PROFILE_AVATAR_PRESET_ID,
  USER_PROFILE_AVATAR_PRESETS,
  type UserProfileAvatarPresetId,
} from "../lib/user-profile-avatar.policy.js";
import UserProfileAvatar from "./user-profile-avatar.js";

export type UserProfileAvatarValue = {
  readonly customImageUrl?: string | null;
  readonly presetId: UserProfileAvatarPresetId;
};

export type UserProfileAvatarPickerProps = {
  readonly className?: string;
  readonly displayName?: string;
  readonly label?: string;
  readonly onChange?: (value: UserProfileAvatarValue) => void;
  readonly slotProps?: {
    readonly avatar?: Record<string, string>;
  };
  readonly value?: UserProfileAvatarValue;
};

const DEFAULT_VALUE: UserProfileAvatarValue = {
  presetId: DEFAULT_USER_PROFILE_AVATAR_PRESET_ID,
};

type PresetTileProps = {
  readonly displayName: string;
  readonly onSelect: () => void;
  readonly presetId: UserProfileAvatarPresetId;
  readonly selected: boolean;
};

function PresetTile({
  displayName,
  onSelect,
  presetId,
  selected,
}: PresetTileProps) {
  return (
    <button
      aria-label={`Use avatar preset ${presetId}`}
      aria-selected={selected}
      className={cn(
        userProfileAvatarPresetButtonClassName,
        selected
          ? userProfileAvatarPresetSelectedClassName
          : userProfileAvatarPresetIdleClassName
      )}
      onClick={onSelect}
      role="option"
      type="button"
    >
      <UserProfileAvatar
        displayName={displayName}
        presetId={presetId}
        size="default"
      />
      {selected ? (
        <span className="absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background">
          <CheckIcon aria-hidden className="size-2.5" />
        </span>
      ) : null}
    </button>
  );
}

const UserProfileAvatarPicker = ({
  className,
  displayName = "User",
  label = "Your Avatar",
  onChange,
  slotProps,
  value = DEFAULT_VALUE,
}: UserProfileAvatarPickerProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!value.customImageUrl) {
      const t = window.setTimeout(() => setUploadPreview(null), 0);

      return () => clearTimeout(t);
    }

    if (value.customImageUrl.startsWith("blob:")) {
      const t = window.setTimeout(
        () => setUploadPreview(value.customImageUrl ?? null),
        0
      );

      return () => clearTimeout(t);
    }

    const t = window.setTimeout(() => setUploadPreview(null), 0);

    return () => clearTimeout(t);
  }, [value.customImageUrl]);

  const resolvedCustomUrl = uploadPreview ?? value.customImageUrl ?? null;

  const emit = (next: UserProfileAvatarValue) => {
    onChange?.(next);
  };

  const openPicker = () => inputRef.current?.click();

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      window.alert("Please select an image file");
      event.currentTarget.value = "";

      return;
    }

    if (file.size > 1024 * 1024) {
      window.alert("File must be smaller than 1MB");
      event.currentTarget.value = "";

      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setUploadPreview(objectUrl);
    emit({
      presetId: value.presetId,
      customImageUrl: objectUrl,
    });
  };

  const selectPreset = (presetId: UserProfileAvatarPresetId) => {
    if (uploadPreview) {
      URL.revokeObjectURL(uploadPreview);
      setUploadPreview(null);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    emit({
      presetId,
      customImageUrl: null,
    });
  };

  const removeCustom = () => {
    if (uploadPreview) {
      URL.revokeObjectURL(uploadPreview);
      setUploadPreview(null);
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    emit({
      presetId: value.presetId,
      customImageUrl: null,
    });
  };

  return (
    <div className={cn("w-full min-w-0 space-y-4", className)}>
      <Label>{label}</Label>
      <div className={userProfileAvatarPanelClassName}>
        <div className="flex flex-wrap items-center gap-5">
          <UserProfileAvatar
            {...slotProps?.avatar}
            className={userProfileAvatarHeroClassName}
            customImageUrl={resolvedCustomUrl}
            displayName={displayName}
            presetId={value.presetId}
            size="profile"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div>
              <p className="font-medium text-sm">{displayName}</p>
              <p className="text-muted-foreground text-sm">
                {resolvedCustomUrl
                  ? "Custom photo selected"
                  : "Preset avatar selected"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                accept="image/*"
                className="hidden"
                onChange={onSelectFile}
                ref={inputRef}
                type="file"
              />
              <Button
                className="flex items-center gap-2"
                onClick={openPicker}
                type="button"
                variant="outline"
              >
                <UploadCloudIcon />
                Upload photo
              </Button>
              <Button
                aria-label="Remove custom photo"
                disabled={!resolvedCustomUrl}
                onClick={removeCustom}
                type="button"
                variant="ghost"
              >
                <TrashIcon />
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">
              Choose a preset below or upload a square photo up to 1MB.
            </p>
          </div>
        </div>
      </div>
      <div
        aria-label="Avatar presets"
        className={userProfileAvatarPresetGridClassName}
        role="listbox"
      >
        {USER_PROFILE_AVATAR_PRESETS.map((preset) => (
          <PresetTile
            displayName={displayName}
            key={preset.id}
            onSelect={() => selectPreset(preset.id)}
            presetId={preset.id}
            selected={!resolvedCustomUrl && value.presetId === preset.id}
          />
        ))}
      </div>
    </div>
  );
};

export default UserProfileAvatarPicker;
