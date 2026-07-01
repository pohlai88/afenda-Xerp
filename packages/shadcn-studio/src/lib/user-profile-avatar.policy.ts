export type UserProfileAvatarPreset = {
  readonly id: string;
  readonly label: string;
  readonly src: string;
};

/** Curated shadcn-studio CDN presets for profile selection (lab / Storybook). */
export const USER_PROFILE_AVATAR_PRESETS = [
  {
    id: "avatar-1",
    label: "Preset 1",
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
  },
  {
    id: "avatar-2",
    label: "Preset 2",
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png",
  },
  {
    id: "avatar-3",
    label: "Preset 3",
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
  },
  {
    id: "avatar-4",
    label: "Preset 4",
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png",
  },
  {
    id: "avatar-5",
    label: "Preset 5",
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png",
  },
  {
    id: "avatar-6",
    label: "Preset 6",
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png",
  },
  {
    id: "avatar-7",
    label: "Preset 7",
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png",
  },
  {
    id: "avatar-8",
    label: "Preset 8",
    src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-8.png",
  },
] as const satisfies readonly UserProfileAvatarPreset[];

export const DEFAULT_USER_PROFILE_AVATAR_PRESET_ID =
  USER_PROFILE_AVATAR_PRESETS[0].id;

export type UserProfileAvatarPresetId =
  (typeof USER_PROFILE_AVATAR_PRESETS)[number]["id"];

export function getUserProfileAvatarPreset(
  presetId: string | undefined
): UserProfileAvatarPreset {
  const match = USER_PROFILE_AVATAR_PRESETS.find(
    (preset) => preset.id === presetId
  );

  return match ?? USER_PROFILE_AVATAR_PRESETS[0];
}

export function resolveUserProfileAvatarFallback(
  displayName: string,
  fallbackInitials?: string
): string {
  if (fallbackInitials !== undefined && fallbackInitials.length > 0) {
    return fallbackInitials.slice(0, 2).toUpperCase();
  }

  const initials = displayName
    .split(/\s+/)
    .filter((part) => part.length > 0)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials.length > 0 ? initials : "U";
}

export function resolveUserProfileAvatarImageSrc(input: {
  readonly customImageUrl?: string | null;
  readonly presetId?: string;
}): string | undefined {
  if (input.customImageUrl) {
    return input.customImageUrl;
  }

  return getUserProfileAvatarPreset(input.presetId).src;
}
