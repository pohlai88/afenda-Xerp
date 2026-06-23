import { useState } from "react";
import { Badge } from "../badge";
import { Label } from "../label";
import { Switch } from "../switch";
import { StoryFrame, StoryRow, StoryStack } from "./story-frame";

export interface SwitchSettingRowProps {
  readonly badge?: { text: string; tone: "success" | "warning" | "info" };
  readonly defaultChecked?: boolean;
  readonly description?: string;
  readonly disabled?: boolean;
  readonly id: string;
  readonly label: string;
  readonly size?: "sm" | "md";
}

export function SwitchSettingRow({
  id,
  label,
  description,
  defaultChecked,
  disabled,
  badge,
  size = "md",
}: SwitchSettingRowProps) {
  return (
    <StoryRow
      align="center"
      className="rounded-md border border-border"
      justify="between"
      padding="sm"
    >
      <StoryStack gap="xs">
        <StoryRow align="center" gap="sm">
          <span className="font-medium text-sm">{label}</span>
          {badge ? (
            <Badge emphasis="soft" size="sm" tone={badge.tone}>
              {badge.text}
            </Badge>
          ) : null}
        </StoryRow>
        {description ? (
          <span className="text-muted-foreground text-xs">{description}</span>
        ) : null}
      </StoryStack>
      <Switch
        disabled={disabled}
        id={id}
        size={size}
        {...(defaultChecked === undefined ? {} : { defaultChecked })}
      />
    </StoryRow>
  );
}

export function ControlledAutoSavePanel() {
  const [enabled, setEnabled] = useState(true);

  return (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <StoryRow align="center" justify="between">
          <StoryStack gap="xs">
            <span className="font-medium">
              <Label htmlFor="ctrl-autosave">Auto-save drafts</Label>
            </span>
            <span className="text-muted-foreground text-xs">
              Saves open forms every 30 seconds
            </span>
          </StoryStack>
          <Switch
            checked={enabled}
            id="ctrl-autosave"
            onCheckedChange={setEnabled}
          />
        </StoryRow>
        <span className="text-muted-foreground text-xs">
          Status: {enabled ? "Enabled — drafts sync to server" : "Disabled"}
        </span>
      </StoryStack>
    </StoryFrame>
  );
}
