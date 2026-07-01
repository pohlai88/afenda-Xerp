"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  accountSettingsSectionContentClassName,
  accountSettingsSectionGridClassName,
  accountSettingsSectionHeadingClassName,
} from "../../_shared/account-settings-page-shell.js";

const SocialUrl = () => {
  const [urls, setUrls] = useState<string[]>(["", "", ""]);

  const addUrl = () => setUrls((prev) => [...prev, ""]);

  const updateUrl = (index: number, value: string) =>
    setUrls((prev) => prev.map((u, i) => (i === index ? value : u)));

  return (
    <div className={accountSettingsSectionGridClassName}>
      {/* Vertical Tabs List */}
      <div className={accountSettingsSectionHeadingClassName}>
        <h3 className="font-semibold text-foreground">Social URLs</h3>
        <p className="text-muted-foreground text-sm">
          Manage your social URLs.
        </p>
      </div>

      {/* Content */}
      <div className={accountSettingsSectionContentClassName("6")}>
        <div className="space-y-4">
          {urls.map((url, idx) => (
            <Input
              key={idx}
              onChange={(e) => updateUrl(idx, e.target.value)}
              placeholder="Link to social profile"
              type="text"
              value={url}
            />
          ))}
        </div>
        <div className="flex items-center justify-between gap-4">
          <Button onClick={addUrl} type="button" variant="outline">
            <PlusIcon className="size-4" />
            Add URL
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default SocialUrl;
