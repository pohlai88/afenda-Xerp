import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/utils/utils";

import { userProfileAvatarFallbackClassName } from "../lib/user-profile-avatar.contract.js";
import {
  DEFAULT_USER_PROFILE_AVATAR_PRESET_ID,
  resolveUserProfileAvatarFallback,
  resolveUserProfileAvatarImageSrc,
} from "../lib/user-profile-avatar.policy.js";

type UserProfileAvatarSize = "default" | "lg" | "profile" | "sm";

export type UserProfileAvatarProps = {
  readonly alt?: string;
  readonly className?: string;
  readonly customImageUrl?: string | null;
  readonly displayName?: string;
  readonly fallbackClassName?: string;
  readonly fallbackInitials?: string;
  readonly presetId?: string;
  readonly size?: UserProfileAvatarSize;
};

const UserProfileAvatar = ({
  alt,
  className,
  customImageUrl,
  displayName = "User",
  fallbackClassName,
  fallbackInitials,
  presetId = DEFAULT_USER_PROFILE_AVATAR_PRESET_ID,
  size = "default",
}: UserProfileAvatarProps) => {
  const imageSrc = resolveUserProfileAvatarImageSrc({
    ...(customImageUrl === undefined ? {} : { customImageUrl }),
    presetId,
  });
  const fallback = resolveUserProfileAvatarFallback(
    displayName,
    fallbackInitials
  );

  return (
    <Avatar className={cn(className)} size={size}>
      {imageSrc ? (
        <AvatarImage alt={alt ?? displayName} src={imageSrc} />
      ) : null}
      <AvatarFallback
        className={cn(userProfileAvatarFallbackClassName, fallbackClassName)}
      >
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserProfileAvatar;
