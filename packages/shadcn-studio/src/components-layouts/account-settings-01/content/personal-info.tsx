"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { blockSlotDomMarkerProps } from "../../../meta-contracts/block-slot-dom-marker.contract.js";
import {
  accountSettingsSectionContentClassName,
  accountSettingsSectionGridClassName,
  accountSettingsSectionHeadingClassName,
} from "../../_shared/account-settings-page-shell.js";
import { DEFAULT_USER_PROFILE_AVATAR_PRESET_ID } from "../../user-profile-avatar.js";
import UserProfileAvatarPicker, {
  type UserProfileAvatarValue,
} from "../../user-profile-avatar-picker.js";

const countries = [
  {
    value: "india",
    label: "India",
    flag: "https://cdn.shadcnstudio.com/ss-assets/flags/india.png",
  },
  {
    value: "china",
    label: "China",
    flag: "https://cdn.shadcnstudio.com/ss-assets/flags/china.png",
  },
  {
    value: "monaco",
    label: "Monaco",
    flag: "https://cdn.shadcnstudio.com/ss-assets/flags/monaco.png",
  },
  {
    value: "serbia",
    label: "Serbia",
    flag: "https://cdn.shadcnstudio.com/ss-assets/flags/serbia.png",
  },
  {
    value: "romania",
    label: "Romania",
    flag: "https://cdn.shadcnstudio.com/ss-assets/flags/romania.png",
  },
  {
    value: "mayotte",
    label: "Mayotte",
    flag: "https://cdn.shadcnstudio.com/ss-assets/flags/mayotte.png",
  },
  {
    value: "iraq",
    label: "Iraq",
    flag: "https://cdn.shadcnstudio.com/ss-assets/flags/iraq.png",
  },
  {
    value: "syria",
    label: "Syria",
    flag: "https://cdn.shadcnstudio.com/ss-assets/flags/syria.png",
  },
  {
    value: "korea",
    label: "Korea",
    flag: "https://cdn.shadcnstudio.com/ss-assets/flags/korea.png",
  },
  {
    value: "zimbabwe",
    label: "Zimbabwe",
    flag: "https://cdn.shadcnstudio.com/ss-assets/flags/zimbabwe.png",
  },
];

const PersonalInfo = () => {
  const [avatar, setAvatar] = useState<UserProfileAvatarValue>({
    presetId: DEFAULT_USER_PROFILE_AVATAR_PRESET_ID,
  });

  return (
    <div className={accountSettingsSectionGridClassName}>
      {/* Vertical Tabs List */}
      <div className={accountSettingsSectionHeadingClassName}>
        <h3 className="font-semibold">Personal Information</h3>
        <p className="text-muted-foreground text-sm">
          Manage your personal information and role.
        </p>
      </div>

      {/* Content */}
      <div className={accountSettingsSectionContentClassName("6")}>
        <form className="mx-auto w-full min-w-0">
          <div
            {...blockSlotDomMarkerProps("profile.avatar")}
            className="mb-6 w-full min-w-0"
          >
            <UserProfileAvatarPicker
              displayName="John Doe"
              onChange={setAvatar}
              value={avatar}
            />
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="multi-step-personal-info-first-name">
                First Name
              </Label>
              <Input
                {...blockSlotDomMarkerProps("profile.displayName")}
                id="multi-step-personal-info-first-name"
                placeholder="John"
              />
              <p
                {...blockSlotDomMarkerProps("profile.displayName.help")}
                className="text-muted-foreground text-xs"
              >
                Your name as shown to other workspace members.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="multi-step-personal-info-last-name">
                Last Name
              </Label>
              <Input
                id="multi-step-personal-info-last-name"
                placeholder="Doe"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="multi-step-personal-info-mobile">Mobile</Label>
              <Input
                id="multi-step-personal-info-mobile"
                placeholder="+1 (555) 123-4567"
                type="tel"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <Label htmlFor="country">Country</Label>
              <Select>
                <SelectTrigger
                  className="w-full [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80"
                  id="country"
                >
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="max-h-100 [&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:right-2 [&_*[role=option]>span]:left-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pr-8 [&_*[role=option]]:pl-2">
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      <img
                        alt={`${country.label} flag`}
                        className="h-4 w-5"
                        src={country.flag}
                      />{" "}
                      <span className="truncate">{country.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select>
                <SelectTrigger className="w-full" id="gender">
                  <SelectValue placeholder="Select a gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select>
                <SelectTrigger className="w-full" id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
        <div className="flex justify-end">
          <Button
            {...blockSlotDomMarkerProps("profile.save")}
            className="max-sm:w-full"
            type="submit"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
