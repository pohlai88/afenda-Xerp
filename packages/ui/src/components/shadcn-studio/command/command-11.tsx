/**
 * shadcn/studio — command-11 (staging reference only)
 * Source: @ss-components/command-11 · new-york-v4
 *
 * Raw MCP output — DO NOT import from consumer packages.
 * Normalized implementation: packages/ui/src/components/_storybook/command/
 *
 * Patterns extracted:
 *   - CommandDialog + nested RadioGroup sections (category, sort, time)
 *   - Checkbox multi-select inside CommandItem rows with tabular-nums counts
 *   - Outline trigger via governed Button (emphasis="outline" intent="secondary")
 *   - Flex layout on [data-slot="command"] and [data-slot="command-list"] via CSS
 *   - Filter row hover/focus via BEM — not className on RadioGroup/Label
 *
 * DO NOT import from consumer packages. Read and adapt patterns only.
 */
"use client";

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
import { SlidersHorizontalIcon } from "lucide-react";
import * as React from "react";

const marketingBlocks = [
  { id: "announcements", label: "Announcements", count: 10 },
  { id: "backgrounds", label: "Backgrounds", count: 33 },
  { id: "borders", label: "Borders", count: 12 },
  { id: "calls-to-action", label: "Calls to Action", count: 34 },
  { id: "clients", label: "Clients", count: 16 },
  { id: "comparisons", label: "Comparisons", count: 6 },
  { id: "docks", label: "Docks", count: 7 },
  { id: "features", label: "Features", count: 36 },
  { id: "footers", label: "Footers", count: 14 },
  { id: "heroes", label: "Heroes", count: 73 },
];

const uiComponents = [
  { id: "accordions", label: "Accordions", count: 40 },
  { id: "ai-chats", label: "AI Chats", count: 30 },
  { id: "alerts", label: "Alerts", count: 23 },
  { id: "avatars", label: "Avatars", count: 17 },
  { id: "badges", label: "Badges", count: 25 },
];

const CommandFilterSearch = () => {
  const [open, setOpen] = React.useState(false);
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});
  const [category, setCategory] = React.useState("all");
  const [sort, setSort] = React.useState("recommended");
  const [time, setTime] = React.useState("all-time");

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col gap-4">
      <Button
        className="w-40 justify-start gap-2"
        onClick={() => setOpen(true)}
        variant="outline"
      >
        <SlidersHorizontalIcon className="size-4" />
        Search & Filter
      </Button>

      <CommandDialog onOpenChange={setOpen} open={open}>
        <Command className="flex flex-col overflow-hidden">
          <CommandInput placeholder="Search..." />

          <CommandList className="flex-1 overflow-y-auto">
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Category">
              <RadioGroup
                className="gap-0 px-2"
                onValueChange={setCategory}
                value={category}
              >
                {[
                  { value: "all", label: "All" },
                  { value: "marketing-blocks", label: "Marketing Blocks" },
                  { value: "ui-components", label: "UI Components" },
                ].map(({ value, label }) => (
                  <div
                    className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5"
                    key={value}
                  >
                    <RadioGroupItem id={`category-${value}`} value={value} />
                    <Label
                      className="cursor-pointer text-sm font-normal"
                      htmlFor={`category-${value}`}
                    >
                      {label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CommandGroup>
            <CommandSeparator />

            <CommandGroup heading="Sort">
              <RadioGroup
                className="gap-0 px-2"
                onValueChange={setSort}
                value={sort}
              >
                {[
                  { value: "recommended", label: "Recommended" },
                  { value: "most-downloaded", label: "Most downloaded" },
                  { value: "most-bookmarked", label: "Most bookmarked" },
                  { value: "newest", label: "Newest" },
                ].map(({ value, label }) => (
                  <div
                    className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5"
                    key={value}
                  >
                    <RadioGroupItem id={`sort-${value}`} value={value} />
                    <Label
                      className="cursor-pointer text-sm font-normal"
                      htmlFor={`sort-${value}`}
                    >
                      {label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CommandGroup>
            <CommandSeparator />

            <CommandGroup heading="Time">
              <RadioGroup
                className="gap-0 px-2"
                onValueChange={setTime}
                value={time}
              >
                {[
                  { value: "all-time", label: "All time" },
                  { value: "last-week", label: "Last week" },
                  { value: "last-month", label: "Last month" },
                  { value: "last-3-months", label: "Last 3 months" },
                  { value: "last-year", label: "Last year" },
                ].map(({ value, label }) => (
                  <div
                    className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5"
                    key={value}
                  >
                    <RadioGroupItem id={`time-${value}`} value={value} />
                    <Label
                      className="cursor-pointer text-sm font-normal"
                      htmlFor={`time-${value}`}
                    >
                      {label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CommandGroup>
            <CommandSeparator />

            <CommandGroup heading="Marketing Blocks">
              {marketingBlocks.map(({ id, label, count }) => (
                <CommandItem
                  className="flex items-center justify-between"
                  key={id}
                  onSelect={() => toggle(id)}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={!!checked[id]}
                      onCheckedChange={() => toggle(id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span>{label}</span>
                  </div>
                  <span className="text-muted-foreground text-xs">{count}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="UI Components">
              {uiComponents.map(({ id, label, count }) => (
                <CommandItem
                  className="flex items-center justify-between"
                  key={id}
                  onSelect={() => toggle(id)}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={!!checked[id]}
                      onCheckedChange={() => toggle(id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span>{label}</span>
                  </div>
                  <span className="text-muted-foreground text-xs">{count}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};

export default CommandFilterSearch;
