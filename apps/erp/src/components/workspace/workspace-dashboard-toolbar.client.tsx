"use client";

import { Button, SearchDialogBlock } from "@afenda/shadcn-studio";
import { SearchIcon, SlidersHorizontalIcon, WrenchIcon } from "lucide-react";

export interface WorkspaceDashboardToolbarProps {
  readonly canEditLayout: boolean;
}

export function WorkspaceDashboardToolbar({
  canEditLayout,
}: WorkspaceDashboardToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchDialogBlock
        trigger={
          <Button
            aria-label="Search workspace"
            className="gap-2"
            variant="outline"
          >
            <SearchIcon className="size-4" />
            Search workspace
          </Button>
        }
      />
      <Button className="gap-2" variant="outline">
        <SlidersHorizontalIcon className="size-4" />
        Filter widgets
      </Button>
      <Button className="gap-2" disabled={!canEditLayout}>
        <WrenchIcon className="size-4" />
        {canEditLayout ? "Edit dashboard layout" : "Layout edit locked"}
      </Button>
    </div>
  );
}
