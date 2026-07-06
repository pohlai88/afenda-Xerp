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
import { SearchIcon, SlidersHorizontalIcon, WrenchIcon } from "lucide-react";
import { useState } from "react";

export interface WorkspaceDashboardToolbarProps {
  readonly canEditLayout: boolean;
  readonly editMode?: boolean;
  readonly onEditModeChange?: (nextEditMode: boolean) => void;
}

export function WorkspaceDashboardToolbar({
  canEditLayout,
  editMode = false,
  onEditModeChange,
}: WorkspaceDashboardToolbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        aria-label="Search workspace"
        className="gap-2"
        onClick={() => setSearchOpen(true)}
        type="button"
        variant="outline"
      >
        <SearchIcon className="size-4" />
        Search workspace
      </Button>
      <Dialog onOpenChange={setSearchOpen} open={searchOpen}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogTitle className="sr-only">Search workspace</DialogTitle>
          <Command>
            <CommandInput placeholder="Search workspace…" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
      <Button className="gap-2" variant="outline">
        <SlidersHorizontalIcon className="size-4" />
        Filter widgets
      </Button>
      <Button
        aria-pressed={editMode}
        className="gap-2"
        disabled={!canEditLayout}
        onClick={() => {
          onEditModeChange?.(!editMode);
        }}
        type="button"
        variant={editMode ? "default" : "outline"}
      >
        <WrenchIcon className="size-4" />
        {!canEditLayout
          ? "Layout edit locked"
          : editMode
            ? "Done editing layout"
            : "Edit dashboard layout"}
      </Button>
    </div>
  );
}
