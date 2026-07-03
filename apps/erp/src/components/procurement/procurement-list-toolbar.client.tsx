"use client";

import { Button, SearchDialogBlock } from "@afenda/shadcn-studio";
import {
  ArrowDownWideNarrowIcon,
  PlusCircleIcon,
  SearchIcon,
} from "lucide-react";

export interface ProcurementListToolbarProps {
  readonly createLabel: string;
  readonly searchLabel: string;
}

export function ProcurementListToolbar({
  createLabel,
  searchLabel,
}: ProcurementListToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchDialogBlock
        trigger={
          <Button aria-label={searchLabel} className="gap-2" variant="outline">
            <SearchIcon className="size-4" />
            {searchLabel}
          </Button>
        }
      />
      <Button className="gap-2" variant="outline">
        <ArrowDownWideNarrowIcon className="size-4" />
        Sort
      </Button>
      <Button className="gap-2">
        <PlusCircleIcon className="size-4" />
        {createLabel}
      </Button>
    </div>
  );
}
