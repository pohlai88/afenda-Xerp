"use client";

import { ImageIcon, TrashIcon, UploadCloudIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { blockSlotDomMarkerProps } from "../../../../../contracts/block-slot-dom-marker.contract.js";
import { Button } from "../../../../ui/button";
import { Input } from "../../../../ui/input";
import { Label } from "../../../../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";

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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      const t = window.setTimeout(() => setPreview(null), 0);

      return () => clearTimeout(t);
    }

    const url = URL.createObjectURL(file);

    const t = window.setTimeout(() => setPreview(url), 0);

    return () => {
      clearTimeout(t);
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];

    if (!f) return;

    if (!f.type.startsWith("image/")) {
      window.alert("Please select an image file");
      e.currentTarget.value = "";

      return;
    }

    if (f.size > 1024 * 1024) {
      window.alert("File must be smaller than 1MB");
      e.currentTarget.value = "";

      return;
    }

    setFile(f);
  };

  const openPicker = () => inputRef.current?.click();

  const remove = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="grid min-w-0 w-full grid-cols-1 gap-10 xl:grid-cols-3">
      {/* Vertical Tabs List */}
      <div className="min-w-0 flex flex-col space-y-1">
        <h3 className="font-semibold">Personal Information</h3>
        <p className="text-muted-foreground text-sm">
          Manage your personal information and role.
        </p>
      </div>

      {/* Content */}
      <div className="min-w-0 space-y-6 xl:col-span-2">
        <form className="mx-auto min-w-0 w-full">
          <div className="mb-6 w-full min-w-0 space-y-2">
            <Label>Your Avatar</Label>
            <div className="flex flex-wrap items-center gap-4">
              <div
                {...blockSlotDomMarkerProps("profile.avatar")}
                aria-label="Upload your avatar"
                className="flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed hover:opacity-95"
                onClick={openPicker}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openPicker();
                  }
                }}
                role="button"
                tabIndex={0}
              >
                {preview ? (
                  <img
                    alt="avatar preview"
                    className="h-full w-full object-cover"
                    src={preview}
                  />
                ) : (
                  <ImageIcon />
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  accept="image/*"
                  className="hidden"
                  onChange={onSelect}
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
                  Upload avatar
                </Button>
                <Button
                  aria-label="Remove avatar"
                  className="text-destructive!"
                  disabled={!file}
                  onClick={remove}
                  type="button"
                  variant="ghost"
                >
                  <TrashIcon />
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Pick a photo up to 1MB.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
