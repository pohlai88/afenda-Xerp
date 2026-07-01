import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import UserProfileAvatarPicker, {
  type UserProfileAvatarValue,
} from "../components-layouts/user-profile-avatar-picker.js";
import { DEFAULT_USER_PROFILE_AVATAR_PRESET_ID } from "../lib/user-profile-avatar.policy.js";
import {
  shadcnStudioCenteredLayout,
  shadcnStudioStoryA11y,
} from "../lab/index.js";

const meta = {
  title: "Shadcn Studio/User Profile Avatar",
  component: UserProfileAvatarPicker,
  tags: ["autodocs"],
  parameters: {
    ...shadcnStudioCenteredLayout,
    a11y: shadcnStudioStoryA11y,
  },
} satisfies Meta<typeof UserProfileAvatarPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function PickerDemo() {
  const [value, setValue] = useState<UserProfileAvatarValue>({
    presetId: DEFAULT_USER_PROFILE_AVATAR_PRESET_ID,
  });

  return (
    <div className="w-full max-w-xl rounded-xl border bg-card p-6">
      <UserProfileAvatarPicker
        displayName="Alex Morgan"
        onChange={setValue}
        value={value}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <PickerDemo />,
};
