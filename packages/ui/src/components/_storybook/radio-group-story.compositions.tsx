import type { ComponentType } from "react";
import { useState } from "react";
import { Button } from "../button";
import { Field, FieldDescription, FieldLabel } from "../field";
import { Label } from "../label";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import { Badge } from "../badge";
import { StoryFrame, StoryRow, StoryStack } from "./story-frame";

export const PRIORITY_LEVELS = ["Critical", "High", "Medium", "Low"] as const;

export const PAYMENT_METHODS = [
  { value: "ach", label: "ACH transfer", description: "2–3 business days" },
  {
    value: "wire",
    label: "Wire transfer",
    description: "Same day if before 3 PM ET",
  },
  {
    value: "check",
    label: "Check",
    description: "Mail to vendor address on file",
  },
] as const;

export const SHIPPING_CARRIERS = [
  { value: "fedex", label: "FedEx Ground" },
  { value: "ups", label: "UPS Standard" },
  { value: "dhl", label: "DHL Express" },
  { value: "internal", label: "Internal fleet" },
] as const;

export function RadioField({
  id,
  label,
  value,
  disabled,
}: {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly disabled?: boolean;
}) {
  return (
    <StoryRow align="center" gap="sm">
      <RadioGroupItem disabled={disabled} id={id} value={value} />
      <span className="font-normal">
        <Label htmlFor={id}>{label}</Label>
      </span>
    </StoryRow>
  );
}

export function RadioOptionField({
  id,
  value,
  label,
  description,
  badge,
  disabled,
  icon: Icon,
}: {
  readonly id: string;
  readonly value: string;
  readonly label: string;
  readonly description?: string;
  readonly badge?: { text: string; tone: "success" | "warning" | "info" };
  readonly disabled?: boolean;
  readonly icon?: ComponentType<{ className?: string }>;
}) {
  return (
    <StoryRow
      align="start"
      className="rounded-md border border-border has-[:checked]:border-primary"
      gap="md"
      padding="sm"
    >
      <RadioGroupItem disabled={disabled} id={id} value={value} />
      <StoryStack className="flex-1" gap="xs">
        <StoryRow align="center" gap="sm">
          {Icon ? (
            <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
          ) : null}
          <span className="font-medium">
            <Label htmlFor={id}>{label}</Label>
          </span>
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
    </StoryRow>
  );
}

export function ControlledPriorityComponent() {
  const [priority, setPriority] = useState("medium");

  return (
    <StoryFrame width="md">
      <StoryStack gap="md">
        <Field>
          <FieldLabel>Priority</FieldLabel>
          <RadioGroup onValueChange={setPriority} value={priority}>
            <StoryStack gap="sm">
              {PRIORITY_LEVELS.map((level) => (
                <RadioField
                  id={`ctrl-${level.toLowerCase()}`}
                  key={level}
                  label={level}
                  value={level.toLowerCase()}
                />
              ))}
            </StoryStack>
          </RadioGroup>
          <FieldDescription>
            Selected: <span className="font-medium">{priority}</span>
          </FieldDescription>
        </Field>
        <Button emphasis="outline" intent="secondary" size="sm">
          Apply priority
        </Button>
      </StoryStack>
    </StoryFrame>
  );
}
