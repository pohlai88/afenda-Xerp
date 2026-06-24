"use client";

import { SlidersHorizontalIcon } from "lucide-react";
import type { ReactNode } from "react";
import * as React from "react";
import { Button } from "../../button";
import { Checkbox } from "../../checkbox";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../../command";
import { Label } from "../../label";
import { RadioGroup, RadioGroupItem } from "../../radio-group";
import {
  COMMAND_FILTER_CATEGORY_OPTIONS,
  COMMAND_FILTER_DIALOG_DESCRIPTION,
  COMMAND_FILTER_DIALOG_TITLE,
  COMMAND_FILTER_ERP_SURFACES,
  COMMAND_FILTER_FOUNDATION_MODULES,
  COMMAND_FILTER_SORT_OPTIONS,
  COMMAND_FILTER_TIME_OPTIONS,
  type CommandFilterCheckItem,
  type CommandFilterOption,
} from "./command-fixtures";

export interface StorybookCommandFilterSearchProps {
  readonly defaultOpen?: boolean;
  readonly erpSurfaces?: readonly CommandFilterCheckItem[];
  readonly foundationModules?: readonly CommandFilterCheckItem[];
}

interface CommandFilterRadioSectionProps {
  readonly idPrefix: string;
  readonly onValueChange: (value: string) => void;
  readonly options: readonly CommandFilterOption[];
  readonly value: string;
}

function CommandFilterRadioSection({
  idPrefix,
  options,
  value,
  onValueChange,
}: CommandFilterRadioSectionProps): ReactNode {
  return (
    <RadioGroup onValueChange={onValueChange} value={value}>
      <div className="afenda-storybook-command__radio-group">
        {options.map(({ value: optionValue, label }) => (
          <div
            className="afenda-storybook-command__filter-row"
            key={optionValue}
            onClick={() => onValueChange(optionValue)}
            role="presentation"
          >
            <RadioGroupItem
              id={`${idPrefix}-${optionValue}`}
              value={optionValue}
            />
            <Label htmlFor={`${idPrefix}-${optionValue}`}>{label}</Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
}

interface CommandFilterChecklistProps {
  readonly checked: Readonly<Record<string, boolean>>;
  readonly heading: string;
  readonly items: readonly CommandFilterCheckItem[];
  readonly onToggle: (id: string) => void;
}

function CommandFilterChecklist({
  checked,
  heading,
  items,
  onToggle,
}: CommandFilterChecklistProps): ReactNode {
  return (
    <CommandGroup heading={heading}>
      {items.map(({ id, label, count }) => (
        <CommandItem key={id} onSelect={() => onToggle(id)}>
          <div className="afenda-storybook-command__item-row">
            <div className="afenda-storybook-command__item-main">
              <Checkbox
                checked={!!checked[id]}
                onCheckedChange={() => onToggle(id)}
                onClick={(event) => event.stopPropagation()}
              />
              <span>{label}</span>
            </div>
            <span className="afenda-storybook-command__item-count">
              {count}
            </span>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}

/**
 * Storybook-only command filter dialog — normalized from shadcn-studio command-11.
 *
 * Phase 3 normalization:
 *   - Zero className on Button, Command*, Checkbox, Label, RadioGroup*
 *   - Layout, hover, and scroll in command-preview.css via BEM + data-slot selectors
 *   - Button: emphasis="outline" intent="secondary" size="sm" (not stock variant strings)
 */
export function StorybookCommandFilterSearch({
  defaultOpen,
  foundationModules = COMMAND_FILTER_FOUNDATION_MODULES,
  erpSurfaces = COMMAND_FILTER_ERP_SURFACES,
}: StorybookCommandFilterSearchProps): ReactNode {
  const [open, setOpen] = React.useState(defaultOpen ?? false);
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const [category, setCategory] = React.useState("all");
  const [sort, setSort] = React.useState("recommended");
  const [time, setTime] = React.useState("all-time");

  const toggle = (id: string) =>
    setChecked((previous) => ({ ...previous, [id]: !previous[id] }));

  return (
    <div className="afenda-storybook-command">
      <div className="afenda-storybook-command__trigger">
        <Button
          emphasis="outline"
          intent="secondary"
          onClick={() => setOpen(true)}
          size="sm"
        >
          <SlidersHorizontalIcon aria-hidden="true" />
          Search &amp; filter
        </Button>
      </div>

      <CommandDialog
        description={COMMAND_FILTER_DIALOG_DESCRIPTION}
        onOpenChange={setOpen}
        open={open}
        title={COMMAND_FILTER_DIALOG_TITLE}
      >
        <Command>
          <CommandInput placeholder="Search modules and surfaces…" />

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Category">
              <CommandFilterRadioSection
                idPrefix="category"
                onValueChange={setCategory}
                options={COMMAND_FILTER_CATEGORY_OPTIONS}
                value={category}
              />
            </CommandGroup>
            <CommandSeparator />

            <CommandGroup heading="Sort">
              <CommandFilterRadioSection
                idPrefix="sort"
                onValueChange={setSort}
                options={COMMAND_FILTER_SORT_OPTIONS}
                value={sort}
              />
            </CommandGroup>
            <CommandSeparator />

            <CommandGroup heading="Time">
              <CommandFilterRadioSection
                idPrefix="time"
                onValueChange={setTime}
                options={COMMAND_FILTER_TIME_OPTIONS}
                value={time}
              />
            </CommandGroup>
            <CommandSeparator />

            <CommandFilterChecklist
              checked={checked}
              heading="Foundation modules"
              items={foundationModules}
              onToggle={toggle}
            />
            <CommandSeparator />
            <CommandFilterChecklist
              checked={checked}
              heading="ERP surfaces"
              items={erpSurfaces}
              onToggle={toggle}
            />
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
