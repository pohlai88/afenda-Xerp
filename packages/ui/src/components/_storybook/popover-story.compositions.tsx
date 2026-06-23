import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../popover";
import { StoryRow, StoryStack } from "./story-frame";

export type PopoverPanelWidth = "w-48" | "w-56" | "w-64" | "w-72" | "w-80";

export function PopoverPanel({
  children,
  width = "w-72",
  ...contentProps
}: {
  readonly children: ReactNode;
  readonly width?: PopoverPanelWidth;
} & Omit<ComponentProps<typeof PopoverContent>, "className" | "children">) {
  return (
    <PopoverContent {...contentProps}>
      <div className={width}>{children}</div>
    </PopoverContent>
  );
}

export function PopoverApplyFooter({
  applyLabel = "Apply",
  clearLabel = "Clear",
  onApply,
  onClear,
}: {
  readonly applyLabel?: string;
  readonly clearLabel?: string;
  readonly onApply?: () => void;
  readonly onClear?: () => void;
}) {
  return (
    <StoryRow gap="sm" justify="end">
      <Button
        emphasis="ghost"
        intent="secondary"
        onClick={onClear}
        size="sm"
        type="button"
      >
        {clearLabel}
      </Button>
      <Button
        emphasis="solid"
        intent="primary"
        onClick={onApply}
        size="sm"
        type="button"
      >
        {applyLabel}
      </Button>
    </StoryRow>
  );
}

export function DatePickerPopoverField({
  id,
  label,
  value,
  onChange,
}: {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <StoryStack gap="xs">
      <Label htmlFor={id}>{label}</Label>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button emphasis="outline" id={id} intent="secondary">
            <CalendarIcon aria-hidden="true" />
            {value || "Pick a date…"}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>{label}</PopoverTitle>
          </PopoverHeader>
          <Input
            onChange={(event) => {
              onChange(event.target.value);
              setOpen(false);
            }}
            type="date"
            value={value}
          />
        </PopoverContent>
      </Popover>
    </StoryStack>
  );
}

export function ControlledOpenPopoverDemo() {
  const [open, setOpen] = useState(false);

  return (
    <StoryStack gap="sm">
      <StoryRow align="center" gap="sm">
        <Button
          emphasis="outline"
          intent="secondary"
          onClick={() => setOpen((value) => !value)}
          size="sm"
          type="button"
        >
          Toggle externally
        </Button>
        <span className="text-muted-foreground text-xs">
          Open: {open ? "yes" : "no"}
        </span>
      </StoryRow>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button emphasis="outline" intent="secondary">
            Controlled popover
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Controlled state</PopoverTitle>
          <PopoverDescription>
            Parent state drives `open` for programmatic close after apply.
          </PopoverDescription>
        </PopoverContent>
      </Popover>
    </StoryStack>
  );
}
