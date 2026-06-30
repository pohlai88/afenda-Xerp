"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useId, useMemo, useState } from "react";

import { blockSlotDomMarkerProps } from "../../../../../contracts/block-slot-dom-marker.contract.js";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

const WorkspaceName = () => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("Indian/Cocos");

  // Fetch supported timezones
  const timezones = Intl.supportedValuesOf("timeZone");

  const formattedTimezones = useMemo(() => {
    return timezones
      .map((timezone) => {
        const formatter = new Intl.DateTimeFormat("en", {
          timeZone: timezone,
          timeZoneName: "shortOffset",
        });

        const parts = formatter.formatToParts(new Date());
        const offset =
          parts.find((part) => part.type === "timeZoneName")?.value || "";
        const formattedOffset = offset === "GMT" ? "GMT+0" : offset;

        return {
          value: timezone,
          label: `(${formattedOffset}) ${timezone.replace(/_/g, " ")}`,
          numericOffset: Number.parseInt(
            formattedOffset.replace("GMT", "").replace("+", "") || "0",
            10
          ),
        };
      })
      .sort((a, b) => a.numericOffset - b.numericOffset); // Sort by numeric offset
  }, [timezones]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Workspace Name */}
        <div {...blockSlotDomMarkerProps("profile.avatar")} className="flex flex-col space-y-1">
          <h3 className="font-semibold">Workspace Name & TimeZone</h3>
          <p className="text-muted-foreground text-sm">
            Manage your workspace name and time zone settings.
          </p>
        </div>
        {/* Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Workspace Name */}
          <div className="flex flex-col items-start gap-1">
            <Label htmlFor="workspace-name">Workspace Name</Label>
            <Input
              {...blockSlotDomMarkerProps("profile.displayName")}
              defaultValue="Shadcn Studio"
              id="workspace-name"
              placeholder="Shadcn Studio"
            />
          </div>
          {/* Workspace ID */}
          <div className="w-full space-y-2">
            <Label htmlFor="app-id">App ID</Label>
            <Input
              {...blockSlotDomMarkerProps("profile.email")}
              className="read-only:bg-muted"
              defaultValue="0b1c2d3e"
              id="app-id"
              placeholder="App ID"
              readOnly
              type="text"
            />
          </div>
          {/* Workspace timezone */}
          <div className="w-full space-y-2">
            <Label htmlFor={id}>Timezone</Label>
            <Popover onOpenChange={setOpen} open={open}>
              <PopoverTrigger
                render={
                  <Button
                    aria-expanded={open}
                    className="w-full justify-between"
                    id={id}
                    role="combobox"
                    variant="outline"
                  />
                }
              >
                <span className={cn("truncate")}>
                  {value ? (
                    formattedTimezones.find(
                      (timezone) => timezone.value === value
                    )?.label
                  ) : (
                    <span className="text-muted-foreground">
                      Select timezone
                    </span>
                  )}
                </span>
                <ChevronsUpDownIcon
                  aria-hidden="true"
                  className="shrink-0 text-muted-foreground/80"
                />
              </PopoverTrigger>
              <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
                <Command>
                  <CommandInput placeholder="Search timezone" />
                  <CommandList>
                    <CommandEmpty>No timezone found.</CommandEmpty>
                    <CommandGroup>
                      {formattedTimezones.map(({ value: itemValue, label }) => (
                        <CommandItem
                          key={itemValue}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            setOpen(false);
                          }}
                          value={itemValue}
                        >
                          <span className="truncate">{label}</span>
                          {value === itemValue && (
                            <CheckIcon className="ml-auto" size={16} />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex justify-end">
            <Button {...blockSlotDomMarkerProps("profile.save")} className="max-sm:w-full" type="submit">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceName;
