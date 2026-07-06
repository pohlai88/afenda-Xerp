"use client";

import { Button } from "@afenda/shadcn-studio-v2/clients";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@afenda/shadcn-studio-v2";
import {
  PlusCircleIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import { useState } from "react";

export interface ProcurementListToolbarProps {
  readonly createLabel: string;
  readonly searchLabel: string;
}

export function ProcurementListToolbar({
  createLabel,
  searchLabel,
}: ProcurementListToolbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        aria-label={searchLabel}
        className="gap-2"
        onClick={() => setSearchOpen(true)}
        type="button"
        variant="outline"
      >
        <SearchIcon className="size-4" />
        {searchLabel}
      </Button>
      <Dialog onOpenChange={setSearchOpen} open={searchOpen}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogTitle className="sr-only">{searchLabel}</DialogTitle>
          <Command>
            <CommandInput placeholder={`${searchLabel}…`} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
      <Button className="gap-2" variant="outline">
        <SlidersHorizontalIcon className="size-4" />
        Filters
      </Button>
      <Button className="gap-2">
        <PlusCircleIcon className="size-4" />
        {createLabel}
      </Button>
    </div>
  );
}
