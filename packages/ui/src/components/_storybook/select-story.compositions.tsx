import type { GovernedState } from "@afenda/ui/governance";
import type { ReactNode } from "react";
import { useState } from "react";
import { Badge } from "../badge";
import { Label } from "../label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { StoryStack } from "./story-frame";

export const RECORD_STATUSES = [
  "Active",
  "Inactive",
  "Pending",
  "Suspended",
  "Archived",
] as const;

export const PRIORITY_LEVELS = ["Critical", "High", "Medium", "Low"] as const;

export const DEPARTMENTS = [
  "Engineering",
  "Finance",
  "HR",
  "Operations",
  "Sales",
  "Legal",
] as const;

export const CURRENCIES = [
  "USD — US Dollar",
  "EUR — Euro",
  "GBP — British Pound",
  "AUD — Australian Dollar",
  "SGD — Singapore Dollar",
] as const;

export const PAYMENT_TERMS = [
  "Net 15",
  "Net 30",
  "Net 45",
  "Net 60",
  "Due on receipt",
] as const;

export const GL_ACCOUNTS = [
  "6100 — Office Supplies",
  "6200 — Travel & Entertainment",
  "6300 — Professional Services",
  "5200 — Accrued Expenses",
  "1100 — Accounts Receivable",
] as const;

export type FilterLabel = "Status" | "Department" | "Priority";

export const FILTER_OPTIONS: Record<FilterLabel, readonly string[]> = {
  Status: RECORD_STATUSES,
  Department: DEPARTMENTS,
  Priority: PRIORITY_LEVELS,
};

export function SelectShell({
  children,
  defaultValue,
  id,
  placeholder = "Select…",
  size,
  state,
}: {
  readonly children: ReactNode;
  readonly defaultValue?: string;
  readonly id?: string;
  readonly placeholder?: string;
  readonly size?: "sm" | "md";
  readonly state?: GovernedState;
}) {
  return (
    <Select
      {...(defaultValue ? { defaultValue } : {})}
      {...(state ? { state } : {})}
    >
      <SelectTrigger id={id} {...(size ? { size } : {})}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}

export function LabeledSelect({
  children,
  defaultValue,
  id,
  label,
  placeholder,
  required,
  size,
  state,
}: {
  readonly children: ReactNode;
  readonly defaultValue?: string;
  readonly id: string;
  readonly label: string;
  readonly placeholder?: string;
  readonly required?: boolean;
  readonly size?: "sm" | "md";
  readonly state?: GovernedState;
}) {
  return (
    <StoryStack gap="xs">
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span aria-hidden="true" className="text-destructive">
            {" "}
            *
          </span>
        ) : null}
      </Label>
      <SelectShell
        id={id}
        {...(defaultValue ? { defaultValue } : {})}
        {...(placeholder ? { placeholder } : {})}
        {...(size ? { size } : {})}
        {...(state ? { state } : {})}
      >
        {children}
      </SelectShell>
    </StoryStack>
  );
}

export function ControlledSelectDemo() {
  const [value, setValue] = useState("pending");

  return (
    <StoryStack gap="sm">
      <Select onValueChange={setValue} value={value}>
        <SelectTrigger id="controlled-status">
          <SelectValue placeholder="Select status…" />
        </SelectTrigger>
        <SelectContent>
          {RECORD_STATUSES.map((status) => (
            <SelectItem key={status} value={status.toLowerCase()}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-muted-foreground text-xs">
        Selected value: <Badge emphasis="soft">{value}</Badge>
      </span>
    </StoryStack>
  );
}
